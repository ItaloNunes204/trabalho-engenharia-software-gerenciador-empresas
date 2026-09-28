import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
    type ReactNode,
} from "react";
import { DemoDataContext, type DemoDataValue } from "./demoDataContext";
import { demoDataReducer } from "./demoDataReducer";
import { PERMISSIONS } from "./labels";
import type {
    CompanyInput,
    PermissionId,
    PermissionMatrix,
    RoleId,
    UserInput,
} from "./types";
import { useAuth } from "../auth/useAuth";
import {
    createCompanyApi,
    createUserApi,
    deleteCompanyApi,
    deleteUserApi,
    fetchCompanies,
    fetchPermissions,
    fetchUsers,
    togglePermissionApi,
    updateCompanyApi,
    updateUserApi,
} from "../services/api";

/** Matriz com todas as permissões desligadas, usada antes de os dados chegarem. */
function createEmptyPermissions(): PermissionMatrix {
    return Object.fromEntries(
        PERMISSIONS.map(({ id }) => [
            id,
            { admin: false, editor: false, viewer: false },
        ]),
    ) as PermissionMatrix;
}

interface DemoDataProviderProps {
    children: ReactNode;
}

export function DemoDataProvider({ children }: DemoDataProviderProps) {
    const { isAuthenticated, token } = useAuth();
    const [state, dispatch] = useReducer(demoDataReducer, {
        companies: [],
        users: [],
        permissions: createEmptyPermissions(),
    });
    // Sessão (token) para a qual os dados já foram carregados. Enquanto não
    // bater com a sessão atual, as telas ainda não têm dados para mostrar.
    const [loadedFor, setLoadedFor] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const isLoading = isAuthenticated && loadedFor !== token;

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch({
                type: "data/loaded",
                companies: [],
                users: [],
                permissions: createEmptyPermissions(),
            });
            setLoadError(null);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const [companies, users, permissions] = await Promise.all([
                    fetchCompanies(),
                    fetchUsers(),
                    fetchPermissions(),
                ]);
                if (cancelled) return;
                dispatch({
                    type: "data/loaded",
                    companies,
                    users,
                    permissions,
                });
                setLoadError(null);
            } catch {
                if (!cancelled) {
                    setLoadError(
                        "Não foi possível carregar os dados do backend. Verifique se ele está rodando.",
                    );
                }
            } finally {
                if (!cancelled) setLoadedFor(token);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, token]);

    const createCompany = useCallback(async (input: CompanyInput) => {
        const company = await createCompanyApi(input);
        dispatch({ type: "company/create", company });
        return company;
    }, []);

    const updateCompany = useCallback(
        async (id: string, input: CompanyInput) => {
            await updateCompanyApi(id, input);
            dispatch({ type: "company/update", id, input });
        },
        [],
    );

    const deleteCompany = useCallback(async (id: string) => {
        await deleteCompanyApi(id);
        dispatch({ type: "company/delete", id });
    }, []);

    const createUser = useCallback(async (input: UserInput) => {
        const user = await createUserApi(input);
        dispatch({ type: "user/create", user });
        return user;
    }, []);

    const updateUser = useCallback(async (id: string, input: UserInput) => {
        await updateUserApi(id, input);
        dispatch({ type: "user/update", id, input });
    }, []);

    const deleteUser = useCallback(async (id: string) => {
        await deleteUserApi(id);
        dispatch({ type: "user/delete", id });
    }, []);

    const togglePermission = useCallback(
        async (permissionId: PermissionId, roleId: RoleId) => {
            await togglePermissionApi(permissionId, roleId);
            dispatch({ type: "permission/toggle", permissionId, roleId });
        },
        [],
    );

    const value = useMemo<DemoDataValue>(
        () => ({
            ...state,
            isLoading,
            loadError,
            createCompany,
            updateCompany,
            deleteCompany,
            createUser,
            updateUser,
            deleteUser,
            togglePermission,
        }),
        [
            state,
            isLoading,
            loadError,
            createCompany,
            updateCompany,
            deleteCompany,
            createUser,
            updateUser,
            deleteUser,
            togglePermission,
        ],
    );

    return (
        <DemoDataContext.Provider value={value}>
            {loadError && (
                <div
                    role="alert"
                    style={{
                        padding: "12px",
                        background: "#fee2e2",
                        color: "#991b1b",
                    }}
                >
                    {loadError}
                </div>
            )}
            {children}
        </DemoDataContext.Provider>
    );
}
