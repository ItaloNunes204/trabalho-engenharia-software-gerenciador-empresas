import { Route, Routes } from "react-router-dom";
import { CompaniesPage } from "../features/companies/CompaniesPage";
import { NotFoundPage } from "../features/NotFoundPage";
import { OverviewPage } from "../features/overview/OverviewPage";
import { PermissionsPage } from "../features/permissions/PermissionsPage";
import { UsersPage } from "../features/users/UsersPage";
import { SystemTemplate } from "../shared/layouts/SystemTemplate";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/record" element={<div>Record</div>} />

            <Route element={<SystemTemplate />}>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/empresas" element={<CompaniesPage />} />
                <Route path="/usuarios" element={<UsersPage />} />
                <Route path="/permissoes" element={<PermissionsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
