from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from app.extensions import db
from app.models.permission import Permission
from app.schemas.permission_schema import permission_toggle_schema
from app.utils.errors import error_response, validation_error_response

from app.utils.auth import require_auth


permissions_bp = Blueprint("permissions", __name__)
permissions_bp.before_request(require_auth)


@permissions_bp.route("", methods=["GET"])
def list_permissions():
    permissions = Permission.query.all()
    return jsonify([p.to_dict() for p in permissions])


@permissions_bp.route("/toggle", methods=["POST"])
def toggle_permission():
    try:
        data = permission_toggle_schema.load(request.get_json() or {})
    except ValidationError as err:
        return validation_error_response(err.messages)

    permission = Permission.query.filter_by(
        role=data["role"], functionality=data["functionality"]
    ).first()

    if not permission:
        return error_response("Permissão não encontrada", 404)

    permission.enabled = not permission.enabled
    db.session.commit()

    return jsonify(
        {
            "message": "Permissão atualizada nesta sessão (demonstração)",
            "permission": permission.to_dict(),
        }
    )
