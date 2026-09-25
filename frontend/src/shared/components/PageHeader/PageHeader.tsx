import type { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description: ReactNode;
    actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="page-header">
            <div>
                {/* tabIndex -1: recebe o foco após uma troca de rota (NAV-004). */}
                <h1 className="page-header__title" tabIndex={-1}>
                    {title}
                </h1>
                <p className="page-header__description">{description}</p>
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
        </div>
    );
}
