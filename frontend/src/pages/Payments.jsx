import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    Search,
    CreditCard,
    CheckCircle2,
    Clock3,
    XCircle,
    Plus,
    RefreshCw,
    ArrowUpRight,
} from "lucide-react";

import AppShell from "../components/AppShell";

import {
    getMyPayments,
} from "../services/api";

import "../styles/premium-pages.css";


function getErrorMessage(error) {
    const detail = error?.response?.data?.detail;

    if (typeof detail === "string") {
        return detail;
    }

    if (Array.isArray(detail)) {
        return detail
            .map((item) => item?.msg)
            .filter(Boolean)
            .join(", ");
    }

    return "Unable to load your payments.";
}


function formatAmount(amount, currency) {
    try {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: currency || "INR",
                maximumFractionDigits: 2,
            }
        ).format(Number(amount) || 0);
    } catch {
        return `${currency || "INR"} ${Number(amount) || 0}`;
    }
}


function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}


function StatusBadge({ status }) {
    const normalized =
        String(status || "PENDING").toUpperCase();

    const className =
        normalized === "COMPLETED"
            ? "completed"
            : normalized === "FAILED"
                ? "failed"
                : normalized === "PROCESSING"
                    ? "processing"
                    : "pending";

    return (
        <span className={`ff-status ${className}`}>
            <span className="ff-status-dot" />
            {normalized}
        </span>
    );
}


function EmptyPayments() {
    return (
        <div className="ff-empty">

            <div className="ff-empty-icon">
                <CreditCard size={27} />
            </div>

            <h3>
                No payments yet
            </h3>

            <p>
                Your payment activity will appear here once
                you create your first payment.
            </p>

            <Link
                to="/payments/create"
                className="ff-primary-btn"
            >
                <Plus size={17} />
                Create your first payment
            </Link>

        </div>
    );
}


function Payments() {

    const [payments, setPayments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");


    const loadPayments =
        async () => {

            setLoading(true);
            setError("");

            try {

                const data =
                    await getMyPayments();

                setPayments(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load payments:",
                    error
                );

                setError(
                    getErrorMessage(error)
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {
        loadPayments();
    }, []);


    const filteredPayments =
        useMemo(() => {

            const query =
                search.trim().toLowerCase();

            return payments.filter(
                (payment) => {

                    const matchesSearch =
                        !query ||
                        String(
                            payment.customer_name || ""
                        )
                            .toLowerCase()
                            .includes(query) ||
                        String(
                            payment.description || ""
                        )
                            .toLowerCase()
                            .includes(query) ||
                        String(
                            payment.payment_id || ""
                        )
                            .toLowerCase()
                            .includes(query);

                    const matchesStatus =
                        statusFilter === "ALL" ||
                        String(
                            payment.status || ""
                        ).toUpperCase() === statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            payments,
            search,
            statusFilter,
        ]);


    const stats =
        useMemo(() => {

            const completed =
                payments.filter(
                    (p) =>
                        String(p.status)
                            .toUpperCase() === "COMPLETED"
                );

            const pending =
                payments.filter(
                    (p) =>
                        String(p.status)
                            .toUpperCase() === "PENDING"
                );

            const failed =
                payments.filter(
                    (p) =>
                        String(p.status)
                            .toUpperCase() === "FAILED"
                );

            return {
                total: payments.length,
                completed: completed.length,
                pending: pending.length,
                failed: failed.length,
            };

        }, [payments]);


    return (
        <AppShell>

            <main className="ff-premium-page">

                <header className="ff-page-header">

                    <div className="ff-page-header-copy">

                        <div className="ff-eyebrow">
                            <span className="ff-eyebrow-dot" />
                            PAYMENT CENTER
                        </div>

                        <h1>
                            Your Payments
                        </h1>

                        <p>
                            Track every transaction, review payment
                            status and securely continue pending checkouts.
                        </p>

                    </div>

                    <Link
                        to="/payments/create"
                        className="ff-primary-btn"
                    >
                        <Plus size={17} />
                        Create Payment
                        <ArrowUpRight size={16} />
                    </Link>

                </header>


                <section className="ff-stat-grid">

                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Total Payments</span>

                            <div className="ff-stat-icon blue">
                                <CreditCard size={18} />
                            </div>
                        </div>

                        <strong>
                            {stats.total}
                        </strong>

                        <small>
                            All payment requests
                        </small>

                    </div>


                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Completed</span>

                            <div className="ff-stat-icon green">
                                <CheckCircle2 size={18} />
                            </div>
                        </div>

                        <strong>
                            {stats.completed}
                        </strong>

                        <small>
                            Successfully completed
                        </small>

                    </div>


                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Pending</span>

                            <div className="ff-stat-icon amber">
                                <Clock3 size={18} />
                            </div>
                        </div>

                        <strong>
                            {stats.pending}
                        </strong>

                        <small>
                            Awaiting payment
                        </small>

                    </div>


                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Failed</span>

                            <div className="ff-stat-icon red">
                                <XCircle size={18} />
                            </div>
                        </div>

                        <strong>
                            {stats.failed}
                        </strong>

                        <small>
                            Unsuccessful payments
                        </small>

                    </div>

                </section>


                <section className="ff-panel">

                    <div className="ff-panel-header">

                        <div className="ff-panel-title">

                            <div className="ff-panel-title-icon">
                                <CreditCard size={19} />
                            </div>

                            <div>
                                <h2>
                                    Payment activity
                                </h2>

                                <p>
                                    {filteredPayments.length} payment
                                    {filteredPayments.length === 1 ? "" : "s"} shown
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            className="ff-secondary-btn"
                            onClick={loadPayments}
                        >
                            <RefreshCw size={15} />
                            Refresh
                        </button>

                    </div>


                    <div className="ff-toolbar">

                        <div className="ff-search">

                            <Search size={17} />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search payments..."
                            />

                        </div>


                        <select
                            className="ff-select"
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                        >
                            <option value="ALL">
                                All statuses
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>

                            <option value="PROCESSING">
                                Processing
                            </option>
                        </select>

                    </div>


                    {error && (
                        <div className="ff-message error">
                            {error}
                        </div>
                    )}


                    {loading ? (

                        <div className="ff-empty">

                            <RefreshCw
                                size={27}
                                className="ff-spin"
                            />

                            <h3>
                                Loading payments
                            </h3>

                            <p>
                                Fetching your latest transaction activity.
                            </p>

                        </div>

                    ) : filteredPayments.length === 0 ? (

                        <EmptyPayments />

                    ) : (

                        <div className="ff-payment-list">

                            {filteredPayments.map(
                                (payment) => (

                                    <Link
                                        key={
                                            payment.payment_id
                                        }
                                        to={
                                            `/payments/${payment.payment_id}`
                                        }
                                        className="ff-payment-row"
                                    >

                                        <div className="ff-payment-main">

                                            <div className="ff-payment-icon">
                                                <CreditCard size={19} />
                                            </div>

                                            <div className="ff-payment-main-text">

                                                <div className="ff-payment-title">
                                                    {
                                                        payment.description ||
                                                        "Payment"
                                                    }
                                                </div>

                                                <div className="ff-payment-description">
                                                    {
                                                        payment.customer_name ||
                                                        "Customer"
                                                    }
                                                </div>

                                                <div className="ff-payment-id">
                                                    {payment.payment_id}
                                                </div>

                                            </div>

                                        </div>


                                        <div>
                                            <span className="ff-payment-label">
                                                Amount
                                            </span>

                                            <span className="ff-payment-amount">
                                                {
                                                    formatAmount(
                                                        payment.amount,
                                                        payment.currency
                                                    )
                                                }
                                            </span>
                                        </div>


                                        <div>
                                            <span className="ff-payment-label">
                                                Created
                                            </span>

                                            <span className="ff-payment-date">
                                                {
                                                    formatDate(
                                                        payment.created_at
                                                    )
                                                }
                                            </span>
                                        </div>


                                        <div>
                                            <StatusBadge
                                                status={
                                                    payment.status
                                                }
                                            />
                                        </div>

                                    </Link>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </AppShell>
    );
}


export default Payments;