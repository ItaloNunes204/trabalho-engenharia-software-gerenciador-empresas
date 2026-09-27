from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    companyName = fields.String(required=True, validate=validate.Length(min=1))
    cnpj = fields.String(required=True, validate=validate.Length(min=1))
    sector = fields.String(required=True, validate=validate.Length(min=1))
    city = fields.String(required=True, validate=validate.Length(min=1))
    companyEmail = fields.Email(required=True)
    phone = fields.String(required=False, allow_none=True)
    adminName = fields.String(required=True, validate=validate.Length(min=1))
    adminEmail = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=1))


register_schema = RegisterSchema()
login_schema = LoginSchema()
