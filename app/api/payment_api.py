from fastapi import APIRouter, HTTPException

from app.schemas.payment_schema import PaymentCreate
from app.services.payment_service import PaymentService

router = APIRouter()

payment_service = PaymentService()


@router.post("/payments")
def create_payment(payment: PaymentCreate):
    try:
        return payment_service.create_payment(payment)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/payments")
def get_all_payments():
    return payment_service.get_all_payments()


@router.get("/payments/{payment_id}")
def get_payment(payment_id: str):
    payment = payment_service.get_payment(payment_id)

    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")

    return payment


@router.delete("/payments/{payment_id}")
def delete_payment(payment_id: str):
    payment = payment_service.delete_payment(payment_id)

    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")

    return {"message": "Payment deleted successfully"}