from app.config.dynamodb import get_dynamodb

from app.models.payment_model import Payment
from app.models.user_model import User


class AdminRepository:

    def __init__(self):

        dynamodb = get_dynamodb()

        self.users_table = dynamodb.Table(
            "FinFlowUsers"
        )

        self.payments_table = dynamodb.Table(
            "FinFlowPayments"
        )

    # ==========================
    # Dashboard
    # ==========================

    def get_dashboard_statistics(self):

        users_response = self.users_table.scan()

        payments_response = self.payments_table.scan()

        users = users_response.get(
            "Items",
            [],
        )

        payments = payments_response.get(
            "Items",
            [],
        )

        total_users = len(users)

        total_payments = len(payments)

        completed_payments = sum(
            1
            for payment in payments
            if payment.get("status") == "COMPLETED"
        )

        pending_payments = sum(
            1
            for payment in payments
            if payment.get("status") in [
                "PENDING",
                "PROCESSING",
            ]
        )

        failed_payments = sum(
            1
            for payment in payments
            if payment.get("status") == "FAILED"
        )

        total_amount = sum(
            float(
                payment.get(
                    "amount",
                    0,
                )
            )
            for payment in payments
            if payment.get("status") == "COMPLETED"
        )

        return {
            "total_users": total_users,
            "total_payments": total_payments,
            "completed_payments": completed_payments,
            "pending_payments": pending_payments,
            "failed_payments": failed_payments,
            "total_amount": total_amount,
        }

    # ==========================
    # Users
    # ==========================

    def get_all_users(self):

        response = self.users_table.scan()

        return [
            User.from_dict(item)
            for item in response.get(
                "Items",
                [],
            )
        ]

    def get_user(
        self,
        email: str,
    ):

        response = self.users_table.get_item(
            Key={
                "email": email
            }
        )

        item = response.get("Item")

        if item:

            return User.from_dict(
                item
            )

        return None

    def update_user_role(
        self,
        email: str,
        role: str,
    ):

        self.users_table.update_item(
            Key={
                "email": email
            },
            UpdateExpression="SET #r = :role",
            ExpressionAttributeNames={
                "#r": "role"
            },
            ExpressionAttributeValues={
                ":role": role
            },
        )

        return self.get_user(
            email
        )

    def update_user_password(
        self,
        email: str,
        hashed_password: str,
    ):

        self.users_table.update_item(
            Key={
                "email": email
            },
            UpdateExpression=(
                "SET hashed_password = :password"
            ),
            ExpressionAttributeValues={
                ":password": hashed_password
            },
        )

        return self.get_user(
            email
        )

    def delete_user(
        self,
        email: str,
    ):

        user = self.get_user(
            email
        )

        if user:

            self.users_table.delete_item(
                Key={
                    "email": email
                }
            )

        return user

    # ==========================
    # Payments
    # ==========================

    def get_all_payments(self):

        response = self.payments_table.scan()

        return [
            Payment.from_dict(item)
            for item in response.get(
                "Items",
                [],
            )
        ]

    def get_payment(
        self,
        payment_id: str,
    ):

        response = self.payments_table.get_item(
            Key={
                "payment_id": payment_id
            }
        )

        item = response.get("Item")

        if item:

            return Payment.from_dict(
                item
            )

        return None

    def delete_payment(
        self,
        payment_id: str,
    ):

        payment = self.get_payment(
            payment_id
        )

        if payment:

            self.payments_table.delete_item(
                Key={
                    "payment_id": payment_id
                }
            )

        return payment