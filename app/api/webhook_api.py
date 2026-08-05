from fastapi import APIRouter, Request, HTTPException, status

from app.services.payment_service import PaymentService
from app.services.razorpay_service import RazorpayService


router = APIRouter(
    prefix="/webhook",
    tags=["Webhook"],
)

payment_service = PaymentService()
razorpay_service = RazorpayService()


@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
):
    payload = await request.json()

    razorpay_order_id = payload.get(
        "razorpay_order_id"
    )

    razorpay_payment_id = payload.get(
        "razorpay_payment_id"
    )

    razorpay_signature = payload.get(
        "razorpay_signature"
    )

    if not all(
        [
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        ]
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Razorpay payload",
        )

    try:

        # Verify payment authenticity
        razorpay_service.verify_signature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        )

        # Find payment in FinFlow database
        payment = (
            payment_service.repository
            .get_by_razorpay_order_id(
                razorpay_order_id
            )
        )

        if payment is None:
            raise HTTPException(
                status_code=404,
                detail="Payment not found",
            )

        # Save Razorpay transaction details
        payment.razorpay_payment_id = (
            razorpay_payment_id
        )

        payment.razorpay_signature = (
            razorpay_signature
        )

        payment_service.repository.update_razorpay_details(
            payment
        )

        # Move payment lifecycle
        if payment.status == "PENDING":

            payment_service.update_payment_status(
                payment.payment_id,
                "PROCESSING",
            )

        payment_service.update_payment_status(
            payment.payment_id,
            "COMPLETED",
        )


        return {
            "message": "Payment verified successfully"
        }

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )