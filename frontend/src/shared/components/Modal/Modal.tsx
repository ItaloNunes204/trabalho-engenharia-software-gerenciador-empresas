import { useEffect, useId, useRef, type ReactNode } from "react";
import { Icon } from "../Icon/Icon";

interface ModalProps {
    title: string;
    description?: ReactNode;
    onClose: () => void;
    children?: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md";
    role?: "dialog" | "alertdialog";
}

/**
 * Diálogo modal baseado em <dialog>.showModal(): o navegador torna o restante
 * da página inerte (foco contido) e o Escape dispara `cancel`, que fecha via
 * `onClose`. Um elemento com `data-autofocus` recebe o foco inicial.
 * A restauração do foco fica com quem abriu o diálogo.
 */
export function Modal({ title, description, onClose, children, footer, size = "md", role = "dialog" }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (!dialog.open) dialog.showModal();
        dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
        return () => {
            if (dialog.open) dialog.close();
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            className={`modal modal--${size}`}
            role={role === "alertdialog" ? "alertdialog" : undefined}
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClose={() => {
                // Fechamento feito pelo próprio navegador (ex.: Escape repetido).
                if (!dialogRef.current?.open) onClose();
            }}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="modal__surface">
                <header className="modal__header">
                    <div>
                        <h2 id={titleId} className="modal__title">
                            {title}
                        </h2>
                        {description && (
                            <p id={descriptionId} className="modal__description">
                                {description}
                            </p>
                        )}
                    </div>
                    <button type="button" className="icon-button" aria-label="Fechar" onClick={onClose}>
                        <Icon name="close" />
                    </button>
                </header>
                {children && <div className="modal__body">{children}</div>}
                {footer && <footer className="modal__footer">{footer}</footer>}
            </div>
        </dialog>
    );
}
