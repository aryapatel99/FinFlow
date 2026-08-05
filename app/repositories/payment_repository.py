from datetime import datetime, timezone
from decimal import Decimal

from app.config.dynamodb import get_payments_table
from app.models.payment_model import Payment


class PaymentRepository:
    def __init__(self):
        self.table = get_payments_table()

    # ==========================
    # Save Payment
    # ==========================

    def save(self, payment: Payment):
        self.table.put_item(
            Item={
                "payment_id": payment.payment_id,

                "user_id": payment.user_id,
                "user_email": payment.user_email,

                "customer_name": payment.customer_name,
                "email": payment.email,

                "amount": Decimal(str(payment.amount)),
                "currency": payment.currency,
                "description": payment.description,

                "status": payment.status,

                # Razorpay
                "razorpay_order_id": payment.razorpay_order_id,
                "razorpay_payment_id": payment.razorpay_payment_id,
                "razorpay_signature": payment.razorpay_signature,

                # Timeline
                "created_at": payment.created_at.isoformat(),

                "processing_started_at":
                    payment.processing_started_at.isoformat()
                    if payment.processing_started_at
                    else None,

                "completed_at":
                    payment.completed_at.isoformat()
                    if payment.completed_at
                    else None,

                "failed_at":
                    payment.failed_at.isoformat()
                    if payment.failed_at
                    else None,

                "updated_at": payment.updated_at.isoformat(),
            }
        )

        return payment

    # ==========================
    # Get All Payments
    # ==========================

    def get_all(self):
        response = self.table.scan()

        return [
            Payment.from_dict(item)
            for item in response.get("Items", [])
        ]

    # ==========================
    # Get User Payments
    # ==========================

    def get_by_user_id(
        self,
        user_id: str,
    ):
        response = self.table.scan()

        return [
            Payment.from_dict(item)
            for item in response.get("Items", [])
            if item.get("user_id") == user_id
        ]

    # ==========================
    # Get Payment By ID
    # ==========================

    def get_by_id(
        self,
        payment_id: str,
    ):
        response = self.table.get_item(
            Key={
                "payment_id": payment_id
            }
        )

        item = response.get("Item")

        if item:
            return Payment.from_dict(item)

        return None

    # ==========================
    # Get By Razorpay Order ID
    # ==========================

    def get_by_razorpay_order_id(
        self,
        razorpay_order_id: str,
    ):
        response = self.table.scan()

        for item in response.get("Items", []):

            if item.get("razorpay_order_id") == razorpay_order_id:
                return Payment.from_dict(item)

        return None

    # ==========================
    # Update Razorpay Details
    # ==========================

    def update_razorpay_details(
        self,
        payment: Payment,
    ):
        payment.updated_at = datetime.now(
            timezone.utc
        )

        self.save(payment)

        return payment

    # ==========================
    # Update Status
    # ==========================

    def update_status(
        self,
        payment_id: str,
        status: str,
    ):
        payment = self.get_by_id(
            payment_id
        )

        if payment is None:
            return None

        now = datetime.now(
            timezone.utc
        )

        payment.status = status
        payment.updated_at = now

        if status == "PROCESSING":
            payment.processing_started_at = now

        elif status == "COMPLETED":
            payment.completed_at = now

        elif status == "FAILED":
            payment.failed_at = now

        self.save(payment)

        return payment

    # ==========================
    # Delete Payment
    # ==========================

    def delete(
        self,
        payment_id: str,
    ):
        payment = self.get_by_id(
            payment_id
        )

        if payment:

            self.table.delete_item(
                Key={
                    "payment_id": payment_id
                }
            )

        return payment