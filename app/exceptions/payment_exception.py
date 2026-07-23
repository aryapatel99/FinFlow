class PaymentNotFoundException(Exception):
    def __init__(self, payment_id: str):
        self.payment_id = payment_id
        self.message = f"Payment with ID '{payment_id}' not found."
        super().__init__(self.message)