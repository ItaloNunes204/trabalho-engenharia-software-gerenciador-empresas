import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../shared/components/Toast/ToastProvider";
import { AuthProvider } from "../shared/auth/AuthProvider";
import { DemoDataProvider } from "../shared/demo/DemoDataProvider";

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DemoDataProvider>
                    <ToastProvider>{children}</ToastProvider>
                </DemoDataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
