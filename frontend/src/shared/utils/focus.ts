/**
 * Devolve o foco ao controle que abriu um diálogo. Se ele não existir mais
 * (ex.: a linha foi excluída), foca o título da página atual.
 */
export function restoreFocus(element: HTMLElement | null) {
    window.setTimeout(() => {
        if (element?.isConnected) {
            element.focus();
        } else {
            document.querySelector<HTMLElement>("main h1")?.focus();
        }
    }, 0);
}

export function activeHtmlElement(): HTMLElement | null {
    return document.activeElement instanceof HTMLElement ? document.activeElement : null;
}

/** Move o foco para o primeiro campo inválido após a renderização dos erros. */
export function focusFirstInvalidField(form: HTMLFormElement | null) {
    window.requestAnimationFrame(() => {
        form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
}
