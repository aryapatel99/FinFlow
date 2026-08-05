from pydantic import BaseModel


class RazorpayOrderResponse(BaseModel):
    payment_id: str

    razorpay_order_id: str

    razorpay_key_id: str

    amount: float

    currency: str


class RazorpayVerifyRequest(BaseModel):
    razorpay_order_id: str

    razorpay_payment_id: str

    razorpay_signature: str