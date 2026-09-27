from marshmallow import Schema, fields, validate


class CompanySchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=1))
    cnpj = fields.String(required=True, validate=validate.Length(min=1))
    sector = fields.String(required=True, validate=validate.Length(min=1))
    city = fields.String(required=True, validate=validate.Length(min=1))
    status = fields.String(
        required=True, validate=validate.OneOf(["active", "pending", "inactive"])
    )
    email = fields.Email(required=True)
    phone = fields.String(required=False, allow_none=True)


company_schema = CompanySchema()
