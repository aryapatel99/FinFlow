import boto3
from botocore.exceptions import ClientError

REGION = "ap-south-1"
TABLE_NAME = "FinFlowPayments"


def get_dynamodb():
    """
    Returns the DynamoDB resource.
    Uses credentials configured through AWS CLI.
    """
    return boto3.resource(
        "dynamodb",
        region_name=REGION
    )


def get_payments_table():
    """
    Returns the FinFlowPayments table object.
    """
    dynamodb = get_dynamodb()
    return dynamodb.Table(TABLE_NAME)


def check_connection():
    """
    Verify that the DynamoDB table is accessible.
    """
    try:
        table = get_payments_table()
        table.load()
        print(f"✅ Connected to DynamoDB table: {table.table_name}")
        return True
    except ClientError as e:
        print(f"❌ Connection failed: {e.response['Error']['Message']}")
        return False