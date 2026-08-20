import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ArrowUpRight,
    CreditCard,
    IndianRupee,
    ShieldCheck,
    TrendingUp,
    Wallet,
} from "lucide-react";

import {
    motion,
} from "motion/react";

import {
    useAuth,
} from "../context/AuthContext";

import {
    getPayments,
} from "../services/api";

import StatCard from "../components/dashboard/StatCard";
import PaymentAnalytics from "../components/dashboard/PaymentAnalytics";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import QuickActions from "../components/dashboard/QuickActions";

import "../styles/dashboard.css";


function Dashboard() {

    const {
        user,
    } = useAuth();


    const [
        payments,
        setPayments,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {

        let mounted = true;


        const loadPayments =
            async () => {

                try {

                    setLoading(true);
                    setError("");


                    const data =
                        await getPayments();


                    if (!mounted) {
                        return;
                    }


                    setPayments(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Dashboard payment loading failed:",
                        error
                    );


                    if (!mounted) {
                        return;
                    }


                    setError(
                        error.response?.data?.detail ||
                        "Unable to load payment analytics."
                    );

                } finally {

                    if (mounted) {
                        setLoading(false);
                    }

                }

            };


        loadPayments();


        return () => {
            mounted = false;
        };

    }, []);


    const statistics =
        useMemo(() => {

            const totalPayments =
                payments.length;


            const completedPayments =
                payments.filter(
                    (payment) =>
                        String(
                            payment.status || ""
                        ).toUpperCase() ===
                        "COMPLETED"
                );


            const processingPayments =
                payments.filter(
                    (payment) =>
                        String(
                            payment.status || ""
                        ).toUpperCase() ===
                        "PROCESSING"
                );


            const failedPayments =
                payments.filter(
                    (payment) =>
                        String(
                            payment.status || ""
                        ).toUpperCase() ===
                        "FAILED"
                );


            const totalAmount =
                payments.reduce(
                    (
                        total,
                        payment
                    ) => {

                        const amount =
                            Number(
                                payment.amount
                            );


                        if (
                            Number.isFinite(
                                amount
                            )
                        ) {

                            return (
                                total +
                                amount
                            );

                        }


                        return total;

                    },
                    0
                );


            const completedAmount =
                completedPayments.reduce(
                    (
                        total,
                        payment
                    ) => {

                        const amount =
                            Number(
                                payment.amount
                            );


                        if (
                            Number.isFinite(
                                amount
                            )
                        ) {

                            return (
                                total +
                                amount
                            );

                        }


                        return total;

                    },
                    0
                );


            const successRate =
                totalPayments > 0
                    ? (
                        completedPayments.length /
                        totalPayments
                    ) * 100
                    : 0;


            return {
                totalPayments,
                completedPayments:
                    completedPayments.length,
                processingPayments:
                    processingPayments.length,
                failedPayments:
                    failedPayments.length,
                totalAmount,
                completedAmount,
                successRate,
            };

        }, [
            payments,
        ]);


    const formatCurrency =
        (amount) => {

            const numericAmount =
                Number(amount) || 0;


            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                }
            ).format(
                numericAmount
            );

        };


    const displayName =
        user?.full_name ||
        user?.email?.split("@")[0] ||
        "there";


    const greeting =
        new Date().getHours() < 12
            ? "Good morning"
            : new Date().getHours() < 18
                ? "Good afternoon"
                : "Good evening";


    return (
        <div className="finflow-dashboard">

            {/* =====================================
                Header
            ===================================== */}

            <motion.section
                className="dashboard-hero"
                initial={{
                    opacity: 0,
                    y: 12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                }}
            >

                <div>

                    <div className="dashboard-eyebrow">
                        Financial overview
                    </div>

                    <h1>
                        {greeting},{" "}
                        <span>
                            {displayName}
                        </span>
                    </h1>

                    <p>
                        Track your payments,
                        spending activity,
                        and account performance
                        from one place.
                    </p>

                </div>


                <Link
                    to="/payments/create"
                    className="dashboard-primary-action"
                >

                    <CreditCard
                        size={18}
                    />

                    Create Payment

                    <ArrowUpRight
                        size={17}
                    />

                </Link>

            </motion.section>


            {/* =====================================
                Statistics
            ===================================== */}

            <section className="dashboard-stats">

                <StatCard
                    title="Total Payments"
                    value={
                        loading
                            ? "—"
                            : statistics.totalPayments
                    }
                    description="All payment records"
                    icon={CreditCard}
                    delay={0.05}
                />


                <StatCard
                    title="Completed"
                    value={
                        loading
                            ? "—"
                            : statistics.completedPayments
                    }
                    description={
                        loading
                            ? "Loading..."
                            : `${statistics.successRate.toFixed(1)}% success rate`
                    }
                    icon={ShieldCheck}
                    delay={0.1}
                    positive
                />


                <StatCard
                    title="Total Value"
                    value={
                        loading
                            ? "—"
                            : formatCurrency(
                                statistics.totalAmount
                            )
                    }
                    description={
                        loading
                            ? "Loading..."
                            : `${formatCurrency(statistics.completedAmount)} completed`
                    }
                    icon={IndianRupee}
                    delay={0.15}
                />


                <StatCard
                    title="Processing"
                    value={
                        loading
                            ? "—"
                            : statistics.processingPayments
                    }
                    description={
                        loading
                            ? "Loading..."
                            : `${statistics.failedPayments} failed`
                    }
                    icon={TrendingUp}
                    delay={0.2}
                />

            </section>


            {/* =====================================
                Main Analytics
            ===================================== */}

            <section className="dashboard-main-grid">

                <motion.div
                    className="dashboard-panel analytics-panel"
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.45,
                        delay: 0.15,
                    }}
                >

                    <div className="panel-heading">

                        <div>

                            <span>
                                Payment analytics
                            </span>

                            <h2>
                                Payment activity
                            </h2>

                        </div>


                        <div className="panel-icon">

                            <TrendingUp
                                size={18}
                            />

                        </div>

                    </div>


                    <PaymentAnalytics
                        payments={payments}
                        loading={loading}
                    />

                </motion.div>


                <QuickActions
                    user={user}
                />

            </section>


            {/* =====================================
                Recent Transactions
            ===================================== */}

            <motion.section
                className="dashboard-panel"
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.45,
                    delay: 0.25,
                }}
            >

                <div className="panel-heading">

                    <div>

                        <span>
                            Activity
                        </span>

                        <h2>
                            Recent transactions
                        </h2>

                    </div>


                    <Link
                        to="/payments"
                        className="panel-link"
                    >

                        View all

                        <ArrowUpRight
                            size={16}
                        />

                    </Link>

                </div>


                {error ? (

                    <div className="dashboard-error">

                        <ShieldCheck
                            size={20}
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                ) : (

                    <RecentTransactions
                        payments={payments}
                        loading={loading}
                    />

                )}

            </motion.section>


            {/* =====================================
                Account Summary
            ===================================== */}

            <motion.section
                className="dashboard-summary"
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.35,
                }}
            >

                <div className="summary-icon">

                    <Wallet
                        size={20}
                    />

                </div>


                <div>

                    <strong>
                        FinFlow account
                    </strong>

                    <span>
                        {user?.email}
                    </span>

                </div>


                <div className="summary-role">

                    {user?.role === "admin"
                        ? "Administrator"
                        : "Customer"}

                </div>

            </motion.section>

        </div>
    );
}


export default Dashboard;