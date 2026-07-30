from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class PaymentCreate(BaseModel):
    customer_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Customer's full name"
    )

    email: EmailStr

    amount: float = Field(
        ...,
        gt=0,
        description="Payment amount"
    )

    currency: str = Field(
        ...,
        min_length=3,
        max_length=3,
        pattern="^[A-Z]{3}$",
        description="Currency code (e.g. INR, USD)"
    )

    description: str = Field(
        ...,
        min_length=5,
        max_length=255,
        description="Payment description"
    )


class PaymentResponse(BaseModel):
    payment_id: str
    customer_name: str
    email: EmailStr
    amount: float
    currency: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime


class MessageResponse(BaseModel):
    message: str


class QueueResponse(BaseModel):
    message: str