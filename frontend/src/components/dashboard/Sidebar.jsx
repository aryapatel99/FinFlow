import {
    CreditCard,
    LayoutDashboard,
    LockKeyhole,
    Settings,
    ShieldCheck,
    UserRound,
    Users,
    WalletCards,
} from "lucide-react";

import {
    NavLink,
} from "react-router-dom";


function Sidebar({
    user,
    onLogout,
}) {

    const customerLinks = [
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
            path: "/payments",
            icon: WalletCards,
        },
        {
            label: "Profile",
            path: "/profile",
            icon: UserRound,
        },
        {
            label: "Security",
            path: "/change-password",
            icon: LockKeyhole,
        },
    ];


    const adminLinks = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "All Payments",
            path: "/admin/payments",
            icon: CreditCard,
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: Users,
        },
        {
            label: "Profile",
            path: "/profile",
            icon: UserRound,
        },
        {
            label: "Security",
            path: "/change-password",
            icon: LockKeyhole,
        },
    ];


    const links =
        user?.role === "admin"
            ? adminLinks
            : customerLinks;


    return (
        <aside className="finflow-sidebar">

            <div className="sidebar-brand">

                <div className="sidebar-brand-mark">
                    <ShieldCheck
                        size={20}
                    />
                </div>

                <span>
                    FinFlow
                </span>

            </div>


            <nav className="sidebar-navigation">

                {links.map(
                    (link) => {

                        const Icon =
                            link.icon;


                        return (
                            <NavLink
                                key={
                                    link.path
                                }
                                to={
                                    link.path
                                }
                                className={
                                    ({
                                        isActive,
                                    }) =>
                                        isActive
                                            ? "sidebar-link active"
                                            : "sidebar-link"
                                }
                            >

                                <Icon
                                    size={18}
                                />

                                <span>
                                    {link.label}
                                </span>

                            </NavLink>
                        );

                    }
                )}

            </nav>


            <div className="sidebar-bottom">

                <NavLink
                    to="/profile"
                    className="sidebar-link"
                >

                    <Settings
                        size={18}
                    />

                    <span>
                        Settings
                    </span>

                </NavLink>


                <button
                    type="button"
                    className="sidebar-logout"
                    onClick={onLogout}
                >

                    Logout

                </button>

            </div>

        </aside>
    );
}


export default Sidebar;