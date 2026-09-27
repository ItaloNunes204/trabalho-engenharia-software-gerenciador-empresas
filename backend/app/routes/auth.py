from flask import Blueprint, g, jsonify, request
from marshmallow import ValidationError

from app.extensions import db
from app.models.company import Company
from app.models.user import User
from app.schemas.auth_schema import login_schema, register_schema
from app.utils.auth import generate_token, require_auth
from app.utils.errors import error_response, validation_error_response

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/registrar", methods=["POST"])
def register():
    try:
        data = register_schema.load(request.get_json() or {})
    except ValidationError as err:
        return validation_error_response(err.messages)

    if User.query.filter_by(email=data["adminEmail"]).first():
        return error_response("Já existe uma conta com este e-mail", 409)

    company = Company(
        name=data["companyName"],
        cnpj=data["cnpj"],
        sector=data["sector"],
        city=data["city"],
        status="active",
        email=data["companyEmail"],
        phone=data.get("phone"),
    )
    db.session.add(company)
    db.session.flush()

    admin = User(
        name=data["adminName"],
        email=data["adminEmail"],
        company_id=company.id,
        role="Administrador",
        status="active",
    )
    admin.set_password(data["password"])
    db.session.add(admin)
    db.session.commit()

    token = generate_token(admin)
    return (
        jsonify(
            {"token": token, "user": admin.to_dict(), "company": company.to_dict()}
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = login_schema.load(request.get_json() or {})
    except ValidationError as err:
        return validation_error_response(err.messages)

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return error_response("E-mail ou senha inválidos", 401)

    token = generate_token(user)
    return jsonify({"token": token, "user": user.to_dict()})


@auth_bp.route("/me", methods=["GET"])
def me():
    error = require_auth()
    if error:
        return error
    return jsonify(g.current_user.to_dict())
