from fastapi import HTTPException, status

from app.auth.password import (
    hash_password,
    verify_password,
)

from app.models.user_model import User
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserRegister

from app.utils.logger import logger


class UserService:

    def __init__(self):
        self.repository = UserRepository()

    # ==========================
    # Register
    # ==========================

    def register_user(
        self,
        user_data: UserRegister,
    ):

        existing_user = self.repository.get_by_email(
            user_data.email
        )

        if existing_user:

            raise ValueError(
                "Email already registered."
            )

        hashed_password = hash_password(
            user_data.password
        )

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed_password,
        )

        self.repository.save(user)

        return user

    # ==========================
    # Authenticate
    # ==========================

    def authenticate_user(
        self,
        email: str,
        password: str,
    ):

        user = self.repository.get_by_email(
            email
        )

        if not user:
            return None

        if not verify_password(
            password,
            user.hashed_password,
        ):
            return None

        return user

    # ==========================
    # Get Current User
    # ==========================

    def get_current_user(
        self,
        user_id: str,
    ):

        user = self.repository.get_by_id(
            user_id
        )

        if user is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return user

    # ==========================
    # Change Own Password
    # ==========================

    def change_password(
        self,
        user_id: str,
        current_password: str,
        new_password: str,
    ):

        user = self.repository.get_by_id(
            user_id
        )

        if user is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        if current_password == new_password:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "New password must be different "
                    "from current password."
                ),
            )

        if not verify_password(
            current_password,
            user.hashed_password,
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect.",
            )

        new_hashed_password = hash_password(
            new_password
        )

        updated_user = self.repository.update_password(
            user.email,
            new_hashed_password,
        )

        logger.info(
            f"Password changed for user '{user.email}'"
        )

        return updated_user