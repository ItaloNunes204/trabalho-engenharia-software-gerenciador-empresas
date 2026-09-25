import { Icon } from "../../shared/components/Icon/Icon";
import { Modal } from "../../shared/components/Modal/Modal";
import { StatusBadge } from "../../shared/components/StatusBadge/StatusBadge";
import { NEVER_ACCESSED_LABEL, ROLE_NAMES } from "../../shared/demo/labels";
import type { User } from "../../shared/demo/types";

interface UserDetailsDialogProps {
    user: User;
    companyName: string;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function UserDetailsDialog({ user, companyName, onClose, onEdit, onDelete }: UserDetailsDialogProps) {
    return (
        <Modal
            title={user.name}
            description="Usuário fictício desta demonstração."
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="button button--danger-outline" onClick={onDelete}>
                        <Icon name="trash" size={16} />
                        Excluir usuário
                    </button>
                    <button type="button" className="button button--primary" onClick={onEdit}>
                        <Icon name="edit" size={16} />
                        Editar usuário
                    </button>
                </>
            }
        >
            <dl className="details">
                <div className="details__item details__item--full">
                    <dt>E-mail</dt>
                    <dd className="break">{user.email}</dd>
                </div>
                <div className="details__item">
                    <dt>Situação</dt>
                    <dd>
                        <StatusBadge kind="user" status={user.status} />
                    </dd>
                </div>
                <div className="details__item">
                    <dt>Empresa</dt>
                    <dd>{companyName}</dd>
                </div>
                <div className="details__item">
                    <dt>Perfil de acesso</dt>
                    <dd>{ROLE_NAMES[user.role]}</dd>
                </div>
                <div className="details__item">
                    <dt>Último acesso</dt>
                    <dd>{user.lastAccess ?? NEVER_ACCESSED_LABEL}</dd>
                </div>
            </dl>
        </Modal>
    );
}
