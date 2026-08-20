import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    CreditCard,
    IndianRupee,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
    Users,
    WalletCards,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    getAdminDashboard,
} from "../services/api";

import AppShell from "../components/AppShell";

import "../styles/admin.css";


function AdminDashboard() {

    const [
        dashboard,
        setDashboard,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const loadDashboard =
        async () => {

            setLoading(true);
            setError("");

            try {

                const data =
                    await getAdminDashboard();

                setDashboard(data);

            } catch (error) {

                console.error(
                    "Failed to load admin dashboard:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load administration dashboard."
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadDashboard();

    }, []);


    const stats =
        useMemo(() => {

            const data =
                dashboard || {};

            return {

                totalUsers:
                    data.total_users ??
                    data.users_count ??
                    data.user_count ??
                    0,

                totalPayments:
                    data.total_payments ??
                    data.payments_count ??
                    data.payment_count ??
                    0,

                totalRevenue:
                    data.total_revenue ??
                    data.revenue ??
                    data.total_amount ??
                    0,

                successfulPayments:
                    data.successful_payments ??
                    data.completed_payments ??
                    data.completed_count ??
                    0,

            };

        }, [dashboard]);


    const successRate =
        stats.totalPayments > 0
            ? (
                stats.successfulPayments /
                stats.totalPayments
            ) * 100
            : 0;


    const formatCurrency =
        (value) => {

            const number =
                Number(value) || 0;

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                }
            ).format(number);

        };


    const formatNumber =
        (value) => {

            return new Intl.NumberFormat(
                "en-IN"
            ).format(
                Number(value) || 0
            );

        };


    if (loading) {

        return (

            <AppShell>

                <div className="admin-page">

                    <div className="admin-loading-card">

                        <div className="admin-spinner">
                            <RefreshCw
                                size={20}
                            />
                        </div>

                        <div>

                            <strong>
                                Loading administration
                            </strong>

                            <span>
                                Preparing your FinFlow overview...
                            </span>

                        </div>

                    </div>

                </div>

            </AppShell>

        );

    }


    return (

        <AppShell>

            <div className="admin-page">


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <section className="admin-page-header">

                    <div>

                        <div className="admin-eyebrow">

                            <ShieldCheck
                                size={15}
                            />

                            ADMINISTRATION

                        </div>

                        <h1>
                            Command Center
                        </h1>

                        <p>
                            Monitor payments, users and
                            financial activity across FinFlow.
                        </p>

                    </div>


                    <button
                        className="admin-refresh-button"
                        onClick={
                            loadDashboard
                        }
                    >

                        <RefreshCw
                            size={17}
                        />

                        Refresh

                    </button>

                </section>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="admin-error">

                        <Activity
                            size={18}
                        />

                        <div>

                            <strong>
                                Dashboard unavailable
                            </strong>

                            <span>
                                {error}
                            </span>

                        </div>

                        <button
                            onClick={
                                loadDashboard
                            }
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =================================
                    STAT CARDS
                ================================= */}

                <section className="admin-stat-grid">


                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon blue">
                                <Users size={19} />
                            </div>

                            <span className="admin-stat-trend positive">

                                <ArrowUpRight
                                    size={14}
                                />

                                Active

                            </span>

                        </div>

                        <div className="admin-stat-label">
                            Total Users
                        </div>

                        <div className="admin-stat-value">
                            {formatNumber(
                                stats.totalUsers
                            )}
                        </div>

                        <div className="admin-stat-footer">
                            Registered FinFlow accounts
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon purple">
                                <CreditCard size={19} />
                            </div>

                            <span className="admin-stat-trend positive">

                                <TrendingUp
                                    size={14}
                                />

                                Live

                            </span>

                        </div>

                        <div className="admin-stat-label">
                            Total Payments
                        </div>

                        <div className="admin-stat-value">
                            {formatNumber(
                                stats.totalPayments
                            )}
                        </div>

                        <div className="admin-stat-footer">
                            Payment transactions processed
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon green">
                                <IndianRupee size={19} />
                            </div>

                            <span className="admin-stat-trend positive">

                                <ArrowUpRight
                                    size={14}
                                />

                                Revenue

                            </span>

                        </div>

                        <div className="admin-stat-label">
                            Total Revenue
                        </div>

                        <div className="admin-stat-value">
                            {formatCurrency(
                                stats.totalRevenue
                            )}
                        </div>

                        <div className="admin-stat-footer">
                            Gross payment value
                        </div>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <div className="admin-stat-icon orange">
                                <WalletCards size={19} />
                            </div>

                            <span className="admin-stat-trend positive">

                                <ArrowUpRight
                                    size={14}
                                />

                                {successRate.toFixed(1)}%

                            </span>

                        </div>

                        <div className="admin-stat-label">
                            Success Rate
                        </div>

                        <div className="admin-stat-value">
                            {successRate.toFixed(1)}%
                        </div>

                        <div className="admin-stat-footer">
                            Completed payments ratio
                        </div>

                    </div>

                </section>


                {/* =================================
                    MAIN GRID
                ================================= */}

                <section className="admin-main-grid">


                    {/* Analytics */}

                    <div className="admin-panel admin-analytics-panel">

                        <div className="admin-panel-header">

                            <div>

                                <div className="admin-panel-kicker">
                                    PERFORMANCE
                                </div>

                                <h2>
                                    Payment overview
                                </h2>

                                <p>
                                    Current transaction
                                    performance across
                                    your platform.
                                </p>

                            </div>

                            <div className="admin-panel-icon">
                                <TrendingUp
                                    size={19}
                                />
                            </div>

                        </div>


                        <div className="admin-overview-chart">

                            <div className="chart-grid-lines">

                                <span />
                                <span />
                                <span />
                                <span />

                            </div>


                            <div className="chart-bars">

                                {[
                                    38,
                                    56,
                                    45,
                                    68,
                                    52,
                                    78,
                                    64,
                                    86,
                                    72,
                                    91,
                                    80,
                                    96,
                                ].map(
                                    (
                                        height,
                                        index
                                    ) => (

                                        <div
                                            className="chart-column"
                                            key={index}
                                        >

                                            <div
                                                className="chart-bar"
                                                style={{
                                                    height:
                                                        `${height}%`,
                                                }}
                                            />

                                        </div>

                                    )
                                )}

                            </div>

                            <div className="chart-labels">

                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>

                            </div>

                        </div>


                        <div className="analytics-summary">

                            <div>

                                <span>
                                    Completed
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.successfulPayments
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Total volume
                                </span>

                                <strong>
                                    {formatCurrency(
                                        stats.totalRevenue
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Success rate
                                </span>

                                <strong>
                                    {successRate.toFixed(1)}%
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* Quick Actions */}

                    <div className="admin-panel admin-actions-panel">

                        <div className="admin-panel-header compact">

                            <div>

                                <div className="admin-panel-kicker">
                                    MANAGEMENT
                                </div>

                                <h2>
                                    Quick actions
                                </h2>

                            </div>

                        </div>


                        <Link
                            to="/admin/payments"
                            className="admin-action-card"
                        >

                            <div className="admin-action-icon blue">
                                <CreditCard
                                    size={19}
                                />
                            </div>

                            <div>

                                <strong>
                                    Review payments
                                </strong>

                                <span>
                                    View and manage transactions
                                </span>

                            </div>

                            <ArrowUpRight
                                size={17}
                            />

                        </Link>


                        <Link
                            to="/admin/users"
                            className="admin-action-card"
                        >

                            <div className="admin-action-icon purple">
                                <Users
                                    size={19}
                                />
                            </div>

                            <div>

                                <strong>
                                    Manage users
                                </strong>

                                <span>
                                    Accounts, roles and access
                                </span>

                            </div>

                            <ArrowUpRight
                                size={17}
                            />

                        </Link>


                        <Link
                            to="/profile"
                            className="admin-action-card"
                        >

                            <div className="admin-action-icon green">
                                <ShieldCheck
                                    size={19}
                                />
                            </div>

                            <div>

                                <strong>
                                    Account security
                                </strong>

                                <span>
                                    Review your administrator profile
                                </span>

                            </div>

                            <ArrowUpRight
                                size={17}
                            />

                        </Link>


                        <div className="admin-security-note">

                            <ShieldCheck
                                size={17}
                            />

                            <div>

                                <strong>
                                    Protected workspace
                                </strong>

                                <span>
                                    Administrative actions require
                                    elevated permissions.
                                </span>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================
                    BOTTOM INFORMATION
                ================================= */}

                <section className="admin-bottom-grid">


                    <div className="admin-mini-card">

                        <div className="admin-mini-icon blue">
                            <Users size={18} />
                        </div>

                        <div>

                            <span>
                                User base
                            </span>

                            <strong>
                                {formatNumber(
                                    stats.totalUsers
                                )}
                            </strong>

                        </div>

                        <ArrowUpRight
                            size={16}
                        />

                    </div>


                    <div className="admin-mini-card">

                        <div className="admin-mini-icon purple">
                            <CreditCard size={18} />
                        </div>

                        <div>

                            <span>
                                Transactions
                            </span>

                            <strong>
                                {formatNumber(
                                    stats.totalPayments
                                )}
                            </strong>

                        </div>

                        <ArrowUpRight
                            size={16}
                        />

                    </div>


                    <div className="admin-mini-card">

                        <div className="admin-mini-icon green">
                            <IndianRupee size={18} />
                        </div>

                        <div>

                            <span>
                                Processed value
                            </span>

                            <strong>
                                {formatCurrency(
                                    stats.totalRevenue
                                )}
                            </strong>

                        </div>

                        <ArrowUpRight
                            size={16}
                        />

                    </div>

                </section>

            </div>

        </AppShell>

    );

}


export default AdminDashboard;