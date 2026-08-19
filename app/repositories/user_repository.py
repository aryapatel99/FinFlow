from app.config.dynamodb import get_dynamodb
from app.models.user_model import User


class UserRepository:

    def __init__(self):
        dynamodb = get_dynamodb()
        self.table = dynamodb.Table("FinFlowUsers")

    # ==========================
    # Save User
    # ==========================

    def save(
        self,
        user: User,
    ):
        self.table.put_item(
            Item=user.to_dict()
        )

        return user

    # ==========================
    # Get By Email
    # ==========================

    def get_by_email(
        self,
        email: str,
    ):
        response = self.table.get_item(
            Key={
                "email": email
            }
        )

        item = response.get("Item")

        if item:
            return User.from_dict(item)

        return None

    # ==========================
    # Get By ID
    # ==========================

    def get_by_id(
        self,
        user_id: str,
    ):
        response = self.table.scan()

        for item in response.get("Items", []):

            if item.get("user_id") == user_id:
                return User.from_dict(item)

        return None

    # ==========================
    # Get All
    # ==========================

    def get_all(self):

        response = self.table.scan()

        return [
            User.from_dict(item)
            for item in response.get("Items", [])
        ]

    # ==========================
    # Update Role
    # ==========================

    def update_role(
        self,
        email: str,
        role: str,
    ):

        self.table.update_item(
            Key={
                "email": email
            },
            UpdateExpression="SET #r = :role",
            ExpressionAttributeNames={
                "#r": "role"
            },
            ExpressionAttributeValues={
                ":role": role
            },
        )

        return self.get_by_email(email)

    # ==========================
    # Update Password
    # ==========================

    def update_password(
        self,
        email: str,
        hashed_password: str,
    ):

        self.table.update_item(
            Key={
                "email": email
            },
            UpdateExpression="SET hashed_password = :password",
            ExpressionAttributeValues={
                ":password": hashed_password
            },
        )

        return self.get_by_email(email)

    # ==========================
    # Delete
    # ==========================

    def delete(
        self,
        email: str,
    ):

        user = self.get_by_email(email)

        if user:

            self.table.delete_item(
                Key={
                    "email": email
                }
            )

        return user