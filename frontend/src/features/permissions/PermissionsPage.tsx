import { Icon } from "../../shared/components/Icon/Icon";
import { PageHeader } from "../../shared/components/PageHeader/PageHeader";
import { useToast } from "../../shared/components/Toast/useToast";
import { PERMISSIONS, ROLES } from "../../shared/demo/labels";
import type { PermissionId, RoleId } from "../../shared/demo/types";
import { useDemoData } from "../../shared/demo/useDemoData";

export function PermissionsPage() {
    const { permissions, togglePermission } = useDemoData();
    const { showToast } = useToast();

    const enabledCount = (roleId: RoleId) => PERMISSIONS.filter(({ id }) => permissions[id][roleId]).length;

    const handleToggle = (permissionId: PermissionId, permissionLabel: string, roleId: RoleId, roleName: string) => {
        const willEnable = !permissions[permissionId][roleId];
        togglePermission(permissionId, roleId);
        showToast(
            `${roleName}: “${permissionLabel}” ${willEnable ? "ativada" : "desativada"} nesta demonstração (sem efeito real de acesso).`,
        );
    };

    return (
        <>
            <PageHeader
                title="Permissões"
                description="Explore quais ações cada perfil de acesso teria. A matriz é apenas uma demonstração da interface."
            />

            <div className="notice notice--info" role="note">
                <Icon name="info" />
                <p>
                    As alterações nesta matriz servem apenas para explorar a interface: não são aplicadas a nenhum
                    usuário, não bloqueiam telas nem ações e não são salvas permanentemente. Ao recarregar a página, a
                    configuração padrão é restaurada.
                </p>
            </div>

            <ul className="roles" aria-label="Perfis de acesso">
                {ROLES.map((role) => {
                    const count = enabledCount(role.id);
                    return (
                        <li key={role.id} className="card role-card">
                            <h2 className="card__title">{role.name}</h2>
                            <p className="role-card__description">{role.defaultDescription}</p>
                            <p className="role-card__count">
                                {count} de {PERMISSIONS.length} funcionalidades ativas nesta sessão
                            </p>
                        </li>
                    );
                })}
            </ul>

            <section className="card" aria-labelledby="matrix-title">
                <header className="card__header">
                    <div>
                        <h2 id="matrix-title" className="card__title">
                            Matriz de permissões
                        </h2>
                        <p className="card__subtitle">Selecione uma célula para ativar ou desativar a funcionalidade.</p>
                    </div>
                </header>
                <div className="table-scroll">
                    <table className="table matrix">
                        <thead>
                            <tr>
                                <th scope="col">Funcionalidade</th>
                                {ROLES.map((role) => (
                                    <th key={role.id} scope="col" className="matrix__role">
                                        {role.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERMISSIONS.map((permission) => (
                                <tr key={permission.id}>
                                    <th scope="row" className="table__primary">
                                        {permission.label}
                                    </th>
                                    {ROLES.map((role) => {
                                        const enabled = permissions[permission.id][role.id];
                                        return (
                                            <td key={role.id} className="matrix__cell">
                                                <button
                                                    type="button"
                                                    className={`toggle${enabled ? " toggle--on" : ""}`}
                                                    aria-pressed={enabled}
                                                    aria-label={`${enabled ? "Desativar" : "Ativar"} ${permission.label} para ${role.name}`}
                                                    onClick={() =>
                                                        handleToggle(permission.id, permission.label, role.id, role.name)
                                                    }
                                                >
                                                    <Icon name={enabled ? "check" : "minus"} size={16} />
                                                    <span aria-hidden="true">{enabled ? "Permitido" : "Sem acesso"}</span>
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
