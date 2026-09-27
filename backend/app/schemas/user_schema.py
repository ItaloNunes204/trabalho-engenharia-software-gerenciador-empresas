from marshmallow import Schema, fields, validate

ROLES = ["Administrador", "Editor", "Visualizador"]
STATUSES = ["active", "pending", "inactive"]


class UserSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True)
    companyId = fields.Integer(required=True, data_key="companyId")
    role = fields.String(required=True, validate=validate.OneOf(ROLES))
    status = fields.String(required=True, validate=validate.OneOf(STATUSES))


user_schema = UserSchema()
