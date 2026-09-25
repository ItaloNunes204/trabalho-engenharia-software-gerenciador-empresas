import type {
    Company,
    CompanyInput,
    PermissionId,
    PermissionMatrix,
    RoleId,
    User,
    UserInput,
} from "./types";

export interface DemoDataState {
    companies: Company[];
    users: User[];
    permissions: PermissionMatrix;
}

export type DemoDataAction =
    | { type: "company/create"; company: Company }
    | { type: "company/update"; id: string; input: CompanyInput }
    | { type: "company/delete"; id: string }
    | { type: "user/create"; user: User }
    | { type: "user/update"; id: string; input: UserInput }
    | { type: "user/delete"; id: string }
    | { type: "permission/toggle"; permissionId: PermissionId; roleId: RoleId };

export function demoDataReducer(state: DemoDataState, action: DemoDataAction): DemoDataState {
    switch (action.type) {
        case "company/create":
            return { ...state, companies: [...state.companies, action.company] };
        case "company/update":
            return {
                ...state,
                companies: state.companies.map((company) =>
                    company.id === action.id ? { ...company, ...action.input } : company,
                ),
            };
        case "company/delete":
            // Exclusão em cascata apenas como comportamento da demonstração (COM-006).
            return {
                ...state,
                companies: state.companies.filter((company) => company.id !== action.id),
                users: state.users.filter((user) => user.companyId !== action.id),
            };
        case "user/create":
            return { ...state, users: [...state.users, action.user] };
        case "user/update":
            return {
                ...state,
                users: state.users.map((user) => (user.id === action.id ? { ...user, ...action.input } : user)),
            };
        case "user/delete":
            return { ...state, users: state.users.filter((user) => user.id !== action.id) };
        case "permission/toggle": {
            const row = state.permissions[action.permissionId];
            return {
                ...state,
                permissions: {
                    ...state.permissions,
                    [action.permissionId]: { ...row, [action.roleId]: !row[action.roleId] },
                },
            };
        }
    }
}
