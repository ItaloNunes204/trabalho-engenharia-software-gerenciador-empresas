import { createContext } from "react";
import type { Company, CompanyInput, PermissionId, PermissionMatrix, RoleId, User, UserInput } from "./types";

export interface DemoDataValue {
    companies: Company[];
    users: User[];
    permissions: PermissionMatrix;
    createCompany: (input: CompanyInput) => Company;
    updateCompany: (id: string, input: CompanyInput) => void;
    deleteCompany: (id: string) => void;
    createUser: (input: UserInput) => User;
    updateUser: (id: string, input: UserInput) => void;
    deleteUser: (id: string) => void;
    togglePermission: (permissionId: PermissionId, roleId: RoleId) => void;
}

export const DemoDataContext = createContext<DemoDataValue | null>(null);
