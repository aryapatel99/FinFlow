from app.models.payment_model import Payment
from app.repositories.payment_repository import PaymentRepository
from app.schemas.payment_schema import PaymentCreate


class PaymentService:
    def __init__(self):
        self.repository = PaymentRepository()

    def create_payment(self, payment_data: PaymentCreate):
        if payment_data.amount <= 0:
            raise ValueError("Payment amount must be greater than zero.")

        payment = Payment(
            customer_name=payment_data.customer_name,
            email=payment_data.email,
            amount=payment_data.amount,
            currency=payment_data.currency,
            description=payment_data.description,
        )

        return self.repository.save(payment)

    def get_all_payments(self):
        return self.repository.get_all()

    def get_payment(self, payment_id: str):
        return self.repository.get_by_id(payment_id)

    def delete_payment(self, payment_id: str):
        return self.repository.delete(payment_id)