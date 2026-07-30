import boto3
import json

REGION = "ap-south-1"
QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/055316374338/FinFlowPaymentQueue"


def get_sqs_client():
    return boto3.client(
        "sqs",
        region_name=REGION
    )


def check_connection():
    client = get_sqs_client()

    response = client.get_queue_attributes(
        QueueUrl=QUEUE_URL,
        AttributeNames=["QueueArn"]
    )

    print("✅ Connected to SQS")
    print("Queue ARN:", response["Attributes"]["QueueArn"])


def send_message(message):
    client = get_sqs_client()

    response = client.send_message(
        QueueUrl=QUEUE_URL,
        MessageBody=json.dumps(message)
    )

    print("✅ Message sent successfully!")
    print("Message ID:", response["MessageId"])

    return response