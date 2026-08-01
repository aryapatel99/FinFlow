from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import get_current_user
from app.config.sqs import send_message
from app.schemas.payment_schema import (
    PaymentCreate,
    PaymentResponse,
    MessageResponse,
    QueueResponse,
)
from app.services.payment_service import PaymentService

router = APIRouter()

payment_service = PaymentService()


@router.post("/payments", response_model=QueueResponse)
def create_payment(
    payment: PaymentCreate,
    current_user=Depends(get_current_user),
):
    try:

        payment_data = payment.model_dump()

        payment_data["user_id"] = current_user["user_id"]
        payment_data["user_email"] = current_user["email"]

        send_message(payment_data)

        return QueueResponse(
            message="Payment request queued successfully."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/payments", response_model=list[PaymentResponse])
def get_all_payments(
    current_user=Depends(get_current_user),
):
    try:

        if current_user["role"] == "admin":
            return payment_service.get_all_payments()

        return payment_service.get_user_payments(
            current_user["user_id"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: str,
    current_user=Depends(get_current_user),
):
    try:

        payment = payment_service.get_payment(payment_id)

        if (
            current_user["role"] != "admin"
            and payment.user_id != current_user["user_id"]
        ):
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return payment

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete("/payments/{payment_id}", response_model=MessageResponse)
def delete_payment(
    payment_id: str,
    current_user=Depends(get_current_user),
):
    try:

        payment = payment_service.get_payment(payment_id)

        if (
            current_user["role"] != "admin"
            and payment.user_id != current_user["user_id"]
        ):
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        payment_service.delete_payment(payment_id)

        return MessageResponse(
            message="Payment deleted successfully"
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )