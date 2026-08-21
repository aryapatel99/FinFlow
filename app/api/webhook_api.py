import hashlib
import hmac

from fastapi import APIRouter, Request, HTTPException, status

from app.services.payment_service import PaymentService
from app.services.razorpay_service import RazorpayService
from app.config.settings import settings
from app.utils.logger import logger


router = APIRouter(
    prefix="/webhook",
    tags=["Webhook"],
)


payment_service = PaymentService()
razorpay_service = RazorpayService()


# =====================================
# Razorpay Webhook Signature Verification
# =====================================

def verify_webhook_signature(
    payload: bytes,
    signature: str,
) -> bool:

    expected_signature = hmac.new(
        settings.razorpay_webhook_secret.encode("utf-8"),
        payload,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(
        expected_signature,
        signature,
    )


# =====================================
# Razorpay Webhook
# =====================================

@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
):

    # =====================================
    # Read RAW request body
    # =====================================

    try:

        body = await request.body()

    except Exception:

        logger.error(
            "Failed to read Razorpay webhook body."
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook payload.",
        )


    # =====================================
    # Read Razorpay Signature
    # =====================================

    signature = request.headers.get(
        "X-Razorpay-Signature"
    )


    if not signature:

        logger.warning(
            "Razorpay webhook signature missing."
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Webhook signature missing.",
        )


    # =====================================
    # Verify Signature
    # =====================================

    if not verify_webhook_signature(
        body,
        signature,
    ):

        logger.warning(
            "Invalid Razorpay webhook signature."
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature.",
        )


    # =====================================
    # Parse JSON
    # =====================================

    try:

        payload = await request.json()

    except Exception:

        logger.error(
            "Failed to parse Razorpay webhook JSON."
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook payload.",
        )


    event = payload.get("event")


    logger.info(
        f"Verified Razorpay webhook received: {event}"
    )


    if not event:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook event.",
        )


    try:

        # =====================================
        # Payment Captured
        # =====================================

        if event == "payment.captured":

            payment_entity = (
                payload
                .get("payload", {})
                .get("payment", {})
                .get("entity", {})
            )


            razorpay_order_id = (
                payment_entity.get("order_id")
            )


            razorpay_payment_id = (
                payment_entity.get("id")
            )


            if not razorpay_order_id:

                raise Exception(
                    "Razorpay order ID missing from webhook."
                )


            if not razorpay_payment_id:

                raise Exception(
                    "Razorpay payment ID missing from webhook."
                )


            logger.info(
                f"Processing captured payment. "
                f"Order ID: {razorpay_order_id}, "
                f"Payment ID: {razorpay_payment_id}"
            )


            payment = (
                payment_service.repository
                .get_by_razorpay_order_id(
                    razorpay_order_id
                )
            )


            if payment is None:

                raise Exception(
                    f"Payment not found for Razorpay "
                    f"order ID: {razorpay_order_id}"
                )


            # ---------------------------------
            # Save Razorpay payment ID
            # ---------------------------------

            payment.razorpay_payment_id = (
                razorpay_payment_id
            )


            payment_service.repository.update_razorpay_details(
                payment
            )


            # ---------------------------------
            # PENDING -> PROCESSING
            # ---------------------------------

            if payment.status == "PENDING":

                payment_service.update_payment_status(
                    payment.payment_id,
                    "PROCESSING",
                )


            # ---------------------------------
            # Reload latest payment
            # ---------------------------------

            payment = (
                payment_service.repository.get_by_id(
                    payment.payment_id
                )
            )


            if payment is None:

                raise Exception(
                    f"Payment disappeared after processing: "
                    f"{razorpay_order_id}"
                )


            # ---------------------------------
            # PROCESSING -> COMPLETED
            # ---------------------------------

            if payment.status == "PROCESSING":

                payment_service.update_payment_status(
                    payment.payment_id,
                    "COMPLETED",
                )


            logger.info(
                f"Payment completed successfully: "
                f"{payment.payment_id}"
            )


        # =====================================
        # Payment Failed
        # =====================================

        elif event == "payment.failed":

            payment_entity = (
                payload
                .get("payload", {})
                .get("payment", {})
                .get("entity", {})
            )


            razorpay_order_id = (
                payment_entity.get("order_id")
            )


            if not razorpay_order_id:

                raise Exception(
                    "Razorpay order ID missing from "
                    "failed-payment webhook."
                )


            logger.info(
                f"Processing failed payment. "
                f"Order ID: {razorpay_order_id}"
            )


            payment = (
                payment_service.repository
                .get_by_razorpay_order_id(
                    razorpay_order_id
                )
            )


            if payment is None:

                raise Exception(
                    f"Payment not found for Razorpay "
                    f"order ID: {razorpay_order_id}"
                )


            # ---------------------------------
            # PENDING -> PROCESSING -> FAILED
            # ---------------------------------

            if payment.status == "PENDING":

                payment_service.update_payment_status(
                    payment.payment_id,
                    "PROCESSING",
                )


                payment = (
                    payment_service.repository.get_by_id(
                        payment.payment_id
                    )
                )


            if payment.status == "PROCESSING":

                payment_service.update_payment_status(
                    payment.payment_id,
                    "FAILED",
                )


            logger.info(
                f"Payment marked FAILED: "
                f"{payment.payment_id}"
            )


        # =====================================
        # Other Razorpay Events
        # =====================================

        else:

            logger.info(
                f"Ignoring unsupported Razorpay event: "
                f"{event}"
            )


        return {
            "message": "Webhook processed successfully"
        }


    except HTTPException:

        raise


    except Exception as e:

        logger.exception(
            "Razorpay webhook processing failed."
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )