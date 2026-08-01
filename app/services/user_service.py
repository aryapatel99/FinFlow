from app.auth.password import hash_password, verify_password
from app.models.user_model import User
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserRegister


class UserService:
    def __init__(self):
        self.repository = UserRepository()

    def register_user(self, user_data: UserRegister):
        existing_user = self.repository.get_by_email(user_data.email)

        if existing_user:
            raise ValueError("Email already registered.")

        hashed_password = hash_password(user_data.password)

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed_password,
        )

        self.repository.save(user)

        return user

    def authenticate_user(self, email: str, password: str):
        user = self.repository.get_by_email(email)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        return user