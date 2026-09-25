import { describe, expect, it } from "vitest";
import { demoDataReducer, type DemoDataState } from "./demoDataReducer";
import { INITIAL_COMPANIES, INITIAL_PERMISSIONS, INITIAL_USERS } from "./fixtures";

const initial: DemoDataState = {
    companies: INITIAL_COMPANIES,
    users: INITIAL_USERS,
    permissions: INITIAL_PERMISSIONS,
};

describe("demoDataReducer", () => {
    it("COM-005: editing keeps the company id and registration date", () => {
        const [aurora] = INITIAL_COMPANIES;
        const next = demoDataReducer(initial, {
            type: "company/update",
            id: aurora.id,
            input: { ...aurora, name: "Aurora Digital" },
        });
        const updated = next.companies.find((company) => company.id === aurora.id);
        expect(updated).toMatchObject({ id: aurora.id, createdAt: aurora.createdAt, name: "Aurora Digital" });
    });

    it("COM-006: deleting a company removes its linked users only", () => {
        const next = demoDataReducer(initial, { type: "company/delete", id: "c1" });
        expect(next.companies.map((company) => company.id)).not.toContain("c1");
        expect(next.users.some((user) => user.companyId === "c1")).toBe(false);
        expect(next.users).toHaveLength(INITIAL_USERS.length - 1);
    });

    it("USR-005: editing a user keeps id and last access", () => {
        const [first] = INITIAL_USERS;
        const next = demoDataReducer(initial, {
            type: "user/update",
            id: first.id,
            input: { name: first.name, email: first.email, companyId: "c2", role: "viewer", status: "inactive" },
        });
        expect(next.users[0]).toMatchObject({ id: first.id, lastAccess: first.lastAccess, companyId: "c2" });
    });

    it("PER-003 / PER-004: toggling inverts one cell and never touches user roles", () => {
        const next = demoDataReducer(initial, {
            type: "permission/toggle",
            permissionId: "companies.delete",
            roleId: "editor",
        });
        expect(next.permissions["companies.delete"].editor).toBe(true);
        expect({ ...next.permissions, "companies.delete": INITIAL_PERMISSIONS["companies.delete"] }).toEqual(
            INITIAL_PERMISSIONS,
        );
        expect(next.permissions["companies.delete"].admin).toBe(true);
        expect(next.permissions["companies.delete"].viewer).toBe(false);
        expect(next.users).toBe(initial.users);

        const restored = demoDataReducer(next, {
            type: "permission/toggle",
            permissionId: "companies.delete",
            roleId: "editor",
        });
        expect(restored.permissions).toEqual(INITIAL_PERMISSIONS);
    });
});
