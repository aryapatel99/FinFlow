from decimal import Decimal

from app.config.dynamodb import get_payments_table
from app.models.payment_model import Payment


class PaymentRepository:
    def __init__(self):
        self.table = get_payments_table()

    def save(self, payment: Payment):
        item = {
            "payment_id": payment.payment_id,
            "customer_name": payment.customer_name,
            "email": payment.email,
            "amount": Decimal(str(payment.amount)),
            "currency": payment.currency,
            "description": payment.description,
            "status": payment.status,
            "created_at": payment.created_at.isoformat(),
            "updated_at": payment.updated_at.isoformat(),
        }

        self.table.put_item(Item=item)

        return payment

    def get_all(self):
        response = self.table.scan()

        return [
            Payment.from_dict(item)
            for item in response.get("Items", [])
        ]

    def get_by_id(self, payment_id: str):
        response = self.table.get_item(
            Key={
                "payment_id": payment_id
            }
        )

        item = response.get("Item")

        if item:
            return Payment.from_dict(item)

        return None

    def delete(self, payment_id: str):
        payment = self.get_by_id(payment_id)

        if payment:
            self.table.delete_item(
                Key={
                    "payment_id": payment_id
                }
            )

        return payment