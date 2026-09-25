import { useCallback, useMemo, useReducer, useRef, type ReactNode } from "react";
import { DemoDataContext, type DemoDataValue } from "./demoDataContext";
import { demoDataReducer } from "./demoDataReducer";
import { INITIAL_COMPANIES, INITIAL_PERMISSIONS, INITIAL_USERS } from "./fixtures";
import type { CompanyInput, PermissionId, RoleId, UserInput } from "./types";
import { todayIsoDate } from "../utils/format";

interface DemoDataProviderProps {
    children: ReactNode;
}

/**
 * Estado compartilhado da demonstração. Vive apenas na memória do navegador:
 * sobrevive à navegação entre rotas e volta aos dados iniciais ao recarregar.
 */
export function DemoDataProvider({ children }: DemoDataProviderProps) {
    const [state, dispatch] = useReducer(demoDataReducer, {
        companies: INITIAL_COMPANIES,
        users: INITIAL_USERS,
        permissions: INITIAL_PERMISSIONS,
    });

    // Contadores monotônicos: um id nunca é reutilizado, mesmo após exclusões.
    const nextCompanyId = useRef(INITIAL_COMPANIES.length + 1);
    const nextUserId = useRef(INITIAL_USERS.length + 1);

    const createCompany = useCallback((input: CompanyInput) => {
        const company = { ...input, id: `c${nextCompanyId.current++}`, createdAt: todayIsoDate() };
        dispatch({ type: "company/create", company });
        return company;
    }, []);

    const updateCompany = useCallback((id: string, input: CompanyInput) => {
        dispatch({ type: "company/update", id, input });
    }, []);

    const deleteCompany = useCallback((id: string) => {
        dispatch({ type: "company/delete", id });
    }, []);

    const createUser = useCallback((input: UserInput) => {
        const user = { ...input, id: `u${nextUserId.current++}`, lastAccess: null };
        dispatch({ type: "user/create", user });
        return user;
    }, []);

    const updateUser = useCallback((id: string, input: UserInput) => {
        dispatch({ type: "user/update", id, input });
    }, []);

    const deleteUser = useCallback((id: string) => {
        dispatch({ type: "user/delete", id });
    }, []);

    const togglePermission = useCallback((permissionId: PermissionId, roleId: RoleId) => {
        dispatch({ type: "permission/toggle", permissionId, roleId });
    }, []);

    const value = useMemo<DemoDataValue>(
        () => ({
            ...state,
            createCompany,
            updateCompany,
            deleteCompany,
            createUser,
            updateUser,
            deleteUser,
            togglePermission,
        }),
        [state, createCompany, updateCompany, deleteCompany, createUser, updateUser, deleteUser, togglePermission],
    );

    return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}
