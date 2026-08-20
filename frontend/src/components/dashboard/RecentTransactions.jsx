import {
    Link,
} from "react-router-dom";

import {
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";


function RecentTransactions({
    payments = [],
    loading = false,
}) {

    if (loading) {

        return (
            <div className="transactions-loading">

                <div />
                <div />
                <div />

            </div>
        );

    }


    const recentPayments =
        Array.isArray(payments)
            ? [...payments]
                .sort(
                    (a, b) => {

                        const first =
                            new Date(
                                a.created_at || 0
                            ).getTime();


                        const second =
                            new Date(
                                b.created_at || 0
                            ).getTime();


                        return second - first;

                    }
                )
                .slice(0, 5)
            : [];


    if (recentPayments.length === 0) {

        return (
            <div className="transactions-empty">

                <strong>
                    No transactions yet
                </strong>

                <span>
                    Create your first payment to
                    start tracking activity.
                </span>

                <Link
                    to="/payments/create"
                    className="inline-action"
                >

                    Create Payment

                    <ArrowUpRight
                        size={15}
                    />

                </Link>

            </div>
        );

    }


    const getStatusIcon =
        (status) => {

            const normalized =
                String(
                    status || ""
                ).toUpperCase();


            if (
                normalized ===
                "COMPLETED"
            ) {

                return (
                    <CheckCircle2
                        size={17}
                    />
                );

            }


            if (
                normalized ===
                "FAILED"
            ) {

                return (
                    <XCircle
                        size={17}
                    />
                );

            }


            return (
                <Clock3
                    size={17}
                />
            );

        };


    const formatAmount =
        (amount) => {

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                }
            ).format(
                Number(amount) || 0
            );

        };


    const formatDate =
        (date) => {

            if (!date) {
                return "—";
            }


            const parsed =
                new Date(date);


            if (
                Number.isNaN(
                    parsed.getTime()
                )
            ) {
                return "—";
            }


            return parsed.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );

        };


    return (
        <div className="transactions-table-wrapper">

            <div className="transactions-table">

                <div className="transaction-row transaction-header">

                    <span>
                        Payment
                    </span>

                    <span>
                        Amount
                    </span>

                    <span>
                        Status
                    </span>

                    <span>
                        Date
                    </span>

                </div>


                {recentPayments.map(
                    (payment) => {

                        const status =
                            String(
                                payment.status ||
                                "PENDING"
                            ).toUpperCase();


                        return (
                            <Link
                                key={
                                    payment.payment_id
                                }
                                to={
                                    `/payments/${payment.payment_id}`
                                }
                                className="transaction-row transaction-link"
                            >

                                <span className="transaction-id">

                                    <span className="transaction-dot">
                                        {getStatusIcon(
                                            status
                                        )}
                                    </span>

                                    <span>
                                        {payment.payment_id
                                            ? `#${String(
                                                payment.payment_id
                                            ).slice(
                                                0,
                                                8
                                            )}`
                                            : "Payment"}
                                    </span>

                                </span>


                                <span className="transaction-amount">

                                    {formatAmount(
                                        payment.amount
                                    )}

                                </span>


                                <span>

                                    <span
                                        className={
                                            `status-badge status-${status.toLowerCase()}`
                                        }
                                    >

                                        {status}

                                    </span>

                                </span>


                                <span className="transaction-date">

                                    {formatDate(
                                        payment.created_at
                                    )}

                                </span>

                            </Link>
                        );

                    }
                )}

            </div>

        </div>
    );
}


export default RecentTransactions;