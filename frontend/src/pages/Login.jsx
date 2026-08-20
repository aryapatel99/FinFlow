import {
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    loginUser,
} from "../services/api";


function Login() {

    const navigate = useNavigate();

    const [
        email,
        setEmail,
    ] = useState("");

    const [
        password,
        setPassword,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");


            if (!email.trim()) {

                setError(
                    "Please enter your email address."
                );

                return;

            }


            if (!password) {

                setError(
                    "Please enter your password."
                );

                return;

            }


            setLoading(true);


            try {

                const data =
                    await loginUser(
                        email.trim(),
                        password
                    );


                if (!data?.access_token) {

                    throw new Error(
                        "Login succeeded but no access token was returned."
                    );

                }


                localStorage.setItem(
                    "access_token",
                    data.access_token
                );


                /*
                 * Reloading the application allows
                 * AuthContext to initialise itself
                 * from the newly stored token.
                 */

                window.location.href =
                    "/dashboard";


            } catch (err) {

                console.error(
                    "Login failed:",
                    err
                );


                const detail =
                    err.response?.data?.detail;


                if (
                    Array.isArray(detail)
                ) {

                    setError(
                        detail
                            .map(
                                (item) =>
                                    item.msg
                            )
                            .join(", ")
                    );

                } else {

                    setError(
                        detail ||
                        err.message ||
                        "Unable to sign in. Please check your credentials."
                    );

                }


                setLoading(false);

            }

        };


    return (

        <main className="auth-page">

            <div className="auth-background-glow auth-glow-one" />
            <div className="auth-background-glow auth-glow-two" />


            <section className="auth-layout">

                {/* =================================
                    BRAND / HERO
                ================================= */}

                <div className="auth-hero">

                    <Link
                        to="/login"
                        className="auth-brand"
                    >

                        <span className="auth-brand-mark">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >

                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="14"
                                    rx="3"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />

                                <path
                                    d="M3 9h18"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />

                                <path
                                    d="M7 14h4"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                            </svg>

                        </span>


                        <span>
                            FinFlow
                        </span>

                    </Link>


                    <div className="auth-hero-content">

                        <div className="auth-eyebrow">

                            <span className="auth-eyebrow-dot" />

                            FINANCIAL OPERATIONS PLATFORM

                        </div>


                        <h1>

                            Your finances,
                            <br />

                            <span>
                                under control.
                            </span>

                        </h1>


                        <p>

                            Manage payments, track transactions,
                            and keep your financial operations
                            organised from one secure workspace.

                        </p>


                        <div className="auth-feature-list">

                            <div className="auth-feature">

                                <span className="auth-feature-icon">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >

                                        <path
                                            d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />

                                        <path
                                            d="m9 12 2 2 4-4"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                    </svg>

                                </span>


                                <div>

                                    <strong>
                                        Secure by design
                                    </strong>

                                    <span>
                                        Protected authentication
                                        and payment workflows
                                    </span>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <span className="auth-feature-icon">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >

                                        <path
                                            d="M4 19V9"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M10 19V5"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M16 19v-7"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M22 19H2"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                    </svg>

                                </span>


                                <div>

                                    <strong>
                                        Clear financial visibility
                                    </strong>

                                    <span>
                                        Payments and activity in
                                        one unified dashboard
                                    </span>

                                </div>

                            </div>


                            <div className="auth-feature">

                                <span className="auth-feature-icon">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >

                                        <path
                                            d="M12 3v18"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M17 7.5c0-1.7-1.8-3-5-3s-5 1.3-5 3 1.8 3 5 3 5 1.3 5 3-1.8 3-5 3-5-1.3-5-3"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                    </svg>

                                </span>


                                <div>

                                    <strong>
                                        Payment ready
                                    </strong>

                                    <span>
                                        Create and process payments
                                        with confidence
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="auth-hero-footer">

                        <span>
                            © 2026 FinFlow
                        </span>

                        <span className="auth-footer-divider" />

                        <span>
                            Finance Platform
                        </span>

                    </div>

                </div>


                {/* =================================
                    LOGIN CARD
                ================================= */}

                <div className="auth-panel">

                    <div className="auth-card">

                        <div className="auth-card-top">

                            <div className="auth-card-icon">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >

                                    <rect
                                        x="4"
                                        y="3"
                                        width="16"
                                        height="18"
                                        rx="3"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />

                                    <circle
                                        cx="12"
                                        cy="9"
                                        r="2.5"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />

                                    <path
                                        d="M8 17c.9-2 2.2-3 4-3s3.1 1 4 3"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />

                                </svg>

                            </div>


                            <div>

                                <span className="auth-card-kicker">
                                    WELCOME BACK
                                </span>

                                <h2>
                                    Sign in to FinFlow
                                </h2>

                                <p>
                                    Access your financial workspace.
                                </p>

                            </div>

                        </div>


                        {error && (

                            <div className="auth-error">

                                <span className="auth-error-icon">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >

                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        />

                                        <path
                                            d="M12 8v5"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <circle
                                            cx="12"
                                            cy="16.5"
                                            r="1"
                                            fill="currentColor"
                                        />

                                    </svg>

                                </span>


                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="auth-form"
                        >

                            <div className="auth-field">

                                <label htmlFor="login-email">
                                    Email address
                                </label>


                                <div className="auth-input-wrap">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="auth-input-icon"
                                    >

                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="2.5"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />

                                        <path
                                            d="m4 7 8 6 8-6"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                    </svg>


                                    <input
                                        id="login-email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            <div className="auth-field">

                                <div className="auth-label-row">

                                    <label htmlFor="login-password">
                                        Password
                                    </label>

                                    <span>
                                        Secure sign-in
                                    </span>

                                </div>


                                <div className="auth-input-wrap">

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="auth-input-icon"
                                    >

                                        <rect
                                            x="5"
                                            y="10"
                                            width="14"
                                            height="10"
                                            rx="2"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />

                                        <path
                                            d="M8 10V7a4 4 0 0 1 8 0v3"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                        />

                                    </svg>


                                    <input
                                        id="login-password"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >

                                <span>

                                    {loading
                                        ? "Signing in..."
                                        : "Sign in"
                                    }

                                </span>


                                {!loading && (

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >

                                        <path
                                            d="M5 12h13"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="m13 6 6 6-6 6"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                    </svg>

                                )}

                            </button>

                        </form>


                        <div className="auth-divider">

                            <span>
                                OR
                            </span>

                        </div>


                        <div className="auth-register">

                            <span>
                                Don't have a FinFlow account?
                            </span>


                            <Link to="/register">
                                Create account
                            </Link>

                        </div>


                        <div className="auth-security-note">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                            >

                                <path
                                    d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinejoin="round"
                                />

                            </svg>


                            <span>
                                Your session is protected with
                                secure token-based authentication.
                            </span>

                        </div>

                    </div>

                </div>

            </section>

        </main>

    );

}


export default Login;