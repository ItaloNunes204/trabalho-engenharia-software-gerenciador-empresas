import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export function PublicOnlyRoute() {
    const { isAuthenticated, isReady } = useAuth();

    if (!isReady) return null;
    if (isAuthenticated) return <Navigate to="/" replace />;
    return <Outlet />;
}
