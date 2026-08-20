import {
    motion,
} from "motion/react";

import {
    ArrowUpRight,
    CreditCard,
    LockKeyhole,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";


function QuickActions({
    user,
}) {

    const actions = [
        {
            label: "Create Payment",
            description: "Start a new transaction",
            icon: CreditCard,
            path: "/payments/create",
        },
        {
            label: "View Payments",
            description: "Review your transactions",
            icon: ArrowUpRight,
            path: "/payments",
        },
        {
            label: "Profile",
            description: "Manage your account",
            icon: UserRound,
            path: "/profile",
        },
        {
            label: "Security",
            description: "Update your password",
            icon: LockKeyhole,
            path: "/change-password",
        },
    ];


    if (
        user?.role === "admin"
    ) {

        actions.push(
            {
                label: "Manage Users",
                description: "View and manage users",
                icon: UserRound,
                path: "/admin/users",
            },
            {
                label: "Manage Payments",
                description: "Review all transactions",
                icon: ShieldCheck,
                path: "/admin/payments",
            }
        );

    }


    return (
        <motion.div
            className="dashboard-panel quick-actions-panel"
            initial={{
                opacity: 0,
                x: 12,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.45,
                delay: 0.2,
            }}
        >

            <div className="panel-heading">

                <div>

                    <span>
                        Shortcuts
                    </span>

                    <h2>
                        Quick actions
                    </h2>

                </div>

            </div>


            <div className="quick-actions-list">

                {actions.map(
                    (
                        action,
                        index
                    ) => {

                        const Icon =
                            action.icon;


                        return (
                            <Link
                                key={
                                    `${action.path}-${index}`
                                }
                                to={
                                    action.path
                                }
                                className="quick-action"
                            >

                                <span className="quick-action-icon">

                                    <Icon
                                        size={18}
                                    />

                                </span>


                                <span className="quick-action-copy">

                                    <strong>
                                        {action.label}
                                    </strong>

                                    <small>
                                        {action.description}
                                    </small>

                                </span>


                                <ArrowUpRight
                                    className="quick-action-arrow"
                                    size={16}
                                />

                            </Link>
                        );

                    }
                )}

            </div>

        </motion.div>
    );
}


export default QuickActions;