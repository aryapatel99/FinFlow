from app.exceptions.payment_exception import PaymentNotFoundException
from app.models.payment_model import Payment
from app.repositories.payment_repository import PaymentRepository
from app.utils.logger import logger


class PaymentService:
    def __init__(self):
        self.repository = PaymentRepository()

    def create_payment(self, payment: Payment):
        logger.info(
            f"Creating payment for customer '{payment.customer_name}' with amount {payment.amount}"
        )

        return self.repository.save(payment)

    def get_all_payments(self):
        logger.info("Fetching all payments")
        return self.repository.get_all()

    def get_user_payments(self, user_id: str):
        logger.info(f"Fetching payments for user '{user_id}'")
        return self.repository.get_by_user_id(user_id)

    def get_payment(self, payment_id: str):
        payment = self.repository.get_by_id(payment_id)

        if payment is None:
            raise PaymentNotFoundException(payment_id)

        return payment

    def delete_payment(self, payment_id: str):
        payment = self.repository.get_by_id(payment_id)

        if payment is None:
            raise PaymentNotFoundException(payment_id)

        self.repository.delete(payment_id)

        return payment