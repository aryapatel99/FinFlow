import razorpay

from app.config.settings import settings


class RazorpayService:

    def __init__(self):

        self.client = razorpay.Client(
            auth=(
                settings.razorpay_key_id,
                settings.razorpay_key_secret,
            )
        )

    # ==========================
    # Create Order
    # ==========================

    def create_order(
        self,
        amount: float,
        currency: str = "INR",
    ):
        return self.client.order.create(
            {
                "amount": int(amount * 100),
                "currency": currency,
            }
        )

    # ==========================
    # Verify Checkout Signature
    # ==========================

    def verify_payment_signature(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ):
        self.client.utility.verify_payment_signature(
            {
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            }
        )

        return True

    # ==========================
    # Get Key ID
    # ==========================

    def get_key_id(self):
        return settings.razorpay_key_id