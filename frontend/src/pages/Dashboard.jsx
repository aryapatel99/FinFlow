import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    changeMyPassword,
    createPayment,
    deleteAdminPayment,
    deletePayment,
    deleteUser,
    getAdminPayments,
    getAdminUsers,
    getMyProfile,
    getPayments,
    updateAdminPaymentStatus,
    updateUserRole,
} from "../services/api";

import { useAuth } from "../context/AuthContext";


// ============================================================
// Helpers
// ============================================================

function formatCurrency(amount, currency = "INR") {
    const value = Number(amount || 0);

    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return `${currency} ${value.toFixed(2)}`;
    }
}


function formatDate(value) {
    if (!value) {
        return "-";
    }

    try {
        return new Date(value).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    } catch {
        return value;
    }
}


function formatDateTime(value) {
    if (!value) {
        return "-";
    }

    try {
        return new Date(value).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    } catch {
        return value;
    }
}


function getStatusClass(status) {
    const normalized =
        String(status || "")
            .toUpperCase();

    if (normalized === "COMPLETED") {
        return "dashboard-status dashboard-status-success";
    }

    if (normalized === "FAILED") {
        return "dashboard-status dashboard-status-danger";
    }

    if (
        normalized === "PROCESSING" ||
        normalized === "PENDING"
    ) {
        return "dashboard-status dashboard-status-warning";
    }

    return "dashboard-status";
}


function getStatusLabel(status) {
    if (!status) {
        return "UNKNOWN";
    }

    return String(status).replace(
        /_/g,
        " "
    );
}


// ============================================================
// Small Components
// ============================================================

function StatCard({
    title,
    value,
    subtitle,
    icon,
}) {
    return (
        <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
                {icon}
            </div>

            <div className="dashboard-stat-content">

                <div className="dashboard-stat-title">
                    {title}
                </div>

                <div className="dashboard-stat-value">
                    {value}
                </div>

                {subtitle && (
                    <div className="dashboard-stat-subtitle">
                        {subtitle}
                    </div>
                )}

            </div>

        </div>
    );
}


function SectionTitle({
    title,
    description,
}) {
    return (
        <div className="dashboard-section-title">

            <div>
                <h2>{title}</h2>

                {description && (
                    <p>
                        {description}
                    </p>
                )}
            </div>

        </div>
    );
}


function EmptyState({
    title,
    description,
}) {
    return (
        <div className="dashboard-empty">

            <div className="dashboard-empty-icon">
                ◌
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

        </div>
    );
}


// ============================================================
// Payment Table
// ============================================================

function PaymentTable({
    payments,
    admin,
    onDelete,
    onStatusChange,
}) {
    if (!payments || payments.length === 0) {
        return (
            <EmptyState
                title="No payments found"
                description={
                    admin
                        ? "There are currently no payments in the system."
                        : "You have not created any payments yet."
                }
            />
        );
    }

    return (
        <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

                <thead>

                    <tr>

                        <th>
                            Payment
                        </th>

                        {admin && (
                            <th>
                                Customer
                            </th>
                        )}

                        <th>
                            Amount
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Date
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {payments.map((payment) => (

                        <tr
                            key={
                                payment.payment_id
                            }
                        >

                            <td>

                                <div className="dashboard-payment-id">
                                    {payment.payment_id}
                                </div>

                                {payment.description && (
                                    <div className="dashboard-payment-description">
                                        {payment.description}
                                    </div>
                                )}

                            </td>


                            {admin && (
                                <td>

                                    <div>
                                        {payment.customer_name || "-"}
                                    </div>

                                    <div className="dashboard-payment-description">
                                        {payment.email || payment.user_email || "-"}
                                    </div>

                                </td>
                            )}


                            <td className="dashboard-money">

                                {formatCurrency(
                                    payment.amount,
                                    payment.currency
                                )}

                            </td>


                            <td>

                                <span
                                    className={getStatusClass(
                                        payment.status
                                    )}
                                >
                                    {getStatusLabel(
                                        payment.status
                                    )}
                                </span>

                            </td>


                            <td>
                                {formatDate(
                                    payment.created_at
                                )}
                            </td>


                            <td>

                                <div className="dashboard-action-group">

                                    {admin && (
                                        <select
                                            className="dashboard-select dashboard-small-select"
                                            value={
                                                payment.status || "PENDING"
                                            }
                                            onChange={(event) =>
                                                onStatusChange(
                                                    payment.payment_id,
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="PENDING">
                                                PENDING
                                            </option>

                                            <option value="PROCESSING">
                                                PROCESSING
                                            </option>

                                            <option value="COMPLETED">
                                                COMPLETED
                                            </option>

                                            <option value="FAILED">
                                                FAILED
                                            </option>

                                        </select>
                                    )}


                                    <button
                                        className="dashboard-danger-button"
                                        onClick={() =>
                                            onDelete(
                                                payment.payment_id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}


// ============================================================
// Billing Chart
// ============================================================

function BillingChart({
    payments,
}) {
    const monthlyData = useMemo(() => {

        const months = [];

        const now = new Date();

        for (
            let index = 5;
            index >= 0;
            index--
        ) {

            const date = new Date(
                now.getFullYear(),
                now.getMonth() - index,
                1
            );

            months.push({
                key:
                    `${date.getFullYear()}-${date.getMonth()}`,
                label:
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            month: "short",
                        }
                    ),
                value: 0,
            });
        }


        payments.forEach((payment) => {

            if (
                String(payment.status || "")
                    .toUpperCase() !== "COMPLETED"
            ) {
                return;
            }

            if (!payment.created_at) {
                return;
            }

            const date =
                new Date(payment.created_at);

            const key =
                `${date.getFullYear()}-${date.getMonth()}`;

            const month =
                months.find(
                    (item) =>
                        item.key === key
                );

            if (month) {
                month.value += Number(
                    payment.amount || 0
                );
            }

        });

        return months;

    }, [payments]);


    const maxValue =
        Math.max(
            ...monthlyData.map(
                (item) => item.value
            ),
            1
        );


    return (
        <div className="dashboard-chart-card">

            <div className="dashboard-chart-header">

                <div>
                    <h3>
                        Monthly Billing
                    </h3>

                    <p>
                        Completed payment volume
                    </p>
                </div>

            </div>


            <div className="dashboard-chart">

                {monthlyData.map((item) => {

                    const height =
                        Math.max(
                            (item.value / maxValue) * 100,
                            item.value > 0
                                ? 8
                                : 2
                        );

                    return (
                        <div
                            className="dashboard-chart-column"
                            key={item.key}
                        >

                            <div className="dashboard-chart-value">
                                {item.value > 0
                                    ? formatCurrency(
                                        item.value,
                                        "INR"
                                    )
                                    : ""}
                            </div>

                            <div className="dashboard-chart-bar-area">

                                <div
                                    className="dashboard-chart-bar"
                                    style={{
                                        height:
                                            `${height}%`,
                                    }}
                                />

                            </div>

                            <div className="dashboard-chart-label">
                                {item.label}
                            </div>

                        </div>
                    );

                })}

            </div>

        </div>
    );
}


// ============================================================
// Payment Distribution
// ============================================================

function PaymentDistribution({
    payments,
}) {
    const statistics = useMemo(() => {

        const result = {
            COMPLETED: 0,
            PROCESSING: 0,
            PENDING: 0,
            FAILED: 0,
        };

        payments.forEach((payment) => {

            const status =
                String(
                    payment.status || ""
                ).toUpperCase();

            if (
                Object.prototype.hasOwnProperty
                    .call(result, status)
            ) {
                result[status] += 1;
            }

        });

        return result;

    }, [payments]);


    const total =
        payments.length || 1;


    return (
        <div className="dashboard-chart-card">

            <div className="dashboard-chart-header">

                <div>
                    <h3>
                        Payment Status
                    </h3>

                    <p>
                        Current transaction distribution
                    </p>
                </div>

            </div>


            <div className="dashboard-distribution">

                {Object.entries(statistics).map(
                    ([status, count]) => {

                        const percentage =
                            Math.round(
                                (count / total) * 100
                            );

                        return (
                            <div
                                className="dashboard-distribution-row"
                                key={status}
                            >

                                <div className="dashboard-distribution-info">

                                    <span
                                        className={
                                            getStatusClass(
                                                status
                                            )
                                        }
                                    >
                                        {getStatusLabel(
                                            status
                                        )}
                                    </span>

                                    <strong>
                                        {count}
                                    </strong>

                                </div>

                                <div className="dashboard-progress">

                                    <div
                                        className="dashboard-progress-bar"
                                        style={{
                                            width:
                                                `${percentage}%`,
                                        }}
                                    />

                                </div>

                                <span className="dashboard-percentage">
                                    {percentage}%
                                </span>

                            </div>
                        );

                    }
                )}

            </div>

        </div>
    );
}


// ============================================================
// Dashboard
// ============================================================

export default function Dashboard() {

    const {
        user,
        logout,
    } = useAuth();


    const [activeSection, setActiveSection] =
        useState("overview");


    const [profile, setProfile] =
        useState(null);


    const [payments, setPayments] =
        useState([]);


    const [adminUsers, setAdminUsers] =
        useState([]);


    const [adminPayments, setAdminPayments] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    const [message, setMessage] =
        useState("");


    const [showPaymentForm, setShowPaymentForm] =
        useState(false);


    const [paymentForm, setPaymentForm] =
        useState({
            customer_name: "",
            email: "",
            amount: "",
            currency: "INR",
            description: "",
        });


    const [passwordForm, setPasswordForm] =
        useState({
            current_password: "",
            new_password: "",
        });


    const [passwordLoading, setPasswordLoading] =
        useState(false);


    const [paymentLoading, setPaymentLoading] =
        useState(false);


    const [actionLoading, setActionLoading] =
        useState(false);


    // ========================================================
    // Data Loading
    // ========================================================

    const loadCustomerData =
        async () => {

            try {

                const [
                    profileData,
                    paymentData,
                ] = await Promise.all([
                    getMyProfile(),
                    getPayments(),
                ]);

                setProfile(
                    profileData
                );

                setPayments(
                    Array.isArray(paymentData)
                        ? paymentData
                        : []
                );

            } catch (err) {

                console.error(err);

                setError(
                    err?.response?.data?.detail ||
                    "Unable to load dashboard data."
                );

            }
        };


    const loadAdminData =
        async () => {

            try {

                const [
                    usersData,
                    paymentsData,
                ] = await Promise.all([
                    getAdminUsers(),
                    getAdminPayments(),
                ]);

                setAdminUsers(
                    Array.isArray(usersData)
                        ? usersData
                        : []
                );

                setAdminPayments(
                    Array.isArray(paymentsData)
                        ? paymentsData
                        : []
                );

            } catch (err) {

                console.error(err);

                setError(
                    err?.response?.data?.detail ||
                    "Unable to load admin data."
                );
            }
        };


    const loadDashboard =
        async () => {

            setLoading(true);
            setError("");

            await loadCustomerData();

            if (
                user?.role === "admin"
            ) {
                await loadAdminData();
            }

            setLoading(false);
        };


    useEffect(() => {

        loadDashboard();

    }, []);


    // ========================================================
    // Derived Data
    // ========================================================

    const customerPayments =
        payments;


    const visiblePayments =
        user?.role === "admin"
            ? adminPayments
            : customerPayments;


    const completedPayments =
        visiblePayments.filter(
            (payment) =>
                String(payment.status || "")
                    .toUpperCase() === "COMPLETED"
        );


    const pendingPayments =
        visiblePayments.filter(
            (payment) =>
                [
                    "PENDING",
                    "PROCESSING",
                ].includes(
                    String(payment.status || "")
                        .toUpperCase()
                )
        );


    const failedPayments =
        visiblePayments.filter(
            (payment) =>
                String(payment.status || "")
                    .toUpperCase() === "FAILED"
        );


    const totalBilling =
        completedPayments.reduce(
            (sum, payment) =>
                sum +
                Number(
                    payment.amount || 0
                ),
            0
        );


    const totalPaymentCount =
        visiblePayments.length;


    const customerCount =
        adminUsers.filter(
            (item) =>
                item.role === "customer"
        ).length;


    const adminCount =
        adminUsers.filter(
            (item) =>
                item.role === "admin"
        ).length;


    const recentPayments =
        [...visiblePayments]
            .sort(
                (a, b) =>
                    new Date(
                        b.created_at || 0
                    ) -
                    new Date(
                        a.created_at || 0
                    )
            )
            .slice(0, 8);


    // ========================================================
    // Create Payment
    // ========================================================

    const handleCreatePayment =
        async (event) => {

            event.preventDefault();

            setPaymentLoading(true);
            setError("");
            setMessage("");

            try {

                await createPayment({
                    customer_name:
                        paymentForm.customer_name,
                    email:
                        paymentForm.email,
                    amount:
                        Number(
                            paymentForm.amount
                        ),
                    currency:
                        paymentForm.currency,
                    description:
                        paymentForm.description,
                });

                setMessage(
                    "Payment created successfully."
                );

                setPaymentForm({
                    customer_name: "",
                    email: "",
                    amount: "",
                    currency: "INR",
                    description: "",
                });

                setShowPaymentForm(false);

                await loadCustomerData();

                setActiveSection(
                    "payments"
                );

            } catch (err) {

                setError(
                    err?.response?.data?.detail ||
                    "Unable to create payment."
                );

            } finally {

                setPaymentLoading(false);
            }
        };


    // ========================================================
    // Delete Customer Payment
    // ========================================================

    const handleDeleteCustomerPayment =
        async (paymentId) => {

            const confirmed =
                window.confirm(
                    "Delete this payment?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setActionLoading(true);

                await deletePayment(
                    paymentId
                );

                setMessage(
                    "Payment deleted successfully."
                );

                await loadCustomerData();

            } catch (err) {

                setError(
                    err?.response?.data?.detail ||
                    "Unable to delete payment."
                );

            } finally {

                setActionLoading(false);
            }
        };


    // ========================================================
    // Admin Delete Payment
    // ========================================================

    const handleDeleteAdminPayment =
        async (paymentId) => {

            const confirmed =
                window.confirm(
                    "Admin action: permanently delete this payment?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setActionLoading(true);

                await deleteAdminPayment(
                    paymentId
                );

                setMessage(
                    "Payment deleted successfully."
                );

                await loadAdminData();

            } catch (err) {

                setError(
                    err?.response?.data?.detail ||
                    "Unable to delete payment."
                );

            } finally {

                setActionLoading(false);
            }
        };


    // ========================================================
    // Admin Payment Status
    // ========================================================

    const handleAdminStatusChange =
        async (
            paymentId,
            status
        ) => {

            try {

                setActionLoading(true);

                await updateAdminPaymentStatus(
                    paymentId,
                    status
                );

                setMessage(
                    "Payment status updated successfully."
                );

                await loadAdminData();

            } catch (err) {

                setError(
                    err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to update payment status."
                );

            } finally {

                setActionLoading(false);
            }
        };


    // ========================================================
    // Admin User Role
    // ========================================================

    const handleRoleChange =
        async (
            email,
            role
        ) => {

            try {

                setActionLoading(true);

                await updateUserRole(
                    email,
                    role
                );

                setMessage(
                    "User role updated successfully."
                );

                await loadAdminData();

            } catch (err) {

                setError(
                    err?.response?.data?.detail ||
                    "Unable to update user role."
                );

            } finally {

                setActionLoading(false);
            }
        };


    // ========================================================
    // Admin Delete User
    // ========================================================

    const handleDeleteUser =
        async (email) => {

            const confirmed =
                window.confirm(
                    `Delete user ${email}? This action cannot be undone.`
                );

            if (!confirmed) {
                return;
            }

            try {

                setActionLoading(true);

                await deleteUser(
                    email
                );

                setMessage(
                    "User deleted successfully."
                );

                await loadAdminData();

            } catch (err) {

                setError(
                    err?.response?.data?.detail ||
                    "Unable to delete user."
                );

            } finally {

                setActionLoading(false);
            }
        };


    // ========================================================
    // Change Password
    // ========================================================

    const handleChangePassword =
        async (event) => {

            event.preventDefault();

            if (
                passwordForm.new_password.length < 8
            ) {
                setError(
                    "New password must contain at least 8 characters."
                );

                return;
            }

            setPasswordLoading(true);
            setError("");
            setMessage("");

            try {

                await changeMyPassword(
                    passwordForm.current_password,
                    passwordForm.new_password
                );

                setPasswordForm({
                    current_password: "",
                    new_password: "",
                });

                setMessage(
                    "Password changed successfully."
                );

            } catch (err) {

                setError(
                    err?.response?.data?.detail ||
                    "Unable to change password."
                );

            } finally {

                setPasswordLoading(false);
            }
        };


    // ========================================================
    // Navigation
    // ========================================================

    const navigationItems = [
        {
            id: "overview",
            label: "Overview",
            icon: "⌂",
        },
        {
            id: "payments",
            label: "Payments",
            icon: "↔",
        },
        {
            id: "billing",
            label: "Billing & Analytics",
            icon: "▥",
        },
        {
            id: "profile",
            label: "Profile",
            icon: "◎",
        },
        {
            id: "security",
            label: "Security",
            icon: "◆",
        },
    ];


    if (user?.role === "admin") {

        navigationItems.push({
            id: "users",
            label: "User Management",
            icon: "♙",
        });

        navigationItems.push({
            id: "admin-payments",
            label: "Payment Management",
            icon: "▣",
        });
    }


    // ========================================================
    // Loading
    // ========================================================

    if (loading) {

        return (
            <div className="dashboard-loading">

                <div className="dashboard-loading-spinner">
                    ◌
                </div>

                <h2>
                    Loading FinFlow
                </h2>

                <p>
                    Preparing your financial dashboard...
                </p>

            </div>
        );
    }


    // ========================================================
    // Render
    // ========================================================

    return (
        <div className="dashboard-shell">

            {/* =================================================
                Sidebar
            ================================================= */}

            <aside className="dashboard-sidebar">

                <div className="dashboard-brand">

                    <div className="dashboard-brand-mark">
                        F
                    </div>

                    <div>
                        <div className="dashboard-brand-name">
                            FinFlow
                        </div>

                        <div className="dashboard-brand-subtitle">
                            Payment Platform
                        </div>
                    </div>

                </div>


                <div className="dashboard-user-mini">

                    <div className="dashboard-avatar">
                        {(
                            profile?.full_name ||
                            user?.email ||
                            "U"
                        )
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="dashboard-user-mini-info">

                        <strong>
                            {
                                profile?.full_name ||
                                user?.email ||
                                "User"
                            }
                        </strong>

                        <span>
                            {
                                user?.role === "admin"
                                    ? "Administrator"
                                    : "Customer"
                            }
                        </span>

                    </div>

                </div>


                <nav className="dashboard-navigation">

                    <div className="dashboard-nav-label">
                        WORKSPACE
                    </div>

                    {navigationItems.map(
                        (item) => (

                            <button
                                key={item.id}
                                className={
                                    activeSection === item.id
                                        ? "dashboard-nav-item dashboard-nav-item-active"
                                        : "dashboard-nav-item"
                                }
                                onClick={() =>
                                    setActiveSection(
                                        item.id
                                    )
                                }
                            >

                                <span className="dashboard-nav-icon">
                                    {item.icon}
                                </span>

                                <span>
                                    {item.label}
                                </span>

                            </button>

                        )
                    )}

                </nav>


                <div className="dashboard-sidebar-bottom">

                    <button
                        className="dashboard-logout-button"
                        onClick={logout}
                    >
                        <span>
                            ↪
                        </span>

                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                Main
            ================================================= */}

            <main className="dashboard-main">

                {/* =================================================
                    Header
                ================================================= */}

                <header className="dashboard-header">

                    <div>

                        <div className="dashboard-header-eyebrow">
                            FINFLOW WORKSPACE
                        </div>

                        <h1>
                            {activeSection === "overview" &&
                                "Good to see you again."}

                            {activeSection === "payments" &&
                                "Payments"}

                            {activeSection === "billing" &&
                                "Billing & Analytics"}

                            {activeSection === "profile" &&
                                "Your Profile"}

                            {activeSection === "security" &&
                                "Security"}

                            {activeSection === "users" &&
                                "User Management"}

                            {activeSection === "admin-payments" &&
                                "Payment Management"}
                        </h1>

                    </div>


                    <div className="dashboard-header-actions">

                        <div className="dashboard-online-indicator">
                            <span />
                            System Online
                        </div>

                        <div className="dashboard-header-avatar">
                            {(
                                profile?.full_name ||
                                user?.email ||
                                "U"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                    </div>

                </header>


                {/* =================================================
                    Alerts
                ================================================= */}

                {error && (

                    <div className="dashboard-alert dashboard-alert-error">

                        <strong>
                            Error
                        </strong>

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {message && (

                    <div className="dashboard-alert dashboard-alert-success">

                        <strong>
                            Success
                        </strong>

                        <span>
                            {message}
                        </span>

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    Overview
                ================================================= */}

                {activeSection === "overview" && (

                    <div className="dashboard-content">

                        <div className="dashboard-welcome-card">

                            <div>

                                <div className="dashboard-welcome-label">
                                    {user?.role === "admin"
                                        ? "ADMINISTRATOR"
                                        : "CUSTOMER ACCOUNT"}
                                </div>

                                <h2>
                                    Welcome,{" "}
                                    {
                                        profile?.full_name ||
                                        user?.email ||
                                        "User"
                                    }
                                </h2>

                                <p>
                                    Manage your payments,
                                    billing and account
                                    from one workspace.
                                </p>

                            </div>

                            <button
                                className="dashboard-primary-button"
                                onClick={() =>
                                    setShowPaymentForm(
                                        true
                                    )
                                }
                            >
                                + Create Payment
                            </button>

                        </div>


                        <div className="dashboard-stat-grid">

                            <StatCard
                                title="Total Payments"
                                value={
                                    totalPaymentCount
                                }
                                subtitle="Transactions"
                                icon="↔"
                            />

                            <StatCard
                                title="Completed"
                                value={
                                    completedPayments.length
                                }
                                subtitle="Successful payments"
                                icon="✓"
                            />

                            <StatCard
                                title="Pending"
                                value={
                                    pendingPayments.length
                                }
                                subtitle="Awaiting completion"
                                icon="◷"
                            />

                            <StatCard
                                title="Total Billing"
                                value={
                                    formatCurrency(
                                        totalBilling,
                                        "INR"
                                    )
                                }
                                subtitle="Completed payments"
                                icon="₹"
                            />

                        </div>


                        {user?.role === "admin" && (

                            <div className="dashboard-stat-grid dashboard-admin-stats">

                                <StatCard
                                    title="Total Users"
                                    value={
                                        adminUsers.length
                                    }
                                    subtitle="Registered accounts"
                                    icon="♙"
                                />

                                <StatCard
                                    title="Customers"
                                    value={
                                        customerCount
                                    }
                                    subtitle="Customer accounts"
                                    icon="◎"
                                />

                                <StatCard
                                    title="Administrators"
                                    value={
                                        adminCount
                                    }
                                    subtitle="Admin accounts"
                                    icon="◆"
                                />

                                <StatCard
                                    title="Failed Payments"
                                    value={
                                        failedPayments.length
                                    }
                                    subtitle="Requires attention"
                                    icon="!"
                                />

                            </div>

                        )}


                        <div className="dashboard-two-column">

                            <BillingChart
                                payments={
                                    visiblePayments
                                }
                            />

                            <PaymentDistribution
                                payments={
                                    visiblePayments
                                }
                            />

                        </div>


                        <div className="dashboard-panel">

                            <SectionTitle
                                title="Recent Payments"
                                description="Your latest transactions"
                            />

                            <PaymentTable
                                payments={
                                    recentPayments
                                }
                                admin={false}
                                onDelete={
                                    handleDeleteCustomerPayment
                                }
                                onStatusChange={
                                    handleAdminStatusChange
                                }
                            />

                        </div>

                    </div>

                )}


                {/* =================================================
                    Payments
                ================================================= */}

                {activeSection === "payments" && (

                    <div className="dashboard-content">

                        <div className="dashboard-page-actions">

                            <div>

                                <SectionTitle
                                    title="Your Payments"
                                    description="View and manage your payment transactions."
                                />

                            </div>

                            <button
                                className="dashboard-primary-button"
                                onClick={() =>
                                    setShowPaymentForm(
                                        true
                                    )
                                }
                            >
                                + New Payment
                            </button>

                        </div>


                        <div className="dashboard-stat-grid">

                            <StatCard
                                title="All"
                                value={
                                    customerPayments.length
                                }
                                subtitle="Your payments"
                                icon="↔"
                            />

                            <StatCard
                                title="Completed"
                                value={
                                    customerPayments.filter(
                                        (item) =>
                                            item.status ===
                                            "COMPLETED"
                                    ).length
                                }
                                subtitle="Successful"
                                icon="✓"
                            />

                            <StatCard
                                title="Processing"
                                value={
                                    customerPayments.filter(
                                        (item) =>
                                            [
                                                "PENDING",
                                                "PROCESSING",
                                            ].includes(
                                                item.status
                                            )
                                    ).length
                                }
                                subtitle="In progress"
                                icon="◷"
                            />

                            <StatCard
                                title="Failed"
                                value={
                                    customerPayments.filter(
                                        (item) =>
                                            item.status ===
                                            "FAILED"
                                    ).length
                                }
                                subtitle="Failed payments"
                                icon="!"
                            />

                        </div>


                        <div className="dashboard-panel">

                            <PaymentTable
                                payments={
                                    customerPayments
                                }
                                admin={false}
                                onDelete={
                                    handleDeleteCustomerPayment
                                }
                                onStatusChange={
                                    handleAdminStatusChange
                                }
                            />

                        </div>

                    </div>

                )}


                {/* =================================================
                    Billing
                ================================================= */}

                {activeSection === "billing" && (

                    <div className="dashboard-content">

                        <SectionTitle
                            title="Billing & Analytics"
                            description="Understand your payment activity and financial flow."
                        />


                        <div className="dashboard-stat-grid">

                            <StatCard
                                title="Total Billing"
                                value={
                                    formatCurrency(
                                        totalBilling,
                                        "INR"
                                    )
                                }
                                subtitle="Completed transactions"
                                icon="₹"
                            />

                            <StatCard
                                title="Average Payment"
                                value={
                                    formatCurrency(
                                        completedPayments.length
                                            ? totalBilling /
                                              completedPayments.length
                                            : 0,
                                        "INR"
                                    )
                                }
                                subtitle="Per completed payment"
                                icon="≈"
                            />

                            <StatCard
                                title="Successful Rate"
                                value={
                                    totalPaymentCount
                                        ? `${Math.round(
                                            (completedPayments.length /
                                                totalPaymentCount) *
                                                100
                                        )}%`
                                        : "0%"
                                }
                                subtitle="Payment success rate"
                                icon="%"
                            />

                            <StatCard
                                title="Failed Amount"
                                value={
                                    formatCurrency(
                                        failedPayments.reduce(
                                            (
                                                sum,
                                                payment
                                            ) =>
                                                sum +
                                                Number(
                                                    payment.amount ||
                                                    0
                                                ),
                                            0
                                        ),
                                        "INR"
                                    )
                                }
                                subtitle="Failed transaction value"
                                icon="!"
                            />

                        </div>


                        <div className="dashboard-two-column">

                            <BillingChart
                                payments={
                                    visiblePayments
                                }
                            />

                            <PaymentDistribution
                                payments={
                                    visiblePayments
                                }
                            />

                        </div>


                        <div className="dashboard-panel">

                            <SectionTitle
                                title="Billing History"
                                description="Completed and recent financial activity."
                            />

                            <PaymentTable
                                payments={
                                    [...visiblePayments]
                                        .sort(
                                            (a, b) =>
                                                new Date(
                                                    b.created_at ||
                                                    0
                                                ) -
                                                new Date(
                                                    a.created_at ||
                                                    0
                                                )
                                        )
                                }
                                admin={
                                    user?.role ===
                                    "admin"
                                }
                                onDelete={
                                    user?.role ===
                                    "admin"
                                        ? handleDeleteAdminPayment
                                        : handleDeleteCustomerPayment
                                }
                                onStatusChange={
                                    handleAdminStatusChange
                                }
                            />

                        </div>

                    </div>

                )}


                {/* =================================================
                    Profile
                ================================================= */}

                {activeSection === "profile" && (

                    <div className="dashboard-content">

                        <SectionTitle
                            title="Profile"
                            description="Your FinFlow account information."
                        />


                        <div className="dashboard-profile-card">

                            <div className="dashboard-profile-header">

                                <div className="dashboard-profile-avatar">
                                    {(
                                        profile?.full_name ||
                                        user?.email ||
                                        "U"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <h2>
                                        {
                                            profile?.full_name ||
                                            "User"
                                        }
                                    </h2>

                                    <span
                                        className="dashboard-role-badge"
                                    >
                                        {
                                            profile?.role ||
                                            user?.role
                                        }
                                    </span>

                                </div>

                            </div>


                            <div className="dashboard-profile-grid">

                                <div className="dashboard-profile-field">

                                    <span>
                                        Full Name
                                    </span>

                                    <strong>
                                        {
                                            profile?.full_name ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div className="dashboard-profile-field">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            profile?.email ||
                                            user?.email ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div className="dashboard-profile-field">

                                    <span>
                                        User ID
                                    </span>

                                    <strong className="dashboard-monospace">
                                        {
                                            profile?.user_id ||
                                            user?.user_id ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div className="dashboard-profile-field">

                                    <span>
                                        Role
                                    </span>

                                    <strong>
                                        {
                                            profile?.role ||
                                            user?.role ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div className="dashboard-profile-field">

                                    <span>
                                        Account Created
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                profile?.created_at
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    Security
                ================================================= */}

                {activeSection === "security" && (

                    <div className="dashboard-content">

                        <SectionTitle
                            title="Security"
                            description="Protect your FinFlow account."
                        />


                        <div className="dashboard-security-card">

                            <div className="dashboard-security-icon">
                                ◆
                            </div>

                            <div>

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Update your password
                                    regularly to keep
                                    your account secure.
                                </p>

                            </div>

                        </div>


                        <form
                            className="dashboard-form-card"
                            onSubmit={
                                handleChangePassword
                            }
                        >

                            <div className="dashboard-form-group">

                                <label>
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    value={
                                        passwordForm.current_password
                                    }
                                    onChange={(event) =>
                                        setPasswordForm({
                                            ...passwordForm,
                                            current_password:
                                                event.target.value,
                                        })
                                    }
                                    required
                                />

                            </div>


                            <div className="dashboard-form-group">

                                <label>
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    value={
                                        passwordForm.new_password
                                    }
                                    onChange={(event) =>
                                        setPasswordForm({
                                            ...passwordForm,
                                            new_password:
                                                event.target.value,
                                        })
                                    }
                                    minLength={8}
                                    required
                                />

                                <small>
                                    Minimum 8 characters.
                                </small>

                            </div>


                            <button
                                className="dashboard-primary-button"
                                type="submit"
                                disabled={
                                    passwordLoading
                                }
                            >
                                {passwordLoading
                                    ? "Updating..."
                                    : "Change Password"}
                            </button>

                        </form>

                    </div>

                )}


                {/* =================================================
                    Admin Users
                ================================================= */}

                {activeSection === "users" &&
                    user?.role === "admin" && (

                        <div className="dashboard-content">

                            <SectionTitle
                                title="User Management"
                                description="Manage every FinFlow user account and role."
                            />


                            <div className="dashboard-stat-grid">

                                <StatCard
                                    title="Total Users"
                                    value={
                                        adminUsers.length
                                    }
                                    subtitle="All accounts"
                                    icon="♙"
                                />

                                <StatCard
                                    title="Customers"
                                    value={
                                        customerCount
                                    }
                                    subtitle="Customer accounts"
                                    icon="◎"
                                />

                                <StatCard
                                    title="Admins"
                                    value={
                                        adminCount
                                    }
                                    subtitle="Administrator accounts"
                                    icon="◆"
                                />

                            </div>


                            <div className="dashboard-panel">

                                {adminUsers.length === 0 ? (

                                    <EmptyState
                                        title="No users found"
                                        description="No user accounts are currently available."
                                    />

                                ) : (

                                    <div className="dashboard-table-wrapper">

                                        <table className="dashboard-table">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        User
                                                    </th>

                                                    <th>
                                                        User ID
                                                    </th>

                                                    <th>
                                                        Role
                                                    </th>

                                                    <th>
                                                        Created
                                                    </th>

                                                    <th>
                                                        Actions
                                                    </th>

                                                </tr>

                                            </thead>

                                            <tbody>

                                                {adminUsers.map(
                                                    (item) => (

                                                        <tr
                                                            key={
                                                                item.email
                                                            }
                                                        >

                                                            <td>

                                                                <strong>
                                                                    {
                                                                        item.full_name
                                                                    }
                                                                </strong>

                                                                <div className="dashboard-payment-description">
                                                                    {
                                                                        item.email
                                                                    }
                                                                </div>

                                                            </td>


                                                            <td className="dashboard-monospace">
                                                                {
                                                                    item.user_id
                                                                }
                                                            </td>


                                                            <td>

                                                                <span className="dashboard-role-badge">
                                                                    {
                                                                        item.role
                                                                    }
                                                                </span>

                                                            </td>


                                                            <td>
                                                                {
                                                                    formatDate(
                                                                        item.created_at
                                                                    )
                                                                }
                                                            </td>


                                                            <td>

                                                                <div className="dashboard-action-group">

                                                                    <select
                                                                        className="dashboard-select"
                                                                        value={
                                                                            item.role
                                                                        }
                                                                        disabled={
                                                                            actionLoading
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            handleRoleChange(
                                                                                item.email,
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                    >

                                                                        <option value="customer">
                                                                            Customer
                                                                        </option>

                                                                        <option value="admin">
                                                                            Admin
                                                                        </option>

                                                                    </select>


                                                                    <button
                                                                        className="dashboard-danger-button"
                                                                        disabled={
                                                                            actionLoading ||
                                                                            item.email ===
                                                                                user.email
                                                                        }
                                                                        onClick={() =>
                                                                            handleDeleteUser(
                                                                                item.email
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                        </div>

                    )}


                {/* =================================================
                    Admin Payments
                ================================================= */}

                {activeSection === "admin-payments" &&
                    user?.role === "admin" && (

                        <div className="dashboard-content">

                            <SectionTitle
                                title="Payment Management"
                                description="View, manage and control every payment in FinFlow."
                            />


                            <div className="dashboard-stat-grid">

                                <StatCard
                                    title="All Payments"
                                    value={
                                        adminPayments.length
                                    }
                                    subtitle="System-wide"
                                    icon="↔"
                                />

                                <StatCard
                                    title="Completed"
                                    value={
                                        completedPayments.length
                                    }
                                    subtitle="Successful"
                                    icon="✓"
                                />

                                <StatCard
                                    title="Processing"
                                    value={
                                        pendingPayments.length
                                    }
                                    subtitle="Pending or processing"
                                    icon="◷"
                                />

                                <StatCard
                                    title="Failed"
                                    value={
                                        failedPayments.length
                                    }
                                    subtitle="Failed payments"
                                    icon="!"
                                />

                            </div>


                            <div className="dashboard-panel">

                                <PaymentTable
                                    payments={
                                        adminPayments
                                    }
                                    admin={true}
                                    onDelete={
                                        handleDeleteAdminPayment
                                    }
                                    onStatusChange={
                                        handleAdminStatusChange
                                    }
                                />

                            </div>

                        </div>

                    )}


                {/* =================================================
                    Create Payment Modal
                ================================================= */}

                {showPaymentForm && (

                    <div
                        className="dashboard-modal-overlay"
                        onClick={(event) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                setShowPaymentForm(
                                    false
                                );
                            }

                        }}
                    >

                        <div className="dashboard-modal">

                            <div className="dashboard-modal-header">

                                <div>

                                    <div className="dashboard-header-eyebrow">
                                        PAYMENT
                                    </div>

                                    <h2>
                                        Create Payment
                                    </h2>

                                </div>

                                <button
                                    className="dashboard-modal-close"
                                    onClick={() =>
                                        setShowPaymentForm(
                                            false
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            <form
                                className="dashboard-form-card dashboard-modal-form"
                                onSubmit={
                                    handleCreatePayment
                                }
                            >

                                <div className="dashboard-form-grid">

                                    <div className="dashboard-form-group">

                                        <label>
                                            Customer Name
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                paymentForm.customer_name
                                            }
                                            onChange={(event) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    customer_name:
                                                        event.target.value,
                                                })
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="dashboard-form-group">

                                        <label>
                                            Customer Email
                                        </label>

                                        <input
                                            type="email"
                                            value={
                                                paymentForm.email
                                            }
                                            onChange={(event) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    email:
                                                        event.target.value,
                                                })
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="dashboard-form-group">

                                        <label>
                                            Amount
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={
                                                paymentForm.amount
                                            }
                                            onChange={(event) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    amount:
                                                        event.target.value,
                                                })
                                            }
                                            required
                                        />

                                    </div>


                                    <div className="dashboard-form-group">

                                        <label>
                                            Currency
                                        </label>

                                        <select
                                            value={
                                                paymentForm.currency
                                            }
                                            onChange={(event) =>
                                                setPaymentForm({
                                                    ...paymentForm,
                                                    currency:
                                                        event.target.value,
                                                })
                                            }
                                        >

                                            <option value="INR">
                                                INR
                                            </option>

                                            <option value="USD">
                                                USD
                                            </option>

                                        </select>

                                    </div>

                                </div>


                                <div className="dashboard-form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        rows="4"
                                        value={
                                            paymentForm.description
                                        }
                                        onChange={(event) =>
                                            setPaymentForm({
                                                ...paymentForm,
                                                description:
                                                    event.target.value,
                                            })
                                        }
                                        placeholder="Payment description"
                                    />

                                </div>


                                <div className="dashboard-modal-actions">

                                    <button
                                        type="button"
                                        className="dashboard-secondary-button"
                                        onClick={() =>
                                            setShowPaymentForm(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="dashboard-primary-button"
                                        disabled={
                                            paymentLoading
                                        }
                                    >
                                        {paymentLoading
                                            ? "Creating..."
                                            : "Create Payment"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* =================================================
                    Footer
                ================================================= */}

                <footer className="dashboard-footer">

                    <span>
                        FinFlow
                    </span>

                    <span>
                        Secure Payment Processing Platform
                    </span>

                    <span>
                        {new Date().getFullYear()}
                    </span>

                </footer>

            </main>

        </div>
    );
}