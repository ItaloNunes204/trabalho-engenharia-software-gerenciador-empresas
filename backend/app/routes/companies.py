from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.company import Company
from app.models.user import User
from app.schemas.company_schema import company_schema
from app.utils.errors import error_response, validation_error_response, paginate
from app.utils.auth import require_auth

companies_bp = Blueprint("companies", __name__)
companies_bp.before_request(require_auth)


@companies_bp.route("", methods=["GET"])
def list_companies():
    search = request.args.get("search", "").strip().lower()
    status = request.args.get("status", "all")
    page = int(request.args.get("page", 1))

    query = Company.query

    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Company.name.ilike(like),
                Company.cnpj.ilike(like),
                Company.sector.ilike(like),
                Company.city.ilike(like),
            )
        )

    if status in ["active", "pending", "inactive"]:
        query = query.filter(Company.status == status)

    query = query.order_by(Company.created_at.desc())
    items, total = paginate(query, page)

    return jsonify(
        {
            "items": [c.to_dict() for c in items],
            "total": total,
            "page": page,
            "perPage": 5,
        }
    )


@companies_bp.route("/<int:company_id>", methods=["GET"])
def get_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return error_response("Empresa não encontrada", 404)
    return jsonify(company.to_dict())


@companies_bp.route("", methods=["POST"])
def create_company():
    try:
        data = company_schema.load(request.get_json() or {})
    except ValidationError as err:
        return validation_error_response(err.messages)

    company = Company(**data)
    db.session.add(company)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Empresa criada com sucesso (demonstração)",
                "company": company.to_dict(),
            }
        ),
        201,
    )


@companies_bp.route("/<int:company_id>", methods=["PUT"])
def update_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return error_response("Empresa não encontrada", 404)

    try:
        data = company_schema.load(request.get_json() or {})
    except ValidationError as err:
        return validation_error_response(err.messages)

    for field, value in data.items():
        setattr(company, field, value)

    db.session.commit()

    return jsonify(
        {
            "message": "Empresa atualizada com sucesso (demonstração)",
            "company": company.to_dict(),
        }
    )


@companies_bp.route("/<int:company_id>", methods=["DELETE"])
def delete_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return error_response("Empresa não encontrada", 404)

    User.query.filter_by(company_id=company_id).delete()
    db.session.delete(company)
    db.session.commit()

    return jsonify(
        {"message": "Empresa e usuários vinculados removidos (demonstração)"}
    )
