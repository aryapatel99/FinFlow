from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_users: int

    total_admins: int

    total_customers: int

    total_payments: int

    pending_payments: int

    completed_payments: int

    failed_payments: int

    total_revenue: float