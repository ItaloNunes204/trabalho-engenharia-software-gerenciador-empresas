import { httpClient } from "./httpClient";
import { PERMISSIONS, ROLES } from "../demo/labels";
import type {
    Company,
    CompanyInput,
    PermissionId,
    PermissionMatrix,
    RoleId,
    User,
    UserInput,
} from "../demo/types";

const ROLE_NAME_TO_ID: Record<string, RoleId> = Object.fromEntries(
    ROLES.map((role) => [role.name, role.id]),
);
const ROLE_ID_TO_NAME: Record<RoleId, string> = Object.fromEntries(
    ROLES.map((role) => [role.id, role.name]),
) as Record<RoleId, string>;

const FUNCTIONALITY_TO_PERMISSION_ID: Record<string, PermissionId> =
    Object.fromEntries(
        PERMISSIONS.map((permission) => [permission.label, permission.id]),
    );
const PERMISSION_ID_TO_FUNCTIONALITY: Record<PermissionId, string> =
    Object.fromEntries(
        PERMISSIONS.map((permission) => [permission.id, permission.label]),
    ) as Record<PermissionId, string>;

interface ApiCompany {
    id: number;
    name: string;
    cnpj: string;
    sector: string;
    city: string;
    status: Company["status"];
    email: string;
    phone: string | null;
    createdAt: string;
}

interface ApiUser {
    id: number;
    name: string;
    email: string;
    companyId: number;
    role: string;
    status: User["status"];
    lastAccess: string | null;
}

interface ApiPermission {
    role: string;
    functionality: string;
    enabled: boolean;
}

function toCompany(api: ApiCompany): Company {
    return {
        id: String(api.id),
        name: api.name,
        cnpj: api.cnpj,
        sector: api.sector,
        city: api.city,
        status: api.status,
        email: api.email,
        phone: api.phone ?? undefined,
        createdAt: api.createdAt.slice(0, 10),
    };
}

function toUser(api: ApiUser): User {
    return {
        id: String(api.id),
        name: api.name,
        email: api.email,
        companyId: String(api.companyId),
        role: ROLE_NAME_TO_ID[api.role] ?? "viewer",
        status: api.status,
        lastAccess: api.lastAccess,
    };
}

function toPermissionMatrix(apiPermissions: ApiPermission[]): PermissionMatrix {
    const matrix = {} as PermissionMatrix;
    for (const permission of PERMISSIONS) {
        matrix[permission.id] = { admin: false, editor: false, viewer: false };
    }
    for (const item of apiPermissions) {
        const permissionId = FUNCTIONALITY_TO_PERMISSION_ID[item.functionality];
        const roleId = ROLE_NAME_TO_ID[item.role];
        if (permissionId && roleId) {
            matrix[permissionId][roleId] = item.enabled;
        }
    }
    return matrix;
}

function fromCompanyInput(input: CompanyInput) {
    return {
        name: input.name,
        cnpj: input.cnpj,
        sector: input.sector,
        city: input.city,
        status: input.status,
        email: input.email,
        phone: input.phone,
    };
}

function fromUserInput(input: UserInput) {
    return {
        name: input.name,
        email: input.email,
        companyId: Number(input.companyId),
        role: ROLE_ID_TO_NAME[input.role],
        status: input.status,
    };
}

export async function fetchCompanies(): Promise<Company[]> {
    const companies: Company[] = [];
    let page = 1;
    while (page <= 50) {
        const { data } = await httpClient.get("/api/empresas", {
            params: { page },
        });
        companies.push(...data.items.map(toCompany));
        if (companies.length >= data.total) break;
        page += 1;
    }
    return companies;
}

export async function fetchUsers(): Promise<User[]> {
    const users: User[] = [];
    let page = 1;
    while (page <= 50) {
        const { data } = await httpClient.get("/api/usuarios", {
            params: { page },
        });
        users.push(...data.items.map(toUser));
        if (users.length >= data.total) break;
        page += 1;
    }
    return users;
}

export async function fetchPermissions(): Promise<PermissionMatrix> {
    const { data } = await httpClient.get("/api/permissoes");
    return toPermissionMatrix(data);
}

export async function createCompanyApi(input: CompanyInput): Promise<Company> {
    const { data } = await httpClient.post(
        "/api/empresas",
        fromCompanyInput(input),
    );
    return toCompany(data.company);
}

export async function updateCompanyApi(
    id: string,
    input: CompanyInput,
): Promise<Company> {
    const { data } = await httpClient.put(
        `/api/empresas/${id}`,
        fromCompanyInput(input),
    );
    return toCompany(data.company);
}

export async function deleteCompanyApi(id: string): Promise<void> {
    await httpClient.delete(`/api/empresas/${id}`);
}

export async function createUserApi(input: UserInput): Promise<User> {
    const { data } = await httpClient.post(
        "/api/usuarios",
        fromUserInput(input),
    );
    return toUser(data.user);
}

export async function updateUserApi(
    id: string,
    input: UserInput,
): Promise<User> {
    const { data } = await httpClient.put(
        `/api/usuarios/${id}`,
        fromUserInput(input),
    );
    return toUser(data.user);
}

export async function deleteUserApi(id: string): Promise<void> {
    await httpClient.delete(`/api/usuarios/${id}`);
}

export async function togglePermissionApi(
    permissionId: PermissionId,
    roleId: RoleId,
): Promise<void> {
    await httpClient.post("/api/permissoes/toggle", {
        role: ROLE_ID_TO_NAME[roleId],
        functionality: PERMISSION_ID_TO_FUNCTIONALITY[permissionId],
    });
}
