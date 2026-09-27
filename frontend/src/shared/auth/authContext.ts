import { createContext } from "react";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    companyId: number;
    companyName: string | null;
    role: string;
    status: string;
}

export interface RegisterInput {
    companyName: string;
    cnpj: string;
    sector: string;
    city: string;
    companyEmail: string;
    phone?: string;
    adminName: string;
    adminEmail: string;
    password: string;
}

export interface AuthValue {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isReady: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthValue | null>(null);
