from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.schemas.payment_schema import (
    MessageResponse,
    PaymentCreate,
    PaymentResponse,
)
from app.schemas.razorpay_schema import RazorpayOrderResponse
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)

payment_service = PaymentService()


# ==========================
# Create Payment
# ==========================

@router.post(
    "",
    response_model=PaymentResponse,
)
def create_payment(
    payment_data: PaymentCreate,
    current_user=Depends(get_current_user),
):
    payment_data.user_id = current_user["user_id"]
    payment_data.user_email = current_user["email"]

    return payment_service.create_payment(
        payment_data
    )


# ==========================
# Create Razorpay Checkout
# ==========================

@router.post(
    "/{payment_id}/checkout",
    response_model=RazorpayOrderResponse,
)
def create_checkout(
    payment_id: str,
    current_user=Depends(get_current_user),
):
    return payment_service.create_checkout(
        payment_id,
        current_user["user_id"],
    )


# ==========================
# Get My Payments
# ==========================

@router.get(
    "",
    response_model=list[PaymentResponse],
)
def get_my_payments(
    current_user=Depends(get_current_user),
):
    return payment_service.get_payments_by_user(
        current_user["user_id"]
    )


# ==========================
# Get Payment By ID
# ==========================

@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: str,
    current_user=Depends(get_current_user),
):
    return payment_service.get_payment(
        payment_id,
        current_user["user_id"],
    )


# ==========================
# Delete Payment
# ==========================

@router.delete(
    "/{payment_id}",
    response_model=MessageResponse,
)
def delete_payment(
    payment_id: str,
    current_user=Depends(get_current_user),
):
    payment_service.delete_payment(
        payment_id,
        current_user["user_id"],
    )

    return MessageResponse(
        message="Payment deleted successfully."
    )