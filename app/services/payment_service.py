from fastapi import HTTPException, status

from app.exceptions.payment_exception import PaymentNotFoundException
from app.models.payment_model import Payment
from app.repositories.payment_repository import PaymentRepository
from app.schemas.payment_schema import PaymentCreate
from app.schemas.razorpay_schema import RazorpayOrderResponse
from app.services.razorpay_service import RazorpayService
from app.utils.logger import logger


class PaymentService:

    def __init__(self):
        self.repository = PaymentRepository()
        self.razorpay_service = RazorpayService()

    # ==========================
    # Create Payment
    # ==========================

    def create_payment(
        self,
        payment_data: PaymentCreate,
    ):

        logger.info(
            f"Creating payment for '{payment_data.customer_name}'"
        )

        payment = Payment(
            customer_name=payment_data.customer_name,
            email=payment_data.email,
            amount=payment_data.amount,
            currency=payment_data.currency,
            description=payment_data.description,
            user_id=payment_data.user_id,
            user_email=payment_data.user_email,
        )

        payment = self.repository.save(payment)

        logger.info(
            f"Payment created successfully '{payment.payment_id}'"
        )

        return payment

    # ==========================
    # Razorpay Checkout
    # ==========================

    def create_checkout(
        self,
        payment_id: str,
        current_user: dict,
    ):

        payment = self.repository.get_by_id(
            payment_id
        )

        if payment is None:
            raise PaymentNotFoundException(
                payment_id
            )

        # Customer can access only their own payment.
        # Admin can access any payment.

        if (
            current_user["role"] != "admin"
            and payment.user_id != current_user["user_id"]
        ):

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this payment."
            )

        if payment.razorpay_order_id:

            return RazorpayOrderResponse(

                payment_id=payment.payment_id,

                razorpay_order_id=payment.razorpay_order_id,

                razorpay_key_id=self.razorpay_service.get_key_id(),

                amount=payment.amount,

                currency=payment.currency,
            )

        order = self.razorpay_service.create_order(

            amount=payment.amount,

            currency=payment.currency,

        )

        payment.razorpay_order_id = order["id"]

        self.repository.update_razorpay_details(
            payment
        )

        return RazorpayOrderResponse(

            payment_id=payment.payment_id,

            razorpay_order_id=payment.razorpay_order_id,

            razorpay_key_id=self.razorpay_service.get_key_id(),

            amount=payment.amount,

            currency=payment.currency,
        )

    # ==========================
    # Verify Razorpay Payment
    # ==========================

    def verify_payment(
        self,
        data,
    ):

        logger.info(
            "Verifying Razorpay payment"
        )

        # Verify signature from Razorpay

        self.razorpay_service.verify_payment_signature(

            data.razorpay_order_id,

            data.razorpay_payment_id,

            data.razorpay_signature,

        )

        # Find payment using Razorpay order id

        payment = self.repository.get_by_razorpay_order_id(

            data.razorpay_order_id

        )

        if payment is None:

            raise PaymentNotFoundException(

                data.razorpay_order_id

            )

        # Avoid duplicate processing

        if payment.status == "COMPLETED":

            return True

        payment.razorpay_payment_id = (

            data.razorpay_payment_id

        )

        payment.razorpay_signature = (

            data.razorpay_signature

        )

        self.repository.update_razorpay_details(

            payment

        )

        # Status update

        if payment.status == "PENDING":

            self.update_payment_status(

                payment.payment_id,

                "PROCESSING",

            )

        self.update_payment_status(

            payment.payment_id,

            "COMPLETED",

        )

        logger.info(

            f"Payment completed successfully '{payment.payment_id}'"

        )

        return True

    # ==========================
    # Read Payments
    # ==========================

    def get_all_payments(self):

        return self.repository.get_all()



    def get_payments_by_user(
        self,
        user_id: str,
    ):

        logger.info(

            f"Fetching payments for user '{user_id}'"

        )

        return self.repository.get_by_user_id(

            user_id

        )



    def get_payment(
        self,
        payment_id: str,
        current_user: dict,
    ):

        payment = self.repository.get_by_id(

            payment_id

        )

        if payment is None:

            raise PaymentNotFoundException(

                payment_id

            )

        # Customer can access only their own payment.
        # Admin can access any payment.

        if (
            current_user["role"] != "admin"
            and payment.user_id != current_user["user_id"]
        ):

            raise HTTPException(

                status_code=status.HTTP_403_FORBIDDEN,

                detail="You are not authorized to access this payment."

            )

        return payment



    # ==========================
    # Update Status
    # ==========================

    def update_payment_status(
        self,
        payment_id: str,
        status: str,
    ):

        payment = self.repository.get_by_id(

            payment_id

        )

        if payment is None:

            raise PaymentNotFoundException(

                payment_id

            )

        valid_transitions = {

            "PENDING": [

                "PROCESSING"

            ],

            "PROCESSING": [

                "COMPLETED",

                "FAILED",

            ],

            "COMPLETED": [],

            "FAILED": [],

        }

        if status not in valid_transitions[

            payment.status

        ]:

            raise ValueError(

                f"Invalid transition "

                f"{payment.status} -> {status}"

            )

        return self.repository.update_status(

            payment_id,

            status,

        )



    # ==========================
    # Delete
    # ==========================

    def delete_payment(
        self,
        payment_id: str,
        current_user: dict,
    ):

        payment = self.repository.get_by_id(

            payment_id

        )

        if payment is None:

            raise PaymentNotFoundException(

                payment_id

            )

        # Customer can delete only their own payment.
        # Admin can delete any payment.

        if (
            current_user["role"] != "admin"
            and payment.user_id != current_user["user_id"]
        ):

            raise HTTPException(

                status_code=status.HTTP_403_FORBIDDEN,

                detail="You are not authorized to delete this payment."

            )

        return self.repository.delete(

            payment_id

        )