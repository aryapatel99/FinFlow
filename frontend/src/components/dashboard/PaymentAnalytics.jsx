import {
    useMemo,
} from "react";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";


function PaymentAnalytics({
    payments = [],
    loading = false,
}) {

    const chartData =
        useMemo(() => {

            if (!Array.isArray(payments)) {
                return [];
            }


            const grouped = {};


            payments.forEach(
                (payment) => {

                    const rawDate =
                        payment.created_at ||
                        payment.updated_at;


                    if (!rawDate) {
                        return;
                    }


                    const date =
                        new Date(rawDate);


                    if (
                        Number.isNaN(
                            date.getTime()
                        )
                    ) {
                        return;
                    }


                    const key =
                        date.toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                            }
                        );


                    if (!grouped[key]) {

                        grouped[key] = {
                            date: key,
                            payments: 0,
                            amount: 0,
                        };

                    }


                    grouped[key].payments += 1;


                    const amount =
                        Number(
                            payment.amount
                        );


                    if (
                        Number.isFinite(
                            amount
                        )
                    ) {

                        grouped[key].amount +=
                            amount;

                    }

                }
            );


            return Object.values(
                grouped
            )
                .slice(-7);

        }, [
            payments,
        ]);


    if (loading) {

        return (
            <div className="chart-loading">

                <div className="chart-skeleton" />

                <span>
                    Loading analytics...
                </span>

            </div>
        );

    }


    if (chartData.length === 0) {

        return (
            <div className="chart-empty">

                <div className="chart-empty-icon">
                    —
                </div>

                <strong>
                    No payment activity yet
                </strong>

                <span>
                    Your payment analytics will
                    appear here after you create
                    transactions.
                </span>

            </div>
        );

    }


    return (
        <div className="payment-chart">

            <ResponsiveContainer
                width="100%"
                height={290}
            >

                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 8,
                        left: -18,
                        bottom: 0,
                    }}
                >

                    <defs>

                        <linearGradient
                            id="finflowPaymentGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >

                            <stop
                                offset="0%"
                                stopOpacity={0.28}
                            />

                            <stop
                                offset="100%"
                                stopOpacity={0}
                            />

                        </linearGradient>

                    </defs>


                    <CartesianGrid
                        strokeDasharray="4 5"
                        vertical={false}
                    />


                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                    />


                    <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                    />


                    <Tooltip
                        contentStyle={{
                            borderRadius: "14px",
                            border: "1px solid rgba(148, 163, 184, 0.18)",
                            boxShadow:
                                "0 12px 35px rgba(15, 23, 42, 0.12)",
                        }}
                        formatter={(value) => [
                            value,
                            "Payments",
                        ]}
                    />


                    <Area
                        type="monotone"
                        dataKey="payments"
                        strokeWidth={2.5}
                        fill="url(#finflowPaymentGradient)"
                        stroke="currentColor"
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>
    );
}


export default PaymentAnalytics;