import type { ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import { Modal } from "../Modal/Modal";

interface ConfirmDialogProps {
    title: string;
    children: ReactNode;
    confirmLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmDialog({ title, children, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
    return (
        <Modal
            title={title}
            description={children}
            onClose={onCancel}
            size="sm"
            role="alertdialog"
            footer={
                <>
                    <button type="button" className="button button--secondary" onClick={onCancel} data-autofocus>
                        Cancelar
                    </button>
                    <button type="button" className="button button--danger" onClick={onConfirm}>
                        <Icon name="trash" size={16} />
                        {confirmLabel}
                    </button>
                </>
            }
        />
    );
}
