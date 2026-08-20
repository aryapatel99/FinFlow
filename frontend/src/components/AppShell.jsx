import {
    LayoutDashboard,
    CreditCard,
    Users,
    UserRound,
    ShieldCheck,
    LogOut,
    Menu,
    X,
    ChevronDown,
    WalletCards,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    useContext,
    useState,
} from "react";

import {
    AuthContext,
} from "../context/AuthContext";

import "../styles/admin.css";


function AppShell({
    children,
}) {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useContext(AuthContext);

    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);

    const [
        profileOpen,
        setProfileOpen,
    ] = useState(false);


    const isAdmin =
        user?.role === "admin";


    const handleLogout =
        async () => {

            try {

                if (logout) {
                    await logout();
                }

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );

            } finally {

                localStorage.removeItem(
                    "access_token"
                );

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

            }

        };


    const closeMobile =
        () => {
            setMobileOpen(false);
        };


    const navItems = [
        {
            label: "Dashboard",
            path: isAdmin
                ? "/admin/dashboard"
                : "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Payments",
            path: isAdmin
                ? "/admin/payments"
                : "/payments",
            icon: CreditCard,
        },
        ...(isAdmin
            ? [
                {
                    label: "Users",
                    path: "/admin/users",
                    icon: Users,
                },
            ]
            : []),
        {
            label: "Profile",
            path: "/profile",
            icon: UserRound,
        },
        {
            label: "Security",
            path: "/change-password",
            icon: ShieldCheck,
        },
    ];


    const initials =
        user?.email
            ? user.email
                .charAt(0)
                .toUpperCase()
            : "U";


    return (
        <div className="finflow-shell">


            {/* =================================
                MOBILE OVERLAY
            ================================= */}

            {mobileOpen && (

                <button
                    className="admin-mobile-overlay"
                    onClick={closeMobile}
                    aria-label="Close navigation"
                />

            )}


            {/* =================================
                SIDEBAR
            ================================= */}

            <aside
                className={
                    `finflow-sidebar ${
                        mobileOpen
                            ? "sidebar-mobile-open"
                            : ""
                    }`
                }
            >

                <div className="sidebar-top">


                    {/* Brand */}

                    <div className="finflow-brand">

                        <div className="finflow-brand-icon">

                            <WalletCards
                                size={21}
                                strokeWidth={2.4}
                            />

                        </div>

                        <div>

                            <div className="finflow-brand-name">
                                FinFlow
                            </div>

                            <div className="finflow-brand-subtitle">
                                Finance Platform
                            </div>

                        </div>


                        <button
                            className="sidebar-close"
                            onClick={closeMobile}
                            aria-label="Close menu"
                        >
                            <X size={19} />
                        </button>

                    </div>


                    {/* Workspace */}

                    <div className="sidebar-section-label">
                        {isAdmin
                            ? "Administration"
                            : "Workspace"}
                    </div>


                    {/* Navigation */}

                    <nav className="sidebar-navigation">

                        {navItems.map(
                            ({
                                label,
                                path,
                                icon: Icon,
                            }) => (

                                <NavLink
                                    key={path}
                                    to={path}
                                    onClick={
                                        closeMobile
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        `sidebar-link ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >

                                    <span className="sidebar-link-icon">
                                        <Icon
                                            size={19}
                                            strokeWidth={2}
                                        />
                                    </span>

                                    <span>
                                        {label}
                                    </span>

                                </NavLink>

                            )
                        )}

                    </nav>

                </div>


                {/* =================================
                    SIDEBAR BOTTOM
                ================================= */}

                <div className="sidebar-bottom">


                    {isAdmin && (

                        <div className="admin-access-card">

                            <div className="admin-access-icon">

                                <ShieldCheck
                                    size={17}
                                />

                            </div>

                            <div>

                                <div className="admin-access-title">
                                    Administrator
                                </div>

                                <div className="admin-access-text">
                                    Elevated access enabled
                                </div>

                            </div>

                        </div>

                    )}


                    <button
                        className="sidebar-logout"
                        onClick={
                            handleLogout
                        }
                    >

                        <LogOut
                            size={18}
                        />

                        <span>
                            Logout
                        </span>

                    </button>


                    <div className="sidebar-user">

                        <div className="sidebar-user-avatar">
                            {initials}
                        </div>

                        <div className="sidebar-user-info">

                            <div className="sidebar-user-email">
                                {user?.email ||
                                    "User"}
                            </div>

                            <div className="sidebar-user-role">
                                {user?.role ||
                                    "customer"}
                            </div>

                        </div>

                    </div>

                </div>

            </aside>


            {/* =================================
                MAIN AREA
            ================================= */}

            <div className="finflow-main">


                {/* Header */}

                <header className="finflow-header">

                    <button
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileOpen(true)
                        }
                        aria-label="Open navigation"
                    >

                        <Menu size={21} />

                    </button>


                    <div className="header-spacer" />


                    <div className="header-user-area">

                        <div className="header-user-text">

                            <div className="header-user-email">
                                {user?.email ||
                                    "User"}
                            </div>

                            <div className="header-user-role">
                                {isAdmin
                                    ? "Administrator"
                                    : "Customer"}
                            </div>

                        </div>


                        <button
                            className="header-avatar-button"
                            onClick={() =>
                                setProfileOpen(
                                    !profileOpen
                                )
                            }
                        >

                            <span className="header-avatar">
                                {initials}
                            </span>

                            <ChevronDown
                                size={16}
                            />

                        </button>


                        {profileOpen && (

                            <div className="profile-dropdown">

                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate(
                                            "/profile"
                                        );
                                    }}
                                >
                                    <UserRound
                                        size={16}
                                    />
                                    Profile
                                </button>

                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate(
                                            "/change-password"
                                        );
                                    }}
                                >
                                    <ShieldCheck
                                        size={16}
                                    />
                                    Security
                                </button>

                                <div className="dropdown-divider" />

                                <button
                                    className="dropdown-danger"
                                    onClick={
                                        handleLogout
                                    }
                                >
                                    <LogOut
                                        size={16}
                                    />
                                    Logout
                                </button>

                            </div>

                        )}

                    </div>

                </header>


                {/* Page */}

                <main className="finflow-page">

                    {children}

                </main>

            </div>

        </div>
    );
}


export default AppShell;