import type { Ref } from "react";
import { Icon } from "../Icon/Icon";

interface HeaderProps {
    sectionLabel: string;
    menuOpen: boolean;
    menuId: string;
    onToggleMenu: () => void;
    ref?: Ref<HTMLButtonElement>;
}

export function Header({ sectionLabel, menuOpen, menuId, onToggleMenu, ref }: HeaderProps) {
    return (
        <header className="topbar">
            <button
                ref={ref}
                type="button"
                className="icon-button topbar__menu-button"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={onToggleMenu}
            >
                <Icon name={menuOpen ? "close" : "menu"} size={20} />
            </button>

            <nav aria-label="Trilha de navegação" className="breadcrumb">
                <ol>
                    <li className="breadcrumb__root">Painel administrativo</li>
                    <li aria-current="page">{sectionLabel}</li>
                </ol>
            </nav>

            <span className="demo-pill">
                <span className="demo-pill__dot" aria-hidden="true" />
                Demonstração
            </span>
        </header>
    );
}
