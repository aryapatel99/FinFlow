from pydantic import BaseModel, Field


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(
        ...,
        min_length=1,
        description="Current password",
    )

    new_password: str = Field(
        ...,
        min_length=8,
        description="New password",
    )


class AdminPasswordResetRequest(BaseModel):
    new_password: str = Field(
        ...,
        min_length=8,
        description="New password",
    )