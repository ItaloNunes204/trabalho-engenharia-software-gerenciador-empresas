from flask import jsonify


def error_response(message, status_code=400):
    return jsonify({"error": message}), status_code


def validation_error_response(errors):
    return jsonify({"error": "Dados inválidos", "details": errors}), 422


def paginate(query, page, per_page=5):
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return items, total
