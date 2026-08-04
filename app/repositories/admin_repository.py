from app.repositories.payment_repository import PaymentRepository
from app.repositories.user_repository import UserRepository


class AdminRepository:
    def __init__(self):
        self.user_repository = UserRepository()
        self.payment_repository = PaymentRepository()

    # ==========================
    # Dashboard
    # ==========================

    def get_dashboard_statistics(self):
        users = self.user_repository.get_all()
        payments = self.payment_repository.get_all()

        total_users = len(users)

        total_admins = sum(
            1 for user in users
            if user.role == "admin"
        )

        total_customers = sum(
            1 for user in users
            if user.role == "customer"
        )

        total_payments = len(payments)

        pending_payments = sum(
            1 for payment in payments
            if payment.status == "PENDING"
        )

        completed_payments = sum(
            1 for payment in payments
            if payment.status == "COMPLETED"
        )

        failed_payments = sum(
            1 for payment in payments
            if payment.status == "FAILED"
        )

        total_revenue = sum(
            float(payment.amount)
            for payment in payments
            if payment.status == "COMPLETED"
        )

        return {
            "total_users": total_users,
            "total_admins": total_admins,
            "total_customers": total_customers,
            "total_payments": total_payments,
            "pending_payments": pending_payments,
            "completed_payments": completed_payments,
            "failed_payments": failed_payments,
            "total_revenue": total_revenue,
        }

    # ==========================
    # User Operations
    # ==========================

    def get_all_users(self):
        return self.user_repository.get_all()

    def get_user(self, email: str):
        return self.user_repository.get_by_email(email)

    def update_user_role(
        self,
        email: str,
        role: str
    ):
        return self.user_repository.update_role(
            email,
            role
        )

    def delete_user(
        self,
        email: str
    ):
        return self.user_repository.delete(email)

    # ==========================
    # Payment Operations
    # ==========================

    def get_all_payments(self):
        return self.payment_repository.get_all()

    def get_payment(
        self,
        payment_id: str
    ):
        return self.payment_repository.get_by_id(
            payment_id
        )

    def delete_payment(
        self,
        payment_id: str
    ):
        return self.payment_repository.delete(
            payment_id
        )