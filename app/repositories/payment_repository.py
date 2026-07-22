from app.models.payment_model import Payment


class PaymentRepository:
    def __init__(self):
        self.payments = {}

    def save(self, payment: Payment):
        self.payments[payment.payment_id] = payment
        return payment

    def get_all(self):
        return list(self.payments.values())

    def get_by_id(self, payment_id: str):
        return self.payments.get(payment_id)

    def delete(self, payment_id: str):
        return self.payments.pop(payment_id, None)