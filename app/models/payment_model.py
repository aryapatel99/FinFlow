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
        user_id: str = "",
        user_email: str = "",
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

        # Razorpay Details
        self.razorpay_order_id = None
        self.razorpay_payment_id = None
        self.razorpay_signature = None

        self.created_at = datetime.now(timezone.utc)

        self.processing_started_at = None
        self.completed_at = None
        self.failed_at = None

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

            "razorpay_order_id": self.razorpay_order_id,
            "razorpay_payment_id": self.razorpay_payment_id,
            "razorpay_signature": self.razorpay_signature,

            "created_at": self.created_at.isoformat(),

            "processing_started_at":
                self.processing_started_at.isoformat()
                if self.processing_started_at
                else None,

            "completed_at":
                self.completed_at.isoformat()
                if self.completed_at
                else None,

            "failed_at":
                self.failed_at.isoformat()
                if self.failed_at
                else None,

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
            user_id=data.get("user_id", ""),
            user_email=data.get("user_email", ""),
        )

        payment.payment_id = data["payment_id"]

        payment.status = data["status"]

        payment.razorpay_order_id = data.get(
            "razorpay_order_id"
        )

        payment.razorpay_payment_id = data.get(
            "razorpay_payment_id"
        )

        payment.razorpay_signature = data.get(
            "razorpay_signature"
        )

        payment.created_at = datetime.fromisoformat(
            data["created_at"]
        )

        payment.updated_at = datetime.fromisoformat(
            data["updated_at"]
        )

        if data.get("processing_started_at"):
            payment.processing_started_at = (
                datetime.fromisoformat(
                    data["processing_started_at"]
                )
            )

        if data.get("completed_at"):
            payment.completed_at = (
                datetime.fromisoformat(
                    data["completed_at"]
                )
            )

        if data.get("failed_at"):
            payment.failed_at = (
                datetime.fromisoformat(
                    data["failed_at"]
                )
            )

        return payment