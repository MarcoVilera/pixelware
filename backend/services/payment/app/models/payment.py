from datetime import datetime
from pymongo import MongoClient
from app.config import Config

client = MongoClient(Config.MONGO_URI)
db = client.get_database()
payments_collection = db.payments

class Payment:
    @staticmethod
    def create(data):
        # Generar ID personalizado
        custom_id = Payment.generate_payment_id(
            data['user_id'], 
            data['amount']
        )
        
        payment_data = {
            "id": custom_id,
            "user_id": data['user_id'],
            "amount": float(data['amount']),
            "items": data.get('items', []),
            "currency": data.get('currency', 'USD'),
            "status": "pending",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        result = payments_collection.insert_one(payment_data)
        return str(result.inserted_id)

    @staticmethod
    def update(payment_id, data):
        data["updated_at"] = datetime.now()
        return payments_collection.update_one(
            {"id": payment_id},
            {"$set": data}
        )

    @staticmethod
    def get_by_user(user_id):
        return list(payments_collection.find({"user_id": user_id}))

    @staticmethod
    def get_by_id(payment_id):
        return payments_collection.find_one({"id": payment_id})

    @staticmethod
    def delete(payment_id):
        return payments_collection.delete_one({"id": payment_id})
    @staticmethod
    def generate_payment_id(user_id, amount):
        """Genera ID en formato DDMMYYYY-user_id-primer_digito_monto"""
        now = datetime.now()
        date_part = now.strftime("%d%m%Y")
        
        # Obtener primer dígito del monto
        amount_str = f"{float(amount):.2f}"
        first_digit = amount_str[0] if amount_str[0] != '0' else amount_str[1]
        
        return f"{date_part}-{user_id}-{first_digit}"