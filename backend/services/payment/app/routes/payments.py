from flask import Blueprint, request, jsonify
from app.models.payment import Payment
from app.schemas.payment_schema import PaymentSchema

payments_bp = Blueprint('payments', __name__)
payment_schema = PaymentSchema()

@payments_bp.route('/payments', methods=['POST'])
def create_payment():
    data = request.get_json()
    
    # Validación requerida para items
    if 'items' not in data or not isinstance(data['items'], list):
        return jsonify({"error": "Items must be an array"}), 400
    
    errors = payment_schema.validate(data)
    if errors:
        return jsonify({"error": errors}), 400
    
    try:
        payment = Payment.create(data)
        result = payment_schema.dump(payment)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.route('/payments/<payment_id>/status', methods=['PUT'])
def update_payment_status(payment_id):
    data = request.get_json()
    if "status" not in data:
        return jsonify({"error": "Status is required"}), 400
    
    try:
        result = Payment.update(payment_id, {"status": data["status"]})
        if result.modified_count == 0:
            return jsonify({"error": "Payment not found"}), 404
        return jsonify({"message": "Status updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.route('/payments/user/<user_id>', methods=['GET'])
def get_user_payments(user_id):
    try:
        payments = Payment.get_by_user(user_id)
        # Convert ObjectId to string for JSON serialization
        for payment in payments:
            payment["_id"] = str(payment["_id"])
        return jsonify(payments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.route('/payments/<payment_id>', methods=['GET'])
def get_payment(payment_id):
    try:
        payment = Payment.get_by_id(payment_id)
        if not payment:
            return jsonify({"error": "Payment not found"}), 404
        payment["_id"] = str(payment["_id"])
        return jsonify(payment), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.route('/payments/<payment_id>', methods=['DELETE'])
def delete_payment(payment_id):
    try:
        result = Payment.delete(payment_id)
        if result.deleted_count == 0:
            return jsonify({"error": "Payment not found"}), 404
        return jsonify({"message": "Payment deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@payments_bp.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200