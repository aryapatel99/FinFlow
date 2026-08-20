import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    Users,
    UserPlus,
    ShieldCheck,
    Shield,
    Trash2,
    RefreshCw,
    UserCog,
} from "lucide-react";

import AppShell from "../components/AppShell";

import {
    getAdminUsers,
    updateAdminUserRole,
    deleteAdminUser,
} from "../services/api";

import "../styles/premium-pages.css";


function getInitials(name, email) {

    const source =
        name ||
        email ||
        "U";

    return source
        .split(" ")
        .slice(0, 2)
        .map(
            (part) =>
                part.charAt(0).toUpperCase()
        )
        .join("");

}


function formatDate(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

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


function AdminUsers() {

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    const loadUsers =
        async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getAdminUsers();

                setUsers(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                setError(
                    error?.response?.data?.detail ||
                    "Unable to load users."
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {
        loadUsers();
    }, []);


    const filteredUsers =
        useMemo(() => {

            const query =
                search.trim().toLowerCase();

            if (!query) {
                return users;
            }

            return users.filter(
                (user) =>
                    String(
                        user.full_name || ""
                    )
                        .toLowerCase()
                        .includes(query) ||
                    String(
                        user.email || ""
                    )
                        .toLowerCase()
                        .includes(query) ||
                    String(
                        user.role || ""
                    )
                        .toLowerCase()
                        .includes(query)
            );

        }, [
            users,
            search,
        ]);


    const adminCount =
        users.filter(
            (user) =>
                String(user.role)
                    .toLowerCase() === "admin"
        ).length;


    const customerCount =
        users.filter(
            (user) =>
                String(user.role)
                    .toLowerCase() === "customer"
        ).length;


    const handleRoleChange =
        async (
            email,
            role
        ) => {

            try {

                setError("");

                await updateAdminUserRole(
                    email,
                    role
                );

                await loadUsers();

            } catch (error) {

                setError(
                    error?.response?.data?.detail ||
                    "Unable to change user role."
                );

            }

        };


    const handleDelete =
        async (email) => {

            const confirmed =
                window.confirm(
                    `Delete user ${email}?`
                );

            if (!confirmed) {
                return;
            }

            try {

                setError("");

                await deleteAdminUser(
                    email
                );

                await loadUsers();

            } catch (error) {

                setError(
                    error?.response?.data?.detail ||
                    "Unable to delete user."
                );

            }

        };


    return (
        <AppShell>

            <main className="ff-premium-page">

                <header className="ff-page-header">

                    <div className="ff-page-header-copy">

                        <div className="ff-eyebrow">
                            <span className="ff-eyebrow-dot" />
                            ADMINISTRATION
                        </div>

                        <h1>
                            User Management
                        </h1>

                        <p>
                            Manage FinFlow accounts, permissions and
                            administrative access from one workspace.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="ff-secondary-btn"
                        onClick={loadUsers}
                    >
                        <RefreshCw size={15} />
                        Refresh
                    </button>

                </header>


                <section className="ff-stat-grid">

                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Total Users</span>

                            <div className="ff-stat-icon blue">
                                <Users size={18} />
                            </div>
                        </div>

                        <strong>
                            {users.length}
                        </strong>

                        <small>
                            Registered accounts
                        </small>

                    </div>


                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Administrators</span>

                            <div className="ff-stat-icon blue">
                                <ShieldCheck size={18} />
                            </div>
                        </div>

                        <strong>
                            {adminCount}
                        </strong>

                        <small>
                            Elevated access accounts
                        </small>

                    </div>


                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Customers</span>

                            <div className="ff-stat-icon green">
                                <UserPlus size={18} />
                            </div>
                        </div>

                        <strong>
                            {customerCount}
                        </strong>

                        <small>
                            Standard accounts
                        </small>

                    </div>


                    <div className="ff-stat-card">

                        <div className="ff-stat-top">
                            <span>Access Control</span>

                            <div className="ff-stat-icon amber">
                                <UserCog size={18} />
                            </div>
                        </div>

                        <strong>
                            Active
                        </strong>

                        <small>
                            Role management enabled
                        </small>

                    </div>

                </section>


                <section className="ff-panel">

                    <div className="ff-panel-header">

                        <div className="ff-panel-title">

                            <div className="ff-panel-title-icon">
                                <Users size={19} />
                            </div>

                            <div>
                                <h2>
                                    Platform users
                                </h2>

                                <p>
                                    {filteredUsers.length} users shown
                                </p>
                            </div>

                        </div>

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
                                placeholder="Search by name, email or role..."
                            />

                        </div>

                    </div>


                    {error && (
                        <div className="ff-message error">
                            {error}
                        </div>
                    )}


                    {loading ? (

                        <div className="ff-empty">

                            <RefreshCw size={27} />

                            <h3>
                                Loading users
                            </h3>

                            <p>
                                Fetching current account information.
                            </p>

                        </div>

                    ) : (

                        <div style={{ overflowX: "auto" }}>

                            <table className="ff-user-table">

                                <thead>

                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Created</th>
                                        <th>Access</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredUsers.map(
                                        (user) => (

                                            <tr
                                                key={
                                                    user.user_id ||
                                                    user.email
                                                }
                                            >

                                                <td>

                                                    <div className="ff-user-cell">

                                                        <div className="ff-user-avatar">
                                                            {
                                                                getInitials(
                                                                    user.full_name,
                                                                    user.email
                                                                )
                                                            }
                                                        </div>

                                                        <div>

                                                            <div className="ff-user-name">
                                                                {
                                                                    user.full_name ||
                                                                    "Unnamed user"
                                                                }
                                                            </div>

                                                            <div className="ff-user-email">
                                                                {
                                                                    user.email
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <select
                                                        className="ff-role-select"
                                                        value={
                                                            user.role
                                                        }
                                                        onChange={
                                                            (event) =>
                                                                handleRoleChange(
                                                                    user.email,
                                                                    event.target.value
                                                                )
                                                        }
                                                    >

                                                        <option value="customer">
                                                            Customer
                                                        </option>

                                                        <option value="admin">
                                                            Administrator
                                                        </option>

                                                    </select>

                                                </td>


                                                <td>
                                                    {
                                                        formatDate(
                                                            user.created_at
                                                        )
                                                    }
                                                </td>


                                                <td>

                                                    {String(
                                                        user.role
                                                    ).toLowerCase() ===
                                                    "admin" ? (

                                                        <span className="ff-status processing">
                                                            <ShieldCheck size={12} />
                                                            ADMIN
                                                        </span>

                                                    ) : (

                                                        <span className="ff-status completed">
                                                            <Shield size={12} />
                                                            STANDARD
                                                        </span>

                                                    )}

                                                </td>


                                                <td>

                                                    <button
                                                        type="button"
                                                        className="ff-danger-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.email
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>


                            {filteredUsers.length === 0 && (
                                <div className="ff-empty">
                                    <Users size={27} />
                                    <h3>
                                        No users found
                                    </h3>
                                    <p>
                                        Try changing your search query.
                                    </p>
                                </div>
                            )}

                        </div>

                    )}

                </section>

            </main>

        </AppShell>
    );
}


export default AdminUsers;