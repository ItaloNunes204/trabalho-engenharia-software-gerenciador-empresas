from marshmallow import Schema, fields


class PermissionToggleSchema(Schema):
    role = fields.String(required=True)
    functionality = fields.String(required=True)


permission_toggle_schema = PermissionToggleSchema()
