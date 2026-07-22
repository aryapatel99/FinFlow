from pydantic import BaseModel, EmailStr


class PaymentCreate(BaseModel):
    customer_name: str
    email: EmailStr
    amount: float
    currency: str
    description: str