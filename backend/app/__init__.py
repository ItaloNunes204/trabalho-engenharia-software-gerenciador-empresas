from flask import Flask
from dotenv import load_dotenv

from app.config import Config
from app.extensions import db, migrate, cors


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, origins=app.config["CORS_ORIGINS"])

    from app.routes.companies import companies_bp
    from app.routes.users import users_bp
    from app.routes.permissions import permissions_bp
    from app.routes.overview import overview_bp

    app.register_blueprint(companies_bp, url_prefix="/api/empresas")
    app.register_blueprint(users_bp, url_prefix="/api/usuarios")
    app.register_blueprint(permissions_bp, url_prefix="/api/permissoes")
    app.register_blueprint(overview_bp, url_prefix="/api/overview")

    return app
