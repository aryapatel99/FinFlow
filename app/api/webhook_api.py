from fastapi import APIRouter, Request, HTTPException, status

from app.services.payment_service import PaymentService
from app.services.razorpay_service import RazorpayService


router = APIRouter(
    prefix="/webhook",
    tags=["Webhook"],
)


payment_service = PaymentService()

razorpay_service = RazorpayService()


# =====================================
# Razorpay Webhook
# =====================================
# Receives events directly from Razorpay.
#
# Events handled:
# - payment.captured
# - payment.failed
#
# This works independently from frontend.
# =====================================


@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
):

    payload = await request.json()

    event = payload.get(
        "event"
    )

    if not event:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail="Invalid webhook event"

        )

    try:

        # --------------------------------
        # Payment Successful
        # --------------------------------

        if event == "payment.captured":

            payment_entity = (
                payload
                .get("payload", {})
                .get("payment", {})
                .get("entity", {})
            )

            razorpay_order_id = (
                payment_entity.get(
                    "order_id"
                )
            )

            razorpay_payment_id = (
                payment_entity.get(
                    "id"
                )
            )

            if not razorpay_order_id:

                raise Exception(
                    "Order ID missing"
                )

            payment = (
                payment_service.repository
                .get_by_razorpay_order_id(
                    razorpay_order_id
                )
            )

            if payment is None:

                raise Exception(
                    "Payment not found"
                )

            payment.razorpay_payment_id = (
                razorpay_payment_id
            )

            payment_service.repository.update_razorpay_details(
                payment
            )

            # Move PENDING -> PROCESSING

            if payment.status == "PENDING":

                payment_service.update_payment_status(
                    payment.payment_id,
                    "PROCESSING",
                )

                # IMPORTANT:
                # Reload payment so the updated status
                # is reflected in the object.
                payment = (
                    payment_service.repository.get_by_id(
                        payment.payment_id
                    )
                )

                        # Move PROCESSING -> COMPLETED

            if payment.status == "PROCESSING":

                payment_service.update_payment_status(
                    payment.payment_id,
                    "COMPLETED",
                )

        # --------------------------------
        # Payment Failed
        # --------------------------------

        elif event == "payment.failed":

            payment_entity = (
                payload
                .get("payload", {})
                .get("payment", {})
                .get("entity", {})
            )

            razorpay_order_id = (
                payment_entity.get(
                    "order_id"
                )
            )

            payment = (
                payment_service.repository
                .get_by_razorpay_order_id(
                    razorpay_order_id
                )
            )

            if payment:

                payment_service.update_payment_status(

                    payment.payment_id,

                    "FAILED"

                )

        return {

            "message":
            "Webhook processed successfully"

        }

    except Exception as e:

        raise HTTPException(

            status_code=status.HTTP_400_BAD_REQUEST,

            detail=str(e)

        )