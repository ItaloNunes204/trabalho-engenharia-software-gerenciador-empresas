import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    AuthContext,
    type AuthUser,
    type AuthValue,
    type RegisterInput,
} from "./authContext";
import {
    httpClient,
    setAuthToken,
    setUnauthorizedHandler,
} from "../services/httpClient";

const STORAGE_KEY = "gerenciador-empresas:auth";

interface StoredAuth {
    token: string;
    user: AuthUser;
}

function readStoredAuth(): StoredAuth | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as StoredAuth) : null;
    } catch {
        return null;
    }
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readStoredAuth();
        if (stored) {
            setToken(stored.token);
            setUser(stored.user);
            setAuthToken(stored.token);
        }
        setIsReady(true);
    }, []);

    const persist = useCallback((nextToken: string, nextUser: AuthUser) => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ token: nextToken, user: nextUser }),
        );
        setAuthToken(nextToken);
        setToken(nextToken);
        setUser(nextUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
        setToken(null);
        setUser(null);
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(logout);
    }, [logout]);

    const login = useCallback(
        async (email: string, password: string) => {
            const { data } = await httpClient.post("/api/auth/login", {
                email,
                password,
            });
            persist(data.token, data.user);
        },
        [persist],
    );

    const register = useCallback(
        async (input: RegisterInput) => {
            const { data } = await httpClient.post(
                "/api/auth/registrar",
                input,
            );
            persist(data.token, data.user);
        },
        [persist],
    );

    const value = useMemo<AuthValue>(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token),
            isReady,
            login,
            register,
            logout,
        }),
        [user, token, isReady, login, register, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
