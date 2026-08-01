from datetime import datetime, timezone
from uuid import uuid4


class Payment:
    def __init__(
        self,
        customer_name: str,
        email: str,
        amount: float,
        currency: str,
        description: str,
        user_id: str,
        user_email: str,
    ):
        self.payment_id = str(uuid4())

        self.user_id = user_id
        self.user_email = user_email

        self.customer_name = customer_name
        self.email = email
        self.amount = amount
        self.currency = currency
        self.description = description

        self.status = "PENDING"

        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "payment_id": self.payment_id,
            "user_id": self.user_id,
            "user_email": self.user_email,
            "customer_name": self.customer_name,
            "email": self.email,
            "amount": self.amount,
            "currency": self.currency,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict):
        payment = cls(
            customer_name=data["customer_name"],
            email=data["email"],
            amount=float(data["amount"]),
            currency=data["currency"],
            description=data["description"],
            user_id=data["user_id"],
            user_email=data["user_email"],
        )

        payment.payment_id = data["payment_id"]
        payment.status = data["status"]
        payment.created_at = datetime.fromisoformat(data["created_at"])
        payment.updated_at = datetime.fromisoformat(data["updated_at"])

        return payment