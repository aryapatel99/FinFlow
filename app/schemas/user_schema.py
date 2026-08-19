from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# =====================================
# Registration
# =====================================

class UserRegister(BaseModel):

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="User's full name",
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=8,
        description="User password",
    )


# =====================================
# Login
# =====================================

class UserLogin(BaseModel):

    email: EmailStr

    password: str


# =====================================
# User Response
# =====================================

class UserResponse(BaseModel):

    user_id: str

    full_name: str

    email: EmailStr

    role: str

    created_at: datetime


# =====================================
# Token
# =====================================

class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"


# =====================================
# Password Change
# =====================================

class PasswordChangeRequest(BaseModel):

    current_password: str = Field(
        ...,
        min_length=1,
    )

    new_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )


# =====================================
# Admin Password Reset
# =====================================

class AdminPasswordResetRequest(BaseModel):

    new_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )


# =====================================
# Profile Update
# =====================================

class UserProfileUpdate(BaseModel):

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )