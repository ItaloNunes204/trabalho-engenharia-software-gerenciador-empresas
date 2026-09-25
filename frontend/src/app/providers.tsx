import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../shared/components/Toast/ToastProvider";
import { DemoDataProvider } from "../shared/demo/DemoDataProvider";

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    // O estado da demonstração fica acima das rotas para sobreviver à navegação.
    return (
        <BrowserRouter>
            <DemoDataProvider>
                <ToastProvider>{children}</ToastProvider>
            </DemoDataProvider>
        </BrowserRouter>
    );
}
