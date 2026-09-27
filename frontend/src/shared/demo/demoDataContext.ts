import { createContext } from "react";
import type {
    Company,
    CompanyInput,
    PermissionId,
    PermissionMatrix,
    RoleId,
    User,
    UserInput,
} from "./types";

export interface DemoDataValue {
    companies: Company[];
    users: User[];
    permissions: PermissionMatrix;
    isLoading: boolean;
    loadError: string | null;
    createCompany: (input: CompanyInput) => Promise<Company>;
    updateCompany: (id: string, input: CompanyInput) => Promise<void>;
    deleteCompany: (id: string) => Promise<void>;
    createUser: (input: UserInput) => Promise<User>;
    updateUser: (id: string, input: UserInput) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    togglePermission: (
        permissionId: PermissionId,
        roleId: RoleId,
    ) => Promise<void>;
}

export const DemoDataContext = createContext<DemoDataValue | null>(null);
