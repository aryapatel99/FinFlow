from app.repositories.payment_repository import PaymentRepository
from app.repositories.user_repository import UserRepository


class AdminRepository:
    def __init__(self):
        self.user_repository = UserRepository()
        self.payment_repository = PaymentRepository()

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