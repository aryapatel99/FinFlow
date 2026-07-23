from app.exceptions.payment_exception import PaymentNotFoundException
from app.models.payment_model import Payment
from app.repositories.payment_repository import PaymentRepository
from app.schemas.payment_schema import PaymentCreate
from app.utils.logger import logger


class PaymentService:
    def __init__(self):
        self.repository = PaymentRepository()

    def create_payment(self, payment_data: PaymentCreate):
        logger.info(
            f"Creating payment for customer '{payment_data.customer_name}' with amount {payment_data.amount}"
        )

        payment = Payment(
            customer_name=payment_data.customer_name,
            email=payment_data.email,
            amount=payment_data.amount,
            currency=payment_data.currency,
            description=payment_data.description,
        )

        saved_payment = self.repository.save(payment)

        logger.info(
            f"Payment created successfully with ID '{saved_payment.payment_id}'"
        )

        return saved_payment

    def get_all_payments(self):
        logger.info("Fetching all payments")
        return self.repository.get_all()

    def get_payment(self, payment_id: str):
        logger.info(f"Fetching payment with ID '{payment_id}'")

        payment = self.repository.get_by_id(payment_id)

        if payment is None:
            logger.warning(f"Payment with ID '{payment_id}' not found.")
            raise PaymentNotFoundException(payment_id)

        logger.info(f"Payment with ID '{payment_id}' retrieved successfully.")

        return payment

    def delete_payment(self, payment_id: str):
        logger.info(f"Deleting payment with ID '{payment_id}'")

        payment = self.repository.delete(payment_id)

        if payment is None:
            logger.warning(f"Payment with ID '{payment_id}' not found.")
            raise PaymentNotFoundException(payment_id)

        logger.info(f"Payment with ID '{payment_id}' deleted successfully.")

        return payment