import { Link } from "react-router-dom";
import { PageHeader } from "../shared/components/PageHeader/PageHeader";

export function NotFoundPage() {
    return (
        <PageHeader
            title="Página não encontrada"
            description={
                <>
                    O endereço acessado não existe neste painel. <Link to="/">Voltar para a Visão geral</Link>.
                </>
            }
        />
    );
}
