import { Link } from "react-router-dom";
import { Icon } from "../../shared/components/Icon/Icon";

const FEATURES = [
    {
        icon: "companies" as const,
        title: "Empresas",
        description:
            "Cadastre, edite e acompanhe as empresas do seu painel em um só lugar.",
    },
    {
        icon: "users" as const,
        title: "Usuários",
        description:
            "Gerencie os usuários de cada empresa e seus perfis de acesso.",
    },
    {
        icon: "permissions" as const,
        title: "Permissões",
        description: "Configure o que cada perfil pode ver e fazer no sistema.",
    },
    {
        icon: "overview" as const,
        title: "Visão geral",
        description:
            "Acompanhe indicadores consolidados de empresas e usuários.",
    },
];

export function LandingPage() {
    return (
        <div className="landing">
            <header className="landing__header">
                <div className="landing__brand">
                    <span className="sidebar__logo" aria-hidden="true">
                        GE
                    </span>
                    <span>Gerenciador de Empresas</span>
                </div>
                <nav className="landing__nav">
                    <Link to="/login" className="button button--ghost">
                        Entrar
                    </Link>
                    <Link to="/cadastro" className="button button--primary">
                        Cadastrar minha empresa
                    </Link>
                </nav>
            </header>

            <section className="landing__hero">
                <h1>
                    Gerencie empresas, usuários e permissões em um só painel
                </h1>
                <p>
                    Um sistema para administrar o cadastro das suas empresas,
                    controlar quem tem acesso e definir o que cada perfil pode
                    fazer.
                </p>
                <div className="landing__hero-actions">
                    <Link to="/cadastro" className="button button--primary">
                        Começar agora
                    </Link>
                    <Link to="/login" className="button button--secondary">
                        Já tenho uma conta
                    </Link>
                </div>
            </section>

            <section className="landing__features">
                {FEATURES.map((feature) => (
                    <div key={feature.title} className="card landing__feature">
                        <div className="metric__icon">
                            <Icon name={feature.icon} size={22} />
                        </div>
                        <h2>{feature.title}</h2>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </section>

            <footer className="landing__footer">
                <p>Trabalho da disciplina de Engenharia de Software — UFMG.</p>
            </footer>
        </div>
    );
}
