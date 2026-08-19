import {
    useEffect,
    useState,
} from "react";

import {
    deleteUser,
    getAdminUsers,
    resetUserPassword,
    updateUserRole,
} from "../services/api";


function AdminUsers() {

    const [
        users,
        setUsers,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        actionMessage,
        setActionMessage,
    ] = useState("");


    const loadUsers =
        async () => {

            try {

                setLoading(true);

                const data =
                    await getAdminUsers();

                setUsers(data);

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Unable to load users."
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadUsers();

    }, []);


    const handleRoleChange =
        async (
            email,
            role,
        ) => {

            try {

                await updateUserRole(
                    email,
                    role
                );

                setActionMessage(
                    "User role updated successfully."
                );

                await loadUsers();

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Unable to update role."
                );

            }

        };


    const handlePasswordReset =
        async (email) => {

            const newPassword =
                window.prompt(
                    "Enter new password (minimum 8 characters):"
                );

            if (!newPassword) {
                return;
            }

            if (newPassword.length < 8) {

                setError(
                    "Password must contain at least 8 characters."
                );

                return;

            }

            try {

                await resetUserPassword(
                    email,
                    newPassword
                );

                setActionMessage(
                    "User password updated successfully."
                );

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Unable to reset password."
                );

            }

        };


    const handleDelete =
        async (email) => {

            const confirmed =
                window.confirm(
                    `Delete user ${email}? This cannot be undone.`
                );

            if (!confirmed) {
                return;
            }

            try {

                await deleteUser(
                    email
                );

                setActionMessage(
                    "User deleted successfully."
                );

                await loadUsers();

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Unable to delete user."
                );

            }

        };


    if (loading) {

        return (
            <div>
                Loading users...
            </div>
        );

    }


    return (
        <div>

            <h1>Users</h1>

            {error && (
                <p>{error}</p>
            )}

            {actionMessage && (
                <p>{actionMessage}</p>
            )}

            <table>

                <thead>

                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {users.map(
                        (user) => (

                            <tr
                                key={user.user_id}
                            >

                                <td>
                                    {user.full_name}
                                </td>

                                <td>
                                    {user.email}
                                </td>

                                <td>

                                    <select
                                        value={user.role}
                                        onChange={(event) =>
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
                                            Admin
                                        </option>

                                    </select>

                                </td>

                                <td>
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePasswordReset(
                                                user.email
                                            )
                                        }
                                    >
                                        Reset Password
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                user.email
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}


export default AdminUsers;