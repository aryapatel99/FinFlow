# 💳 FinFlow

<p align="center">

<img src="https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python"/>

<img src="https://img.shields.io/badge/FastAPI-Production-green?style=for-the-badge&logo=fastapi"/>

<img src="https://img.shields.io/badge/AWS-DynamoDB-orange?style=for-the-badge&logo=amazonaws"/>

<img src="https://img.shields.io/badge/Razorpay-Integrated-blue?style=for-the-badge"/>

<img src="https://img.shields.io/badge/JWT-Secured-success?style=for-the-badge"/>

<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge"/>

</p>

<h3 align="center">
Production-Ready Payment Management Backend built with FastAPI, AWS DynamoDB & Razorpay
</h3>

<p align="center">

A scalable, secure and cloud-ready backend application demonstrating modern backend engineering practices including authentication, payment processing, webhook integration and AWS cloud services.

</p>

---

# 📖 Overview

FinFlow is a production-ready backend payment management system developed using **FastAPI** following enterprise backend architecture.

The project simulates how payment systems are built in real software companies by implementing secure authentication, payment workflows, cloud database integration and third-party payment gateway communication.

Unlike a basic CRUD application, FinFlow focuses on production-level backend development using layered architecture, clean code principles and cloud-native design.

---

# ✨ Features

## 🔐 Authentication & Authorization

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing
- Protected Routes
- Role-Based Authorization
- User-specific Resource Access

---

## 💳 Payment Management

- Create Payment
- Retrieve User Payments
- Retrieve Payment by ID
- Delete Payment
- Payment Status Management
- Payment Ownership Validation

---

## 💰 Razorpay Integration

- Razorpay Order Creation
- Secure Checkout
- Payment Verification
- Razorpay Signature Validation
- Webhook Integration
- Automatic Payment Status Updates

---

## ☁ AWS Integration

- Amazon DynamoDB
- Cloud-ready Configuration
- Repository Pattern
- Production Database Design

---

## 🛡 Production Features

- Layered Architecture
- Dependency Injection
- Request Validation
- Response Models
- Structured Logging
- Global Exception Handling
- Configuration Management
- Modular Design
- OpenAPI Documentation

---

# 🏗 Architecture

```text
                    Client
                       │
                       ▼
               FastAPI Router
                       │
          JWT Authentication
                       │
                       ▼
              Business Services
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
 Razorpay Service      Payment Service
        │                     │
        ▼                     ▼
 Razorpay APIs      Repository Layer
                              │
                              ▼
                    Amazon DynamoDB
```

---

# 🔐 Security Features

- JWT Authentication
- Password Hashing
- Protected APIs
- Role-Based Access Control
- Payment Ownership Validation
- Request Validation
- Razorpay Signature Verification
- Webhook Verification
- Centralized Exception Handling

---

# 🛠 Tech Stack

## Backend

- Python
- FastAPI
- Uvicorn

---

## Database

- Amazon DynamoDB
- boto3

---

## Payment Gateway

- Razorpay SDK
- Razorpay Webhooks

---

## Authentication

- JWT
- python-jose
- Passlib (bcrypt)

---

## Validation

- Pydantic
- Email Validator

---

## Development

- Git
- GitHub
- VS Code

---

## Testing

- Pytest
- HTTPX
- FastAPI TestClient

---

# 📂 Project Structure

```text
FinFlow/

├── app/
│
├── api/
│   ├── auth_api.py
│   ├── payment_api.py
│   ├── payment_verify_api.py
│   ├── checkout_api.py
│   ├── webhook_api.py
│   └── admin_api.py
│
├── auth/
│   ├── auth_handler.py
│   ├── dependencies.py
│   └── password.py
│
├── config/
│   └── settings.py
│
├── exceptions/
│
├── middleware/
│
├── models/
│
├── repositories/
│
├── schemas/
│
├── services/
│   ├── payment_service.py
│   ├── razorpay_service.py
│   └── auth_service.py
│
├── templates/
│   └── checkout.html
│
├── utils/
│
├── main.py
│
├── tests/
│
├── requirements.txt
├── LICENSE
└── README.md
```

---

# ⚙ Design Principles

FinFlow follows modern backend engineering principles:

- Layered Architecture
- Repository Pattern
- Service-Oriented Design
- Separation of Concerns
- Single Responsibility Principle
- Dependency Injection
- Cloud-Ready Design
- Secure Authentication
- Clean Code Practices

---

# 🎯 Project Objectives

This project demonstrates practical backend engineering skills including:

- Production REST APIs
- Secure Authentication
- Cloud Database Integration
- Payment Gateway Integration
- Webhook Processing
- Scalable Backend Architecture
- AWS Service Integration
- Enterprise Code Organization

---
# ⚙ Installation

## Prerequisites

Before running FinFlow locally, ensure the following are installed:

- Python 3.11+
- Git
- pip
- AWS Account
- Razorpay Test Account
- VS Code (Recommended)

---

## Clone Repository

```bash
git clone https://github.com/aryapatel99/FinFlow.git

cd FinFlow
```

---

## Create Virtual Environment

### Windows

```bash
python -m venv .venv

.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv

source .venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# ⚙ Environment Variables

Create a `.env` file inside the project root.

```env
# Application

APP_NAME=FinFlow

APP_VERSION=1.0.0

APP_DESCRIPTION=Production Ready Payment Backend



# JWT

JWT_SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256



# AWS

AWS_ACCESS_KEY_ID=YOUR_KEY

AWS_SECRET_ACCESS_KEY=YOUR_SECRET

AWS_REGION=ap-south-1

DYNAMODB_TABLE=payments



# Razorpay

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx

RAZORPAY_KEY_SECRET=xxxxxxxxxxxx

RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxx
```

> **Never commit your `.env` file to GitHub.**

---

# ▶ Running the Application

```bash
uvicorn app.main:app --reload
```

Application:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

ReDoc Documentation:

```
http://127.0.0.1:8000/redoc
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Register User |
| POST | `/auth/login` | User Login |

---

## Payments

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/payments` | Create Payment |
| GET | `/payments` | Get User Payments |
| GET | `/payments/{payment_id}` | Get Payment |
| DELETE | `/payments/{payment_id}` | Delete Payment |

---

## Razorpay

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/payments/{payment_id}/checkout` | Create Razorpay Order |
| POST | `/payments/verify` | Verify Payment |
| POST | `/webhook/razorpay` | Razorpay Webhook |

---

## Checkout

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/checkout/{payment_id}` | Razorpay Checkout |

---

# 💳 Payment Flow

```text
User
 │
 ▼
Login
 │
 ▼
Create Payment
 │
 ▼
Create Razorpay Order
 │
 ▼
Checkout Page
 │
 ▼
Razorpay Payment
 │
 ▼
Payment Verification
 │
 ▼
Webhook Trigger
 │
 ▼
Update DynamoDB
 │
 ▼
Payment Completed
```

---

# ☁ AWS Architecture

```text
             FastAPI

                │

                ▼

        Payment Service

                │

                ▼

         DynamoDB Repository

                │

                ▼

         Amazon DynamoDB
```

---

# 📸 Screenshots

## Swagger UI

> *(Add Screenshot)*

---

## Razorpay Checkout

> *(Add Screenshot)*

---

## Razorpay Dashboard

> *(Add Screenshot)*

---

## DynamoDB Table

> *(Add Screenshot)*

---

## Payment Verification

> *(Add Screenshot)*

---

# 🧪 Testing

Run all tests.

```bash
pytest
```

Expected output:

```text
========================

All tests passed

========================
```

Current automated testing includes:

- Authentication
- Payment CRUD
- Validation
- Payment Verification
- Razorpay Integration
- Repository Tests

---

# 🚀 Roadmap

## ✅ Phase 1

- [x] FastAPI Setup
- [x] Layered Architecture
- [x] CRUD APIs
- [x] Validation
- [x] Exception Handling
- [x] Logging

---

## ✅ Phase 2

- [x] JWT Authentication
- [x] Role-Based Authorization
- [x] AWS DynamoDB
- [x] Repository Pattern
- [x] Secure APIs

---

## ✅ Phase 3

- [x] Razorpay Integration
- [x] Checkout API
- [x] Payment Verification
- [x] Webhook Integration
- [x] Secure Payment Flow

---

## 🚧 Phase 4

- [ ] React Frontend
- [ ] Dashboard
- [ ] User Profile
- [ ] Payment History
- [ ] Responsive UI

---

## 🌟 Future Enhancements

- Docker
- Redis
- CI/CD
- GitHub Actions
- ECS Deployment
- API Versioning
- Monitoring
- Rate Limiting
- Analytics Dashboard

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# 📜 License

This project is licensed under the **MIT License**.

See the LICENSE file for more information.

---

# 👨‍💻 Author

## Arya Patel

Backend Developer • Software Engineering Student • AI/ML Enthusiast

### Connect with me

- GitHub: https://github.com/aryapatel99
- LinkedIn: https://www.linkedin.com/in/aryapatel9586

---

# ⭐ Support

If you found this project useful:

- ⭐ Star this repository
- 🍴 Fork the repository
- 🐛 Report issues
- 💡 Suggest improvements

---

# 🙏 Acknowledgements

Special thanks to:

- FastAPI
- AWS
- Razorpay
- Python Community
- Open Source Community

for providing amazing tools and documentation.

---

<p align="center">

## Built with ❤️ using Python, FastAPI, AWS DynamoDB & Razorpay

### FinFlow — Production-Ready Payment Management Backend

</p>