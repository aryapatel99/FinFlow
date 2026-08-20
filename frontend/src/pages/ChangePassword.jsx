import {
    useState,
} from "react";

import {
    ShieldCheck,
    LockKeyhole,
    CheckCircle2,
    AlertTriangle,
    Eye,
    EyeOff,
    ArrowLeft,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import AppShell from "../components/AppShell";

import {
    changePassword,
} from "../services/api";

import "../styles/premium-pages.css";


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
        showCurrent,
        setShowCurrent,
    ] = useState(false);

    const [
        showNew,
        setShowNew,
    ] = useState(false);

    const [
        showConfirm,
        setShowConfirm,
    ] = useState(false);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");


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
                    "New password and confirmation do not match."
                );

                return;

            }

            if (newPassword.length < 8) {

                setError(
                    "Your new password must contain at least 8 characters."
                );

                return;

            }

            setLoading(true);

            try {

                await changePassword(
                    currentPassword,
                    newPassword
                );

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setMessage(
                    "Your password has been changed successfully."
                );

            } catch (error) {

                setError(
                    error?.response?.data?.detail ||
                    "Unable to change your password."
                );

            } finally {

                setLoading(false);

            }

        };


    return (
        <AppShell>

            <main className="ff-premium-page">

                <header className="ff-page-header">

                    <div className="ff-page-header-copy">

                        <div className="ff-eyebrow">
                            <span className="ff-eyebrow-dot" />
                            SECURITY
                        </div>

                        <h1>
                            Security Settings
                        </h1>

                        <p>
                            Protect your FinFlow account by keeping
                            your authentication credentials secure.
                        </p>

                    </div>

                </header>


                {message && (
                    <div className="ff-message success">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="ff-message error">
                        {error}
                    </div>
                )}


                <div
                    style={{
                        maxWidth: "900px",
                    }}
                >

                    <section className="ff-panel ff-form-card">

                        <div className="ff-form-card-header">

                            <div className="ff-form-card-icon">
                                <LockKeyhole size={20} />
                            </div>

                            <div>

                                <h2>
                                    Change your password
                                </h2>

                                <p>
                                    Choose a strong password you do not reuse elsewhere.
                                </p>

                            </div>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="ff-form-field">

                                <label>
                                    Current password
                                </label>

                                <div
                                    style={{
                                        position: "relative",
                                    }}
                                >

                                    <input
                                        type={
                                            showCurrent
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            currentPassword
                                        }
                                        onChange={(event) =>
                                            setCurrentPassword(
                                                event.target.value
                                            )
                                        }
                                        required
                                        style={{
                                            paddingRight: "48px",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrent(
                                                (value) =>
                                                    !value
                                            )
                                        }
                                        style={{
                                            position: "absolute",
                                            right: "8px",
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            width: "38px",
                                            height: "38px",
                                            border: 0,
                                            borderRadius: "9px",
                                            background:
                                                "transparent",
                                            color: "#7386a4",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {showCurrent ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            <div className="ff-form-field">

                                <label>
                                    New password
                                </label>

                                <div
                                    style={{
                                        position: "relative",
                                    }}
                                >

                                    <input
                                        type={
                                            showNew
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            newPassword
                                        }
                                        onChange={(event) =>
                                            setNewPassword(
                                                event.target.value
                                            )
                                        }
                                        minLength={8}
                                        required
                                        style={{
                                            paddingRight: "48px",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowNew(
                                                (value) =>
                                                    !value
                                            )
                                        }
                                        style={{
                                            position: "absolute",
                                            right: "8px",
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            width: "38px",
                                            height: "38px",
                                            border: 0,
                                            borderRadius: "9px",
                                            background:
                                                "transparent",
                                            color: "#7386a4",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {showNew ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            <div className="ff-form-field">

                                <label>
                                    Confirm new password
                                </label>

                                <div
                                    style={{
                                        position: "relative",
                                    }}
                                >

                                    <input
                                        type={
                                            showConfirm
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value
                                            )
                                        }
                                        minLength={8}
                                        required
                                        style={{
                                            paddingRight: "48px",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirm(
                                                (value) =>
                                                    !value
                                            )
                                        }
                                        style={{
                                            position: "absolute",
                                            right: "8px",
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            width: "38px",
                                            height: "38px",
                                            border: 0,
                                            borderRadius: "9px",
                                            background:
                                                "transparent",
                                            color: "#7386a4",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {showConfirm ? (
                                            <EyeOff size={17} />
                                        ) : (
                                            <Eye size={17} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="ff-primary-btn"
                                disabled={loading}
                            >
                                <ShieldCheck size={17} />

                                {loading
                                    ? "Updating password…"
                                    : "Update Password"
                                }
                            </button>

                        </form>

                    </section>


                    <section
                        className="ff-panel ff-form-card"
                        style={{
                            marginTop: "18px",
                        }}
                    >

                        <div className="ff-form-card-header">

                            <div className="ff-form-card-icon">
                                <CheckCircle2 size={20} />
                            </div>

                            <div>

                                <h2>
                                    Password requirements
                                </h2>

                                <p>
                                    Use a password that is difficult to guess.
                                </p>

                            </div>

                        </div>


                        <div
                            style={{
                                display: "grid",
                                gap: "11px",
                                color: "#8496b2",
                                fontSize: "13px",
                            }}
                        >

                            <div>
                                ✓ At least 8 characters
                            </div>

                            <div>
                                ✓ Avoid passwords used on other services
                            </div>

                            <div>
                                ✓ Avoid easily guessed personal information
                            </div>

                        </div>

                    </section>


                    <Link
                        to="/profile"
                        className="ff-secondary-btn"
                        style={{
                            marginTop: "18px",
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Profile
                    </Link>

                </div>

            </main>

        </AppShell>
    );
}


export default ChangePassword;