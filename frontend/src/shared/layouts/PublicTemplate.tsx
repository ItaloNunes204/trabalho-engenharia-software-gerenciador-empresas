import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PublicTemplateProps {
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
}

export function PublicTemplate({
    title,
    description,
    children,
    footer,
}: PublicTemplateProps) {
    return (
        <div className="public-page">
            <div className="public-page__card card">
                <Link to="/apresentacao" className="public-page__brand">
                    <span className="sidebar__logo" aria-hidden="true">
                        GE
                    </span>
                    <span>Gerenciador de Empresas</span>
                </Link>
                <h1 className="public-page__title">{title}</h1>
                {description && (
                    <p className="public-page__description">{description}</p>
                )}
                {children}
                {footer && <div className="public-page__footer">{footer}</div>}
            </div>
        </div>
    );
}
