from flask import Blueprint, jsonify

from app.models.company import Company
from app.models.user import User

overview_bp = Blueprint("overview", __name__)

SAMPLE_ACTIVITY = [
    {
        "title": "Nova empresa cadastrada",
        "description": "Um exemplo de movimentação recente no sistema.",
        "time": "há 2 horas",
    },
    {
        "title": "Usuário atualizado",
        "description": "Um exemplo de alteração de perfil de acesso.",
        "time": "há 5 horas",
    },
    {
        "title": "Empresa aprovada",
        "description": "Um exemplo de mudança de situação cadastral.",
        "time": "ontem",
    },
]


@overview_bp.route("", methods=["GET"])
def get_overview():
    total_companies = Company.query.count()
    active_companies = Company.query.filter_by(status="active").count()
    total_users = User.query.count()
    pending_companies = Company.query.filter_by(status="pending").count()
    pending_users = User.query.filter_by(status="pending").count()

    recent_companies = Company.query.order_by(Company.created_at.desc()).limit(4).all()

    return jsonify(
        {
            "totalCompanies": total_companies,
            "activeCompanies": active_companies,
            "totalUsers": total_users,
            "pendingApprovals": pending_companies + pending_users,
            "recentCompanies": [c.to_dict() for c in recent_companies],
            "activityExamples": SAMPLE_ACTIVITY,
        }
    )
