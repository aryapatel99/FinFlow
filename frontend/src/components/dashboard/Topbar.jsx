import {
    Bell,
    ChevronDown,
} from "lucide-react";


function Topbar({
    user,
}) {

    const displayName =
        user?.full_name ||
        user?.email?.split("@")[0] ||
        "User";


    const initials =
        displayName
            .split(" ")
            .map(
                (part) =>
                    part.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();


    return (
        <header className="dashboard-topbar">

            <div className="topbar-spacer" />


            <div className="topbar-actions">

                <button
                    type="button"
                    className="notification-button"
                    aria-label="Notifications"
                >

                    <Bell
                        size={19}
                    />

                    <span className="notification-dot" />

                </button>


                <button
                    type="button"
                    className="profile-trigger"
                >

                    <span className="profile-avatar">
                        {initials}
                    </span>


                    <span className="profile-name">
                        {displayName}
                    </span>


                    <ChevronDown
                        size={16}
                    />

                </button>

            </div>

        </header>
    );
}


export default Topbar;