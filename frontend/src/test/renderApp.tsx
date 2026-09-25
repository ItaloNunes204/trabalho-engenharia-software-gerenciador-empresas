import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../app/routes";
import { ToastProvider } from "../shared/components/Toast/ToastProvider";
import { DemoDataProvider } from "../shared/demo/DemoDataProvider";

export function renderApp(path = "/") {
    const user = userEvent.setup();
    const result = render(
        <MemoryRouter initialEntries={[path]}>
            <DemoDataProvider>
                <ToastProvider>
                    <AppRoutes />
                </ToastProvider>
            </DemoDataProvider>
        </MemoryRouter>,
    );
    return { user, ...result };
}

/** Linhas do corpo da primeira tabela dentro de `container` (ou da página). */
export function bodyRows(container: HTMLElement = document.body) {
    const table = within(container).getAllByRole("table")[0];
    return within(table).getAllByRole("row").slice(1);
}

export function mainNav() {
    return screen.getByRole("navigation", { name: "Menu principal" });
}

export async function goTo(user: ReturnType<typeof userEvent.setup>, label: string) {
    await user.click(within(mainNav()).getByRole("link", { name: label }));
}
