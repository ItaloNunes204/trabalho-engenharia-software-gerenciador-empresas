import { CompanySignupPage } from "../features/auth/CompanySignupPage";
import { LoginPage } from "../features/auth/LoginPage";
import { LandingPage } from "../features/landing/LandingPage";
import { CompaniesPage } from "../features/companies/CompaniesPage";
import { NotFoundPage } from "../features/NotFoundPage";
import { OverviewPage } from "../features/overview/OverviewPage";
import { PermissionsPage } from "../features/permissions/PermissionsPage";
import { UsersPage } from "../features/users/UsersPage";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "../shared/auth/useAuth";
import { ProtectedRoute } from "../shared/auth/ProtectedRoute";
import { PublicOnlyRoute } from "../shared/auth/PublicOnlyRoute";
import { SystemTemplate } from "../shared/layouts/SystemTemplate";

function RootRoute() {
    const { isAuthenticated, isReady } = useAuth();
    if (!isReady) return null;
    if (!isAuthenticated) return <LandingPage />;
    return (
        <SystemTemplate>
            <OverviewPage />
        </SystemTemplate>
    );
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/apresentacao" element={<LandingPage />} />

            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/cadastro" element={<CompanySignupPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<SystemTemplate />}>
                    <Route path="/empresas" element={<CompaniesPage />} />
                    <Route path="/usuarios" element={<UsersPage />} />
                    <Route path="/permissoes" element={<PermissionsPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
