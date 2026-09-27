from datetime import datetime, timedelta, timezone

import jwt
from flask import current_app, g, request

from app.models.user import User


def generate_token(user):
    payload = {
        "sub": user.id,
        "companyId": user.company_id,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def decode_token(token):
    return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])


def require_auth():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return {"error": "Token de autenticação ausente"}, 401

    token = auth_header.removeprefix("Bearer ").strip()
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        return {"error": "Sessão expirada, faça login novamente"}, 401
    except jwt.InvalidTokenError:
        return {"error": "Token inválido"}, 401

    user = User.query.get(payload["sub"])
    if not user:
        return {"error": "Usuário não encontrado"}, 401

    g.current_user = user
    return None
