from datetime import datetime, timedelta

from app import create_app
from app.extensions import db
from app.models.company import Company
from app.models.user import User
from app.models.permission import Permission

PERMISSIONS_SEED = [
    ("Administrador", "Visualizar empresas", True),
    ("Editor", "Visualizar empresas", True),
    ("Visualizador", "Visualizar empresas", True),
    ("Administrador", "Cadastrar empresas", True),
    ("Editor", "Cadastrar empresas", True),
    ("Visualizador", "Cadastrar empresas", False),
    ("Administrador", "Editar empresas", True),
    ("Editor", "Editar empresas", True),
    ("Visualizador", "Editar empresas", False),
    ("Administrador", "Excluir empresas", True),
    ("Editor", "Excluir empresas", False),
    ("Visualizador", "Excluir empresas", False),
    ("Administrador", "Visualizar usuários", True),
    ("Editor", "Visualizar usuários", True),
    ("Visualizador", "Visualizar usuários", True),
    ("Administrador", "Gerenciar usuários", True),
    ("Editor", "Gerenciar usuários", False),
    ("Visualizador", "Gerenciar usuários", False),
    ("Administrador", "Alterar permissões", True),
    ("Editor", "Alterar permissões", False),
    ("Visualizador", "Alterar permissões", False),
]


def seed():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        now = datetime.utcnow()

        companies = [
            Company(
                name="Aurora Tecnologia",
                cnpj="11.111.111/0001-11",
                sector="Tecnologia",
                city="Belo Horizonte / MG",
                status="active",
                email="contato@auroratecnologia.example",
                phone="(31) 99999-0001",
                created_at=now - timedelta(days=6),
            ),
            Company(
                name="Verde Campo",
                cnpj="22.222.222/0001-22",
                sector="Agronegócio",
                city="Uberlândia / MG",
                status="active",
                email="contato@verdecampo.example",
                phone="(34) 99999-0002",
                created_at=now - timedelta(days=5),
            ),
            Company(
                name="Norte Logística",
                cnpj="33.333.333/0001-33",
                sector="Logística",
                city="Contagem / MG",
                status="active",
                email="contato@nortelogistica.example",
                phone="(31) 99999-0003",
                created_at=now - timedelta(days=4),
            ),
            Company(
                name="Studio Forma",
                cnpj="44.444.444/0001-44",
                sector="Design",
                city="São Paulo / SP",
                status="pending",
                email="contato@studioforma.example",
                phone="(11) 99999-0004",
                created_at=now - timedelta(days=3),
            ),
            Company(
                name="Costa & Mar",
                cnpj="55.555.555/0001-55",
                sector="Turismo",
                city="Florianópolis / SC",
                status="inactive",
                email="contato@costaemar.example",
                phone="(48) 99999-0005",
                created_at=now - timedelta(days=2),
            ),
            Company(
                name="Ponto Saúde",
                cnpj="66.666.666/0001-66",
                sector="Saúde",
                city="Belo Horizonte / MG",
                status="active",
                email="contato@pontosaude.example",
                phone="(31) 99999-0006",
                created_at=now - timedelta(days=1),
            ),
        ]
        db.session.add_all(companies)
        db.session.flush()

        users = [
            User(
                name="João Sampaio",
                email="joao.sampaio@auroratecnologia.example",
                company_id=companies[0].id,
                role="Administrador",
                status="active",
                last_access=now - timedelta(hours=3),
            ),
            User(
                name="Marina Souza",
                email="marina.souza@verdecampo.example",
                company_id=companies[1].id,
                role="Editor",
                status="active",
                last_access=now - timedelta(hours=8),
            ),
            User(
                name="Carlos Lima",
                email="carlos.lima@nortelogistica.example",
                company_id=companies[2].id,
                role="Visualizador",
                status="active",
                last_access=now - timedelta(days=1),
            ),
            User(
                name="Beatriz Nunes",
                email="beatriz.nunes@studioforma.example",
                company_id=companies[3].id,
                role="Editor",
                status="pending",
                last_access=None,
            ),
            User(
                name="Felipe Rocha",
                email="felipe.rocha@costaemar.example",
                company_id=companies[4].id,
                role="Visualizador",
                status="inactive",
                last_access=now - timedelta(days=10),
            ),
            User(
                name="Aline Costa",
                email="aline.costa@pontosaude.example",
                company_id=companies[5].id,
                role="Administrador",
                status="active",
                last_access=now - timedelta(hours=1),
            ),
        ]
        db.session.add_all(users)

        for role, functionality, enabled in PERMISSIONS_SEED:
            db.session.add(
                Permission(role=role, functionality=functionality, enabled=enabled)
            )

        db.session.commit()
        print("Seed concluído: 6 empresas, 6 usuários, 21 permissões.")


if __name__ == "__main__":
    seed()
