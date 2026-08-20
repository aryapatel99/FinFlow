import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    deleteAdminPayment,
    getAdminPayments,
    updateAdminPaymentStatus,
} from "../services/api";


function AdminPayments() {

    const [
        payments,
        setPayments,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("ALL");

    const [
        actionLoading,
        setActionLoading,
    ] = useState("");

    const [
        copiedId,
        setCopiedId,
    ] = useState("");


    const loadPayments =
        async (
            showRefresh = false,
        ) => {

            try {

                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const data =
                    await getAdminPayments();

                setPayments(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    err.message ||
                    "Unable to load payments."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);

            }

        };


    useEffect(() => {

        loadPayments();

    }, []);


    const clearNotifications =
        () => {

            setError("");
            setMessage("");

        };


    const changeStatus =
        async (
            paymentId,
            status,
        ) => {

            try {

                clearNotifications();

                setActionLoading(
                    `${paymentId}-${status}`
                );

                await updateAdminPaymentStatus(
                    paymentId,
                    status
                );

                setMessage(
                    `Payment marked as ${status.toLowerCase()}.`
                );

                await loadPayments();

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    err.message ||
                    "Unable to update payment status."
                );

            } finally {

                setActionLoading("");

            }

        };


    const handleDelete =
        async (paymentId) => {

            const confirmed =
                window.confirm(
                    "Delete this payment permanently?"
                );

            if (!confirmed) {
                return;
            }

            try {

                clearNotifications();

                setActionLoading(
                    `${paymentId}-DELETE`
                );

                await deleteAdminPayment(
                    paymentId
                );

                setMessage(
                    "Payment deleted successfully."
                );

                await loadPayments();

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    err.message ||
                    "Unable to delete payment."
                );

            } finally {

                setActionLoading("");

            }

        };


    const copyPaymentId =
        async (paymentId) => {

            try {

                await navigator.clipboard.writeText(
                    paymentId
                );

                setCopiedId(paymentId);

                setTimeout(() => {
                    setCopiedId("");
                }, 1600);

            } catch {

                setError(
                    "Unable to copy payment ID."
                );

            }

        };


    const filteredPayments =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            return payments.filter(
                (payment) => {

                    const matchesStatus =
                        statusFilter === "ALL" ||
                        payment.status === statusFilter;

                    if (!matchesStatus) {
                        return false;
                    }

                    if (!query) {
                        return true;
                    }

                    return (
                        String(
                            payment.payment_id || ""
                        )
                            .toLowerCase()
                            .includes(query) ||

                        String(
                            payment.customer_name || ""
                        )
                            .toLowerCase()
                            .includes(query) ||

                        String(
                            payment.email || ""
                        )
                            .toLowerCase()
                            .includes(query)
                    );

                }
            );

        }, [
            payments,
            search,
            statusFilter,
        ]);


    const statistics =
        useMemo(() => {

            let completed = 0;
            let pending = 0;
            let processing = 0;
            let failed = 0;

            let totalValue = 0;

            payments.forEach(
                (payment) => {

                    const status =
                        String(
                            payment.status || ""
                        ).toUpperCase();

                    if (status === "COMPLETED") {
                        completed++;
                    }

                    if (status === "PENDING") {
                        pending++;
                    }

                    if (status === "PROCESSING") {
                        processing++;
                    }

                    if (status === "FAILED") {
                        failed++;
                    }

                    const numericAmount =
                        Number(
                            payment.amount
                        );

                    if (
                        Number.isFinite(
                            numericAmount
                        )
                    ) {
                        totalValue +=
                            numericAmount;
                    }

                }
            );

            return {
                total: payments.length,
                completed,
                pending,
                processing,
                failed,
                totalValue,
            };

        }, [payments]);


    const formatAmount =
        (payment) => {

            const amount =
                Number(
                    payment.amount
                );

            if (
                !Number.isFinite(amount)
            ) {
                return `${payment.currency || "INR"} 0.00`;
            }

            return new Intl.NumberFormat(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            ).format(amount);

        };


    const getCurrencySymbol =
        (currency) => {

            const normalized =
                String(
                    currency || "INR"
                ).toUpperCase();

            if (normalized === "INR") {
                return "₹";
            }

            if (normalized === "USD") {
                return "$";
            }

            if (normalized === "EUR") {
                return "€";
            }

            if (normalized === "GBP") {
                return "£";
            }

            return normalized;

        };


    const formatShortId =
        (paymentId) => {

            if (!paymentId) {
                return "—";
            }

            if (paymentId.length <= 18) {
                return paymentId;
            }

            return `${paymentId.slice(
                0,
                8
            )}...${paymentId.slice(-6)}`;

        };


    const getStatusClass =
        (status) => {

            switch (
                String(
                    status || ""
                ).toUpperCase()
            ) {

                case "COMPLETED":
                    return "af-status af-status-success";

                case "PROCESSING":
                    return "af-status af-status-processing";

                case "FAILED":
                    return "af-status af-status-danger";

                case "PENDING":
                    return "af-status af-status-warning";

                default:
                    return "af-status af-status-neutral";

            }

        };


    const getStatusDot =
        (status) => {

            switch (
                String(
                    status || ""
                ).toUpperCase()
            ) {

                case "COMPLETED":
                    return "✓";

                case "PROCESSING":
                    return "↻";

                case "FAILED":
                    return "×";

                case "PENDING":
                    return "•";

                default:
                    return "•";

            }

        };


    if (loading) {

        return (
            <div className="af-page">

                <style>{styles}</style>

                <div className="af-loading-page">

                    <div className="af-loading-spinner" />

                    <div>
                        <strong>
                            Loading payment operations
                        </strong>

                        <span>
                            Fetching transaction records...
                        </span>
                    </div>

                </div>

            </div>
        );

    }


    return (
        <div className="af-page">

            <style>{styles}</style>

            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="af-header">

                <div>

                    <div className="af-eyebrow">
                        PAYMENT OPERATIONS
                    </div>

                    <h1>
                        All Payments
                    </h1>

                    <p>
                        Monitor, manage and control
                        every transaction across
                        FinFlow.
                    </p>

                </div>


                <button
                    type="button"
                    className="af-refresh-button"
                    onClick={() =>
                        loadPayments(true)
                    }
                    disabled={refreshing}
                >

                    <span
                        className={
                            refreshing
                                ? "af-refresh-icon af-spinning"
                                : "af-refresh-icon"
                        }
                    >
                        ↻
                    </span>

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}

                </button>

            </div>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <div className="af-stat-grid">

                <div className="af-stat-card">

                    <div className="af-stat-icon blue">
                        <span>▣</span>
                    </div>

                    <div className="af-stat-content">

                        <span className="af-stat-label">
                            Total Payments
                        </span>

                        <strong>
                            {statistics.total}
                        </strong>

                        <small>
                            All transaction records
                        </small>

                    </div>

                </div>


                <div className="af-stat-card">

                    <div className="af-stat-icon green">
                        <span>✓</span>
                    </div>

                    <div className="af-stat-content">

                        <span className="af-stat-label">
                            Completed
                        </span>

                        <strong>
                            {statistics.completed}
                        </strong>

                        <small className="green-text">
                            Successfully processed
                        </small>

                    </div>

                </div>


                <div className="af-stat-card">

                    <div className="af-stat-icon amber">
                        <span>◷</span>
                    </div>

                    <div className="af-stat-content">

                        <span className="af-stat-label">
                            Pending
                        </span>

                        <strong>
                            {statistics.pending}
                        </strong>

                        <small className="amber-text">
                            Awaiting processing
                        </small>

                    </div>

                </div>


                <div className="af-stat-card">

                    <div className="af-stat-icon purple">
                        <span>₹</span>
                    </div>

                    <div className="af-stat-content">

                        <span className="af-stat-label">
                            Total Value
                        </span>

                        <strong className="af-money">
                            ₹
                            {new Intl.NumberFormat(
                                "en-IN",
                                {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }
                            ).format(
                                statistics.totalValue
                            )}
                        </strong>

                        <small>
                            Across all payments
                        </small>

                    </div>

                </div>

            </div>


            {/* =========================================
                NOTIFICATIONS
            ========================================= */}

            {error && (

                <div className="af-alert af-alert-error">

                    <div className="af-alert-icon">
                        !
                    </div>

                    <div>
                        <strong>
                            Action failed
                        </strong>

                        <span>
                            {error}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {message && (

                <div className="af-alert af-alert-success">

                    <div className="af-alert-icon">
                        ✓
                    </div>

                    <div>
                        <strong>
                            Action completed
                        </strong>

                        <span>
                            {message}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setMessage("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =========================================
                MAIN PANEL
            ========================================= */}

            <section className="af-main-card">

                <div className="af-panel-header">

                    <div>

                        <div className="af-panel-eyebrow">
                            TRANSACTION LEDGER
                        </div>

                        <h2>
                            Payment activity
                        </h2>

                        <p>
                            Review and manage customer
                            payment transactions.
                        </p>

                    </div>

                    <div className="af-record-count">
                        <strong>
                            {filteredPayments.length}
                        </strong>

                        <span>
                            showing
                        </span>
                    </div>

                </div>


                {/* =====================================
                    FILTER BAR
                ===================================== */}

                <div className="af-toolbar">

                    <div className="af-search">

                        <span className="af-search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search by payment ID, customer or email..."
                        />

                        {search && (

                            <button
                                type="button"
                                className="af-clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>

                        )}

                    </div>


                    <div className="af-filter-group">

                        <span>
                            Status
                        </span>

                        <select
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

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="PROCESSING">
                                Processing
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>

                        </select>

                    </div>

                </div>


                {/* =====================================
                    TABLE
                ===================================== */}

                {filteredPayments.length === 0 ? (

                    <div className="af-empty">

                        <div className="af-empty-icon">
                            ⌕
                        </div>

                        <h3>
                            No payments found
                        </h3>

                        <p>
                            Try changing your search
                            or status filter.
                        </p>

                        {(search ||
                            statusFilter !== "ALL") && (

                            <button
                                type="button"
                                onClick={() => {

                                    setSearch("");
                                    setStatusFilter(
                                        "ALL"
                                    );

                                }}
                            >
                                Clear filters
                            </button>

                        )}

                    </div>

                ) : (

                    <div className="af-table-wrap">

                        <table className="af-table">

                            <thead>

                                <tr>

                                    <th>
                                        PAYMENT
                                    </th>

                                    <th>
                                        CUSTOMER
                                    </th>

                                    <th>
                                        AMOUNT
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredPayments.map(
                                    (payment) => {

                                        const status =
                                            String(
                                                payment.status ||
                                                ""
                                            ).toUpperCase();

                                        const paymentId =
                                            payment.payment_id;

                                        const processingKey =
                                            `${paymentId}-PROCESSING`;

                                        const completeKey =
                                            `${paymentId}-COMPLETED`;

                                        const failKey =
                                            `${paymentId}-FAILED`;

                                        const deleteKey =
                                            `${paymentId}-DELETE`;

                                        return (

                                            <tr
                                                key={paymentId}
                                            >

                                                {/* PAYMENT */}

                                                <td>

                                                    <div className="af-payment-cell">

                                                        <div className="af-payment-icon">
                                                            ₹
                                                        </div>

                                                        <div>

                                                            <button
                                                                type="button"
                                                                className="af-payment-id"
                                                                onClick={() =>
                                                                    copyPaymentId(
                                                                        paymentId
                                                                    )
                                                                }
                                                                title="Copy payment ID"
                                                            >

                                                                #
                                                                {
                                                                    formatShortId(
                                                                        paymentId
                                                                    )
                                                                }

                                                            </button>

                                                            <span className="af-copy-label">

                                                                {copiedId === paymentId
                                                                    ? "Copied"
                                                                    : "Click to copy ID"}

                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* CUSTOMER */}

                                                <td>

                                                    <div className="af-customer">

                                                        <div className="af-avatar">

                                                            {
                                                                String(
                                                                    payment.customer_name ||
                                                                    "?"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()
                                                            }

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    payment.customer_name ||
                                                                    "Unknown customer"
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    payment.email ||
                                                                    "No email"
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* AMOUNT */}

                                                <td>

                                                    <div className="af-amount">

                                                        <strong>
                                                            {
                                                                getCurrencySymbol(
                                                                    payment.currency
                                                                )
                                                            }
                                                            {
                                                                formatAmount(
                                                                    payment
                                                                )
                                                                    .replace(
                                                                        /^[A-Z]{3}\s?/,
                                                                        ""
                                                                    )
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                String(
                                                                    payment.currency ||
                                                                    "INR"
                                                                ).toUpperCase()
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={getStatusClass(
                                                            status
                                                        )}
                                                    >

                                                        <span>
                                                            {
                                                                getStatusDot(
                                                                    status
                                                                )
                                                            }
                                                        </span>

                                                        {
                                                            status ||
                                                            "UNKNOWN"
                                                        }

                                                    </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="af-actions">

                                                        {status === "PENDING" && (

                                                            <button
                                                                type="button"
                                                                className="af-action-button af-action-primary"
                                                                disabled={
                                                                    actionLoading ===
                                                                    processingKey
                                                                }
                                                                onClick={() =>
                                                                    changeStatus(
                                                                        paymentId,
                                                                        "PROCESSING"
                                                                    )
                                                                }
                                                            >

                                                                {actionLoading ===
                                                                processingKey
                                                                    ? "..."
                                                                    : "Process"}

                                                            </button>

                                                        )}


                                                        {status === "PROCESSING" && (

                                                            <>

                                                                <button
                                                                    type="button"
                                                                    className="af-action-button af-action-success"
                                                                    disabled={
                                                                        actionLoading ===
                                                                        completeKey
                                                                    }
                                                                    onClick={() =>
                                                                        changeStatus(
                                                                            paymentId,
                                                                            "COMPLETED"
                                                                        )
                                                                    }
                                                                >

                                                                    {actionLoading ===
                                                                    completeKey
                                                                        ? "..."
                                                                        : "Complete"}

                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    className="af-action-button af-action-danger"
                                                                    disabled={
                                                                        actionLoading ===
                                                                        failKey
                                                                    }
                                                                    onClick={() =>
                                                                        changeStatus(
                                                                            paymentId,
                                                                            "FAILED"
                                                                        )
                                                                    }
                                                                >

                                                                    {actionLoading ===
                                                                    failKey
                                                                        ? "..."
                                                                        : "Fail"}

                                                                </button>

                                                            </>

                                                        )}


                                                        <button
                                                            type="button"
                                                            className="af-delete-button"
                                                            disabled={
                                                                actionLoading ===
                                                                deleteKey
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    paymentId
                                                                )
                                                            }
                                                            title="Delete payment"
                                                        >

                                                            {actionLoading ===
                                                            deleteKey
                                                                ? "..."
                                                                : "×"}

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* =========================================
                FOOTER INFORMATION
            ========================================= */}

            <div className="af-footer-info">

                <div className="af-footer-security">

                    <span>
                        ✓
                    </span>

                    <div>
                        <strong>
                            Secure administration
                        </strong>

                        <small>
                            Payment operations are
                            restricted to authorized
                            administrators.
                        </small>
                    </div>

                </div>


                <div className="af-footer-metrics">

                    <span>
                        {statistics.processing} processing
                    </span>

                    <span>
                        {statistics.failed} failed
                    </span>

                    <span>
                        {statistics.completed} completed
                    </span>

                </div>

            </div>

        </div>
    );
}


const styles = `

/* =====================================================
   FINFLOW ADMIN PAYMENTS
===================================================== */

.af-page {
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    padding: 42px 46px 60px;
    color: #f7f9ff;
    background:
        radial-gradient(
            circle at 75% 0%,
            rgba(76, 56, 180, 0.13),
            transparent 34%
        ),
        radial-gradient(
            circle at 20% 30%,
            rgba(37, 99, 235, 0.08),
            transparent 32%
        ),
        #060b17;
    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    box-sizing: border-box;
}


/* =====================================================
   HEADER
===================================================== */

.af-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;
    margin-bottom: 30px;
}

.af-eyebrow {
    margin-bottom: 10px;
    color: #5fa7ff;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.16em;
}

.af-header h1 {
    margin: 0;
    color: #f8fafc;
    font-size: clamp(32px, 4vw, 46px);
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.04em;
}

.af-header p {
    margin: 12px 0 0;
    color: #71809a;
    font-size: 15px;
    line-height: 1.6;
}

.af-refresh-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 44px;
    padding: 0 18px;
    border: 1px solid rgba(117, 144, 190, 0.2);
    border-radius: 12px;
    background: rgba(15, 25, 47, 0.85);
    color: #eaf1ff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition:
        transform 160ms ease,
        border-color 160ms ease,
        background 160ms ease;
}

.af-refresh-button:hover {
    transform: translateY(-1px);
    border-color: rgba(77, 144, 255, 0.55);
    background: rgba(22, 37, 67, 0.95);
}

.af-refresh-button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.af-refresh-icon {
    display: inline-flex;
    font-size: 18px;
}

.af-spinning {
    animation: af-spin 0.8s linear infinite;
}

@keyframes af-spin {
    to {
        transform: rotate(360deg);
    }
}


/* =====================================================
   STAT CARDS
===================================================== */

.af-stat-grid {
    display: grid;
    grid-template-columns:
        repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 22px;
}

.af-stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 124px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid rgba(101, 126, 171, 0.17);
    border-radius: 18px;
    background:
        linear-gradient(
            145deg,
            rgba(18, 31, 56, 0.96),
            rgba(10, 19, 36, 0.9)
        );
    box-shadow:
        0 18px 50px rgba(0, 0, 0, 0.18);
}

.af-stat-icon {
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    font-size: 20px;
    font-weight: 800;
}

.af-stat-icon.blue {
    background: rgba(37, 99, 235, 0.14);
    color: #5ca5ff;
}

.af-stat-icon.green {
    background: rgba(34, 197, 94, 0.12);
    color: #4ade80;
}

.af-stat-icon.amber {
    background: rgba(245, 158, 11, 0.12);
    color: #fbbf24;
}

.af-stat-icon.purple {
    background: rgba(124, 58, 237, 0.15);
    color: #a78bfa;
}

.af-stat-content {
    min-width: 0;
}

.af-stat-label {
    display: block;
    margin-bottom: 5px;
    color: #7786a1;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
}

.af-stat-content strong {
    display: block;
    color: #f7f9ff;
    font-size: 26px;
    line-height: 1.1;
    font-weight: 800;
}

.af-stat-content small {
    display: block;
    margin-top: 6px;
    color: #64738d;
    font-size: 11px;
}

.af-money {
    font-size: 23px !important;
}

.green-text {
    color: #4ade80 !important;
}

.amber-text {
    color: #fbbf24 !important;
}


/* =====================================================
   ALERTS
===================================================== */

.af-alert {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-bottom: 16px;
    padding: 14px 16px;
    border-radius: 13px;
    border: 1px solid;
}

.af-alert > div:nth-child(2) {
    min-width: 0;
    flex: 1;
}

.af-alert strong,
.af-alert span {
    display: block;
}

.af-alert strong {
    margin-bottom: 2px;
    font-size: 13px;
}

.af-alert span {
    font-size: 12px;
}

.af-alert button {
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 20px;
    cursor: pointer;
}

.af-alert-icon {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    flex: 0 0 30px;
    font-weight: 800;
}

.af-alert-error {
    border-color: rgba(248, 113, 113, 0.25);
    background: rgba(127, 29, 29, 0.14);
    color: #fca5a5;
}

.af-alert-error .af-alert-icon {
    background: rgba(239, 68, 68, 0.14);
}

.af-alert-success {
    border-color: rgba(74, 222, 128, 0.22);
    background: rgba(22, 101, 52, 0.12);
    color: #86efac;
}

.af-alert-success .af-alert-icon {
    background: rgba(34, 197, 94, 0.14);
}


/* =====================================================
   MAIN PANEL
===================================================== */

.af-main-card {
    overflow: hidden;
    border: 1px solid rgba(101, 126, 171, 0.18);
    border-radius: 20px;
    background:
        linear-gradient(
            145deg,
            rgba(13, 25, 48, 0.96),
            rgba(8, 17, 32, 0.98)
        );
    box-shadow:
        0 24px 70px rgba(0, 0, 0, 0.25);
}

.af-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 25px 26px 21px;
    border-bottom: 1px solid rgba(101, 126, 171, 0.12);
}

.af-panel-eyebrow {
    margin-bottom: 7px;
    color: #5f7190;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
}

.af-panel-header h2 {
    margin: 0;
    color: #f4f7ff;
    font-size: 20px;
    font-weight: 800;
}

.af-panel-header p {
    margin: 6px 0 0;
    color: #697993;
    font-size: 12px;
}

.af-record-count {
    display: flex;
    align-items: baseline;
    gap: 7px;
    padding: 9px 13px;
    border: 1px solid rgba(91, 123, 177, 0.18);
    border-radius: 11px;
    background: rgba(20, 34, 60, 0.7);
}

.af-record-count strong {
    color: #8bbcff;
    font-size: 16px;
}

.af-record-count span {
    color: #65758f;
    font-size: 11px;
}


/* =====================================================
   TOOLBAR
===================================================== */

.af-toolbar {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 17px 22px;
    border-bottom: 1px solid rgba(101, 126, 171, 0.1);
    background: rgba(8, 16, 31, 0.6);
}

.af-search {
    position: relative;
    flex: 1;
    min-width: 220px;
}

.af-search input {
    width: 100%;
    height: 43px;
    box-sizing: border-box;
    padding: 0 40px 0 41px;
    border: 1px solid rgba(103, 130, 172, 0.2);
    border-radius: 11px;
    outline: none;
    background: rgba(16, 29, 52, 0.85);
    color: #edf3ff;
    font-family: inherit;
    font-size: 13px;
    transition:
        border-color 160ms ease,
        box-shadow 160ms ease;
}

.af-search input::placeholder {
    color: #596981;
}

.af-search input:focus {
    border-color: rgba(77, 144, 255, 0.55);
    box-shadow:
        0 0 0 3px rgba(37, 99, 235, 0.1);
}

.af-search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #71839f;
    font-size: 20px;
    pointer-events: none;
}

.af-clear-search {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 25px;
    height: 25px;
    border: 0;
    border-radius: 7px;
    background: rgba(104, 123, 153, 0.12);
    color: #91a2bc;
    cursor: pointer;
}

.af-filter-group {
    display: flex;
    align-items: center;
    gap: 9px;
}

.af-filter-group > span {
    color: #64738d;
    font-size: 11px;
    font-weight: 700;
}

.af-filter-group select {
    height: 43px;
    min-width: 150px;
    padding: 0 35px 0 13px;
    border: 1px solid rgba(103, 130, 172, 0.2);
    border-radius: 11px;
    outline: none;
    background: #101d34;
    color: #eaf1ff;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}


/* =====================================================
   TABLE
===================================================== */

.af-table-wrap {
    width: 100%;
    overflow-x: auto;
}

.af-table {
    width: 100%;
    min-width: 950px;
    border-collapse: collapse;
}

.af-table th {
    padding: 14px 20px;
    border-bottom: 1px solid rgba(101, 126, 171, 0.12);
    color: #60708a;
    background: rgba(6, 13, 27, 0.5);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-align: left;
    white-space: nowrap;
}

.af-table td {
    padding: 17px 20px;
    border-bottom: 1px solid rgba(101, 126, 171, 0.09);
    vertical-align: middle;
}

.af-table tbody tr {
    transition:
        background 150ms ease;
}

.af-table tbody tr:hover {
    background: rgba(38, 70, 119, 0.12);
}

.af-table tbody tr:last-child td {
    border-bottom: 0;
}


/* =====================================================
   PAYMENT CELL
===================================================== */

.af-payment-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.af-payment-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 11px;
    background:
        linear-gradient(
            135deg,
            #2563eb,
            #673df1
        );
    color: white;
    font-size: 15px;
    font-weight: 800;
    box-shadow:
        0 7px 18px rgba(37, 99, 235, 0.22);
}

.af-payment-id {
    display: block;
    padding: 0;
    border: 0;
    background: transparent;
    color: #dce8ff;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
}

.af-payment-id:hover {
    color: #68a9ff;
}

.af-copy-label {
    display: block;
    margin-top: 4px;
    color: #4f607a;
    font-size: 9px;
}


/* =====================================================
   CUSTOMER
===================================================== */

.af-customer {
    display: flex;
    align-items: center;
    gap: 11px;
}

.af-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 50%;
    background:
        linear-gradient(
            135deg,
            rgba(37, 99, 235, 0.28),
            rgba(124, 58, 237, 0.35)
        );
    color: #9bc6ff;
    font-size: 12px;
    font-weight: 800;
}

.af-customer strong,
.af-customer span {
    display: block;
}

.af-customer strong {
    max-width: 190px;
    overflow: hidden;
    color: #edf3ff;
    font-size: 12px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.af-customer span {
    max-width: 190px;
    margin-top: 3px;
    overflow: hidden;
    color: #60718c;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
}


/* =====================================================
   AMOUNT
===================================================== */

.af-amount strong {
    display: block;
    color: #f3f7ff;
    font-size: 14px;
    font-weight: 800;
    white-space: nowrap;
}

.af-amount span {
    display: block;
    margin-top: 4px;
    color: #566780;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
}


/* =====================================================
   STATUS
===================================================== */

.af-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 10px;
    border: 1px solid;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.04em;
    white-space: nowrap;
}

.af-status > span {
    font-size: 12px;
}

.af-status-success {
    border-color: rgba(34, 197, 94, 0.25);
    background: rgba(34, 197, 94, 0.09);
    color: #4ade80;
}

.af-status-processing {
    border-color: rgba(96, 165, 250, 0.25);
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
}

.af-status-warning {
    border-color: rgba(245, 158, 11, 0.28);
    background: rgba(245, 158, 11, 0.1);
    color: #fbbf24;
}

.af-status-danger {
    border-color: rgba(248, 113, 113, 0.25);
    background: rgba(239, 68, 68, 0.09);
    color: #f87171;
}

.af-status-neutral {
    border-color: rgba(148, 163, 184, 0.2);
    background: rgba(148, 163, 184, 0.08);
    color: #94a3b8;
}


/* =====================================================
   ACTIONS
===================================================== */

.af-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    min-width: 170px;
}

.af-action-button {
    min-height: 31px;
    padding: 0 10px;
    border: 1px solid;
    border-radius: 8px;
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition:
        transform 140ms ease,
        background 140ms ease;
}

.af-action-button:hover:not(:disabled) {
    transform: translateY(-1px);
}

.af-action-button:disabled,
.af-delete-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.af-action-primary {
    border-color: rgba(96, 165, 250, 0.3);
    background: rgba(37, 99, 235, 0.12);
    color: #72b1ff;
}

.af-action-success {
    border-color: rgba(74, 222, 128, 0.25);
    background: rgba(34, 197, 94, 0.1);
    color: #4ade80;
}

.af-action-danger {
    border-color: rgba(248, 113, 113, 0.25);
    background: rgba(239, 68, 68, 0.1);
    color: #f87171;
}

.af-delete-button {
    width: 31px;
    height: 31px;
    border: 1px solid rgba(248, 113, 113, 0.18);
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.06);
    color: #f87171;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
}


/* =====================================================
   EMPTY STATE
===================================================== */

.af-empty {
    padding: 70px 30px;
    text-align: center;
}

.af-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    margin: 0 auto 16px;
    border: 1px solid rgba(96, 165, 250, 0.18);
    border-radius: 16px;
    background: rgba(37, 99, 235, 0.09);
    color: #70adff;
    font-size: 25px;
}

.af-empty h3 {
    margin: 0;
    color: #e8eef9;
    font-size: 17px;
}

.af-empty p {
    margin: 7px 0 18px;
    color: #65758f;
    font-size: 12px;
}

.af-empty button {
    height: 36px;
    padding: 0 15px;
    border: 1px solid rgba(96, 165, 250, 0.25);
    border-radius: 9px;
    background: rgba(37, 99, 235, 0.1);
    color: #78b5ff;
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
}


/* =====================================================
   FOOTER
===================================================== */

.af-footer-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 17px;
    padding: 16px 4px;
}

.af-footer-security {
    display: flex;
    align-items: center;
    gap: 10px;
}

.af-footer-security > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 29px;
    height: 29px;
    border-radius: 9px;
    background: rgba(34, 197, 94, 0.1);
    color: #4ade80;
    font-size: 13px;
}

.af-footer-security strong,
.af-footer-security small {
    display: block;
}

.af-footer-security strong {
    color: #8291a9;
    font-size: 10px;
}

.af-footer-security small {
    margin-top: 3px;
    color: #4f5e75;
    font-size: 9px;
}

.af-footer-metrics {
    display: flex;
    align-items: center;
    gap: 14px;
    color: #5d6d86;
    font-size: 10px;
    font-weight: 600;
}


/* =====================================================
   LOADING
===================================================== */

.af-loading-page {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: #e8eef9;
}

.af-loading-page strong,
.af-loading-page span {
    display: block;
}

.af-loading-page strong {
    font-size: 14px;
}

.af-loading-page span {
    margin-top: 4px;
    color: #65758f;
    font-size: 11px;
}

.af-loading-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(96, 165, 250, 0.15);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: af-spin 0.8s linear infinite;
}


/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1200px) {

    .af-page {
        padding: 34px 30px 50px;
    }

    .af-stat-grid {
        grid-template-columns:
            repeat(2, minmax(0, 1fr));
    }

}


@media (max-width: 760px) {

    .af-page {
        padding: 25px 16px 40px;
    }

    .af-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .af-refresh-button {
        width: 100%;
    }

    .af-stat-grid {
        grid-template-columns: 1fr;
    }

    .af-panel-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .af-toolbar {
        align-items: stretch;
        flex-direction: column;
    }

    .af-search {
        width: 100%;
    }

    .af-filter-group {
        justify-content: space-between;
    }

    .af-filter-group select {
        flex: 1;
    }

    .af-footer-info {
        align-items: flex-start;
        flex-direction: column;
    }

}

`;


export default AdminPayments;