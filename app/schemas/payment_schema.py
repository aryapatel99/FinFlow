from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ==========================
# Create Payment Request
# ==========================

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

    # Added by backend from JWT token
    # User does not send these manually

    user_id: str | None = None

    user_email: str | None = None



# ==========================
# Payment Response
# ==========================

class PaymentResponse(BaseModel):

    payment_id: str

    customer_name: str

    email: EmailStr

    amount: float

    currency: str

    description: str

    status: str

    razorpay_order_id: str | None = None

    razorpay_payment_id: str | None = None

    created_at: datetime

    updated_at: datetime



# ==========================
# Message Response
# ==========================

class MessageResponse(BaseModel):

    message: str



# ==========================
# Queue Response
# ==========================

class QueueResponse(BaseModel):

    message: str