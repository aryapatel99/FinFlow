from fastapi import HTTPException, status

from app.repositories.admin_repository import AdminRepository
from app.services.payment_service import PaymentService
from app.utils.logger import logger


class AdminService:
    def __init__(self):
        self.repository = AdminRepository()
        self.payment_service = PaymentService()

    # ==========================
    # Dashboard
    # ==========================

    def get_dashboard_statistics(self):
        logger.info("Admin requested dashboard statistics")
        return self.repository.get_dashboard_statistics()

    # ==========================
    # User Management
    # ==========================

    def get_all_users(self):
        logger.info("Admin requested all users")
        return self.repository.get_all_users()

    def get_user(self, email: str):
        logger.info(f"Admin requested user '{email}'")

        user = self.repository.get_user(email)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        return user

    def update_user_role(
        self,
        email: str,
        role: str
    ):
        logger.info(
            f"Admin updating role of '{email}' to '{role}'"
        )

        if role not in ["admin", "customer"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role must be either 'admin' or 'customer'."
            )

        user = self.repository.get_user(email)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        return self.repository.update_user_role(
            email,
            role
        )

    def delete_user(self, email: str):
        logger.info(
            f"Admin deleting user '{email}'"
        )

        user = self.repository.delete_user(email)

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        return user

    # ==========================
    # Payment Management
    # ==========================

    def get_all_payments(self):
        logger.info("Admin requested all payments")
        return self.repository.get_all_payments()

    def get_payment(self, payment_id: str):
        logger.info(
            f"Admin requested payment '{payment_id}'"
        )

        payment = self.repository.get_payment(
            payment_id
        )

        if payment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found."
            )

        return payment

    def update_payment_status(
        self,
        payment_id: str,
        status: str,
    ):
        logger.info(
            f"Admin updating payment '{payment_id}' to '{status}'"
        )

        return self.payment_service.update_payment_status(
            payment_id,
            status,
        )

    def delete_payment(self, payment_id: str):
        logger.info(
            f"Admin deleting payment '{payment_id}'"
        )

        payment = self.repository.delete_payment(
            payment_id
        )

        if payment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found."
            )

        return payment