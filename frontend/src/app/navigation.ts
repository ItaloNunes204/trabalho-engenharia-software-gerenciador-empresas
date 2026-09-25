import type { IconName } from "../shared/components/Icon/Icon";

export interface NavItem {
    label: string;
    path: string;
    icon: IconName;
}

/** Configuração única usada pelo menu lateral e pela trilha de navegação. */
export const NAV_ITEMS: NavItem[] = [
    { label: "Visão geral", path: "/", icon: "overview" },
    { label: "Empresas", path: "/empresas", icon: "companies" },
    { label: "Usuários", path: "/usuarios", icon: "users" },
    { label: "Permissões", path: "/permissoes", icon: "permissions" },
];

export function findNavItem(pathname: string): NavItem | undefined {
    const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    return NAV_ITEMS.find((item) => item.path === normalized);
}
