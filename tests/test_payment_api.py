from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


# =====================================
# Test Authentication Helper
# =====================================

def get_auth_headers():
    """
    Register a fresh test user and obtain a JWT token.
    """

    unique_email = (
        f"test_{uuid4().hex}@example.com"
    )

    register_payload = {
        "full_name": "FinFlow Test User",
        "email": unique_email,
        "password": "TestPassword123!",
    }

    register_response = client.post(
        "/auth/register",
        json=register_payload,
    )

    assert register_response.status_code == 201

    login_response = client.post(
        "/auth/login",
        data={
            "username": unique_email,
            "password": "TestPassword123!",
        },
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }


# =====================================
# Home
# =====================================

def test_home():

    response = client.get("/")

    assert response.status_code == 200

    assert response.json() == {
        "message": "Welcome to FinFlow API"
    }


# =====================================
# Create Payment
# =====================================

def test_create_payment():

    headers = get_auth_headers()

    payload = {
        "customer_name": "Arya Patel",
        "email": "arya@gmail.com",
        "amount": 1500,
        "currency": "INR",
        "description": "AWS Developer Course",
    }

    response = client.post(
        "/payments",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["customer_name"] == payload["customer_name"]
    assert data["email"] == payload["email"]
    assert data["amount"] == payload["amount"]
    assert data["currency"] == payload["currency"]
    assert data["description"] == payload["description"]
    assert data["status"] == "PENDING"

    assert "payment_id" in data
    assert "created_at" in data
    assert "updated_at" in data


# =====================================
# Get All Payments
# =====================================

def test_get_all_payments():

    headers = get_auth_headers()

    response = client.get(
        "/payments",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


# =====================================
# Get Payment By ID
# =====================================

def test_get_payment_by_id():

    headers = get_auth_headers()

    payload = {
        "customer_name": "Test User",
        "email": "test@gmail.com",
        "amount": 999,
        "currency": "INR",
        "description": "Testing Payment",
    }

    create_response = client.post(
        "/payments",
        json=payload,
        headers=headers,
    )

    assert create_response.status_code == 200

    payment_id = (
        create_response.json()["payment_id"]
    )

    response = client.get(
        f"/payments/{payment_id}",
        headers=headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["payment_id"] == payment_id
    assert data["customer_name"] == payload["customer_name"]
    assert data["email"] == payload["email"]
    assert data["amount"] == payload["amount"]


# =====================================
# Delete Payment
# =====================================

def test_delete_payment():

    headers = get_auth_headers()

    payload = {
        "customer_name": "Delete User",
        "email": "delete@gmail.com",
        "amount": 500,
        "currency": "INR",
        "description": "Delete Test",
    }

    create_response = client.post(
        "/payments",
        json=payload,
        headers=headers,
    )

    assert create_response.status_code == 200

    payment_id = (
        create_response.json()["payment_id"]
    )

    response = client.delete(
        f"/payments/{payment_id}",
        headers=headers,
    )

    assert response.status_code == 200

    assert response.json() == {
    "message": "Payment deleted successfully."
}


# =====================================
# Invalid Payment Amount
# =====================================

def test_invalid_payment_amount():

    headers = get_auth_headers()

    payload = {
        "customer_name": "Arya Patel",
        "email": "arya@gmail.com",
        "amount": -100,
        "currency": "INR",
        "description": "Invalid Payment",
    }

    response = client.post(
        "/payments",
        json=payload,
        headers=headers,
    )

    assert response.status_code == 422