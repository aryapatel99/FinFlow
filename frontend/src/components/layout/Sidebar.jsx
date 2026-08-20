import {
    LayoutDashboard,
    CreditCard,
    Receipt,
    UserRound,
    ShieldCheck,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UsersRound,
    WalletCards,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../../context/AuthContext";

import {
    motion,
} from "motion/react";


function Sidebar({
    collapsed = false,
    setCollapsed,
}) {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();


    const isAdmin =
        user?.role === "admin";


    const customerItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Payments",
            path: "/payments",
            icon: CreditCard,
        },
        {
            label: "Billing",
            path: "/billing",
            icon: Receipt,
        },
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


    const adminItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "All Payments",
            path: "/admin/payments",
            icon: WalletCards,
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: UsersRound,
        },
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


    const navigationItems =
        isAdmin
            ? adminItems
            : customerItems;


    const handleLogout = () => {

        logout();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };


    return (
        <motion.aside
            initial={false}
            animate={{
                width: collapsed
                    ? 82
                    : 256,
            }}
            transition={{
                duration: 0.25,
                ease: "easeInOut",
            }}
            className="
                fixed
                left-0
                top-0
                z-40
                flex
                h-screen
                flex-col
                border-r
                border-slate-200
                bg-white
                shadow-[4px_0_24px_rgba(15,23,42,0.04)]
                dark:border-slate-800
                dark:bg-slate-950
            "
        >

            {/* ==============================
                Logo
            =============================== */}

            <div
                className="
                    flex
                    h-20
                    items-center
                    border-b
                    border-slate-200
                    px-5
                    dark:border-slate-800
                "
            >

                <div
                    className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-slate-900
                            text-white
                            shadow-lg
                            shadow-slate-900/10
                        "
                    >

                        <CreditCard
                            size={21}
                            strokeWidth={2.2}
                        />

                    </div>


                    {!collapsed && (

                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            className="min-w-0"
                        >

                            <p
                                className="
                                    truncate
                                    text-lg
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                FinFlow
                            </p>

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-400
                                "
                            >
                                Financial Platform
                            </p>

                        </motion.div>

                    )}

                </div>

            </div>


            {/* ==============================
                Navigation
            =============================== */}

            <nav
                className="
                    flex-1
                    space-y-1
                    overflow-y-auto
                    px-3
                    py-6
                "
            >

                {!collapsed && (

                    <p
                        className="
                            mb-3
                            px-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-slate-400
                        "
                    >
                        Workspace
                    </p>

                )}


                {navigationItems.map(
                    (item) => {

                        const Icon =
                            item.icon;


                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={
                                    collapsed
                                        ? item.label
                                        : undefined
                                }
                                className={({
                                    isActive,
                                }) => `
                                    group
                                    relative
                                    flex
                                    h-11
                                    items-center
                                    rounded-xl
                                    px-3
                                    transition-all
                                    duration-200
                                    ${
                                        isActive
                                            ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                                    }
                                    ${
                                        collapsed
                                            ? "justify-center"
                                            : "gap-3"
                                    }
                                `}
                            >

                                <Icon
                                    size={19}
                                    strokeWidth={2}
                                />

                                {!collapsed && (

                                    <span
                                        className="
                                            text-sm
                                            font-medium
                                        "
                                    >
                                        {item.label}
                                    </span>

                                )}

                            </NavLink>
                        );

                    }
                )}


                <div
                    className="
                        my-5
                        border-t
                        border-slate-200
                        dark:border-slate-800
                    "
                />


                {!collapsed && (

                    <p
                        className="
                            mb-3
                            px-3
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-slate-400
                        "
                    >
                        Account
                    </p>

                )}


                <NavLink
                    to="/profile"
                    title={
                        collapsed
                            ? "Settings"
                            : undefined
                    }
                    className={({
                        isActive,
                    }) => `
                        flex
                        h-11
                        items-center
                        rounded-xl
                        px-3
                        transition-all
                        ${
                            isActive
                                ? "bg-slate-900 text-white"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                        }
                        ${
                            collapsed
                                ? "justify-center"
                                : "gap-3"
                        }
                    `}
                >

                    <Settings
                        size={19}
                    />

                    {!collapsed && (

                        <span
                            className="
                                text-sm
                                font-medium
                            "
                        >
                            Settings
                        </span>

                    )}

                </NavLink>

            </nav>


            {/* ==============================
                User / Logout
            =============================== */}

            <div
                className="
                    border-t
                    border-slate-200
                    p-3
                    dark:border-slate-800
                "
            >

                {!collapsed && (

                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-slate-50
                            p-3
                            dark:bg-slate-900
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-slate-900
                                text-xs
                                font-bold
                                text-white
                            "
                        >
                            {(
                                user?.email
                                    ?.charAt(0)
                                    ?.toUpperCase()
                            ) || "U"}
                        </div>


                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >

                            <p
                                className="
                                    truncate
                                    text-xs
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {user?.email || "User"}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                "
                            >
                                {user?.role || "customer"}
                            </p>

                        </div>

                    </div>

                )}


                <button
                    type="button"
                    onClick={handleLogout}
                    title={
                        collapsed
                            ? "Logout"
                            : undefined
                    }
                    className="
                        flex
                        h-11
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-xl
                        px-3
                        text-sm
                        font-medium
                        text-slate-500
                        transition-all
                        hover:bg-red-50
                        hover:text-red-600
                        dark:text-slate-400
                        dark:hover:bg-red-950/30
                        dark:hover:text-red-400
                    "
                >

                    <LogOut
                        size={19}
                    />

                    {!collapsed && (
                        <span>
                            Logout
                        </span>
                    )}

                </button>

            </div>


            {/* ==============================
                Collapse Button
            =============================== */}

            {setCollapsed && (

                <button
                    type="button"
                    onClick={() =>
                        setCollapsed(
                            !collapsed
                        )
                    }
                    className="
                        absolute
                        -right-3
                        top-[4.65rem]
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-slate-200
                        bg-white
                        text-slate-500
                        shadow-sm
                        transition
                        hover:text-slate-900
                        dark:border-slate-700
                        dark:bg-slate-900
                        dark:hover:text-white
                    "
                >

                    {collapsed ? (
                        <ChevronRight
                            size={15}
                        />
                    ) : (
                        <ChevronLeft
                            size={15}
                        />
                    )}

                </button>

            )}

        </motion.aside>
    );
}


export default Sidebar;