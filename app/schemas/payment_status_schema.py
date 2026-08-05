from pydantic import BaseModel, Field


class PaymentStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        pattern="^(PROCESSING|COMPLETED|FAILED)$",
        description="New payment status"
    )