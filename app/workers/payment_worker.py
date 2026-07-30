import json

from app.config.sqs import get_sqs_client, QUEUE_URL
from app.schemas.payment_schema import PaymentCreate
from app.services.payment_service import PaymentService

client = get_sqs_client()
payment_service = PaymentService()

print("🚀 Payment Worker Started...")

while True:

    response = client.receive_message(
        QueueUrl=QUEUE_URL,
        MaxNumberOfMessages=1,
        WaitTimeSeconds=10
    )

    messages = response.get("Messages", [])

    if not messages:
        continue

    for message in messages:

        try:

            body = json.loads(message["Body"])

            print("\n📩 New Payment Received")
            print(body)

            payment_data = PaymentCreate(**body)

            saved_payment = payment_service.create_payment(payment_data)

            print(f"✅ Payment saved successfully!")
            print(f"Payment ID: {saved_payment.payment_id}")

            client.delete_message(
                QueueUrl=QUEUE_URL,
                ReceiptHandle=message["ReceiptHandle"]
            )

            print("🗑 Message deleted from queue")

        except Exception as e:

            print("❌ Error:", e)