from fastapi import APIRouter, HTTPException

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
def create_payment(payment: PaymentCreate):
    try:
        # Send payment request to Amazon SQS
        send_message(payment.model_dump())

        return QueueResponse(
            message="Payment request queued successfully."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to queue payment: {str(e)}"
        )


@router.get("/payments", response_model=list[PaymentResponse])
def get_all_payments():
    try:
        return payment_service.get_all_payments()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: str):
    try:
        return payment_service.get_payment(payment_id)

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete("/payments/{payment_id}", response_model=MessageResponse)
def delete_payment(payment_id: str):
    try:
        payment_service.delete_payment(payment_id)

        return MessageResponse(
            message="Payment deleted successfully"
        )

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )