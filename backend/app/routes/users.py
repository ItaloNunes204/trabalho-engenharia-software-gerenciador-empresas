from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
import secrets

from app.extensions import db
from app.models.user import User
from app.models.company import Company
from app.schemas.user_schema import user_schema
from app.utils.errors import error_response, validation_error_response, paginate
from app.utils.auth import require_auth

users_bp = Blueprint("users", __name__)
users_bp.before_request(require_auth)


@users_bp.route("", methods=["GET"])
def list_users():
    search = request.args.get("search", "").strip().lower()
    status = request.args.get("status", "all")
    page = int(request.args.get("page", 1))

    query = User.query.join(Company)

    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                User.name.ilike(like),
                User.email.ilike(like),
                Company.name.ilike(like),
                User.role.ilike(like),
            )
        )

    if status in ["active", "pending", "inactive"]:
        query = query.filter(User.status == status)

    query = query.order_by(User.id.desc())
    items, total = paginate(query, page)

    return jsonify(
        {
            "items": [u.to_dict() for u in items],
            "total": total,
            "page": page,
            "perPage": 5,
        }
    )


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response("Usuário não encontrado", 404)
    return jsonify(user.to_dict())


@users_bp.route("", methods=["POST"])
def create_user():
    try:
        data = user_schema.load(request.get_json() or {})
    except ValidationError as err:
        return validation_error_response(err.messages)

    company = Company.query.get(data["companyId"])
    if not company:
        return error_response("Empresa informada não existe", 422)

    user = User(
        name=data["name"],
        email=data["email"],
        company_id=data["companyId"],
        role=data["role"],
        status=data["status"],
        last_access=None,
    )
    user.set_password(secrets.token_urlsafe(12))
    db.session.add(user)
    db.session.commit()

    return (
        jsonify({"message": "Usuário criado com sucesso", "user": user.to_dict()}),
        201,
    )


@users_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response("Usuário não encontrado", 404)

    try:
        data = user_schema.load(request.get_json() or {})
    except ValidationError as err:
        return validation_error_response(err.messages)

    company = Company.query.get(data["companyId"])
    if not company:
        return error_response("Empresa informada não existe", 422)

    user.name = data["name"]
    user.email = data["email"]
    user.company_id = data["companyId"]
    user.role = data["role"]
    user.status = data["status"]
    db.session.commit()

    return jsonify(
        {
            "message": "Usuário atualizado com sucesso (demonstração)",
            "user": user.to_dict(),
        }
    )


@users_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return error_response("Usuário não encontrado", 404)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Usuário removido com sucesso (demonstração)"})
