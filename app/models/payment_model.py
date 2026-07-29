from datetime import datetime
from uuid import uuid4


class Payment:
    def __init__(
        self,
        customer_name: str,
        email: str,
        amount: float,
        currency: str,
        description: str,
    ):
        self.payment_id = str(uuid4())
        self.customer_name = customer_name
        self.email = email
        self.amount = amount
        self.currency = currency
        self.description = description
        self.status = "PENDING"
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @classmethod
    def from_dict(cls, data: dict):
        payment = cls(
            customer_name=data["customer_name"],
            email=data["email"],
            amount=float(data["amount"]),
            currency=data["currency"],
            description=data["description"],
        )

        payment.payment_id = data["payment_id"]
        payment.status = data["status"]
        payment.created_at = datetime.fromisoformat(data["created_at"])
        payment.updated_at = datetime.fromisoformat(data["updated_at"])

        return payment