import {
    useState,
} from "react";

import {
    changeMyPassword,
} from "../services/api";


function ChangePassword() {

    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setMessage("");
            setError("");

            if (
                newPassword !==
                confirmPassword
            ) {

                setError(
                    "New passwords do not match."
                );

                return;

            }

            if (newPassword.length < 8) {

                setError(
                    "New password must contain at least 8 characters."
                );

                return;

            }

            setLoading(true);

            try {

                const response =
                    await changeMyPassword(
                        currentPassword,
                        newPassword
                    );

                setMessage(
                    response.message ||
                    "Password changed successfully."
                );

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Unable to change password."
                );

            } finally {

                setLoading(false);

            }

        };


    return (
        <div>

            <h1>Change Password</h1>

            {message && (
                <p>{message}</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            <form
                onSubmit={handleSubmit}
            >

                <div>

                    <label>
                        Current Password
                    </label>

                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                            setCurrentPassword(
                                event.target.value
                            )
                        }
                        required
                    />

                </div>

                <div>

                    <label>
                        New Password
                    </label>

                    <input
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                            setNewPassword(
                                event.target.value
                            )
                        }
                        minLength={8}
                        required
                    />

                </div>

                <div>

                    <label>
                        Confirm New Password
                    </label>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        minLength={8}
                        required
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Changing..."
                        : "Change Password"
                    }
                </button>

            </form>

        </div>
    );
}


export default ChangePassword;