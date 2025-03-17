from marshmallow import Schema, fields, validate

class PaymentSchema(Schema):
    id = fields.Str()
    user_id = fields.Str(required=True)
    amount = fields.Float(required=True, validate=validate.Range(min=0.1))
    currency = fields.Str(validate=validate.Length(equal=3))
    status = fields.Str(validate=validate.OneOf(["pending", "paid"]))
    items = fields.List(fields.Str(), validate=validate.Length(min=1))