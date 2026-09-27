import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../../app/navigation";
import { useAuth } from "../../auth/useAuth";
import { Icon } from "../Icon/Icon";

interface SidebarProps {
    id: string;
    open: boolean;
    onNavigate: () => void;
}

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export function Sidebar({ id, open, onNavigate }: SidebarProps) {
    const { user, logout } = useAuth();

    return (
        <aside id={id} className={`sidebar${open ? " sidebar--open" : ""}`}>
            <div className="sidebar__brand">
                <span className="sidebar__logo" aria-hidden="true">
                    GE
                </span>
                <span className="sidebar__product">
                    Gerenciador de Empresas
                </span>
            </div>

            {user && (
                <div className="sidebar__workspace">
                    <span className="sidebar__caption">Empresa</span>
                    <span className="sidebar__workspace-name">
                        {user.companyName ?? "—"}
                    </span>
                </div>
            )}

            <nav aria-label="Menu principal" className="sidebar__nav">
                <ul>
                    {NAV_ITEMS.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end
                                className="sidebar__link"
                                onClick={onNavigate}
                            >
                                <Icon name={item.icon} />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {user && (
                <div className="sidebar__profile">
                    <span className="sidebar__avatar" aria-hidden="true">
                        {initials(user.name)}
                    </span>
                    <div>
                        <p className="sidebar__profile-name">{user.name}</p>
                        <p className="sidebar__profile-role">{user.role}</p>
                    </div>
                    <button
                        type="button"
                        className="icon-button sidebar__logout"
                        aria-label="Sair"
                        onClick={logout}
                    >
                        <Icon name="logout" size={18} />
                    </button>
                </div>
            )}
        </aside>
    );
}
