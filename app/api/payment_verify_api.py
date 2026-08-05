from fastapi import APIRouter, HTTPException

from app.schemas.razorpay_schema import RazorpayVerifyRequest
from app.schemas.payment_schema import MessageResponse
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/payments",
    tags=["Payment Verification"],
)

payment_service = PaymentService()


@router.post(
    "/verify",
    response_model=MessageResponse,
)
def verify_payment(
    data: RazorpayVerifyRequest,
):
    success = payment_service.verify_payment(
        data
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Payment verification failed."
        )

    return MessageResponse(
        message="Payment verified successfully."
    )