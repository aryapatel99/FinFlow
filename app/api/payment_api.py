from fastapi import APIRouter, HTTPException

from app.schemas.payment_schema import (
    PaymentCreate,
    PaymentResponse,
    MessageResponse,
)
from app.services.payment_service import PaymentService

router = APIRouter()

payment_service = PaymentService()


@router.post("/payments", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate):
    try:
        return payment_service.create_payment(payment)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/payments", response_model=list[PaymentResponse])
def get_all_payments():
    return payment_service.get_all_payments()


@router.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: str):
    return payment_service.get_payment(payment_id)

@router.delete("/payments/{payment_id}", response_model=MessageResponse)
def delete_payment(payment_id: str):
    payment_service.delete_payment(payment_id)

    return {"message": "Payment deleted successfully"}