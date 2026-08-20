import {
    useEffect,
    useState,
} from "react";

import {
    User,
    Mail,
    ShieldCheck,
    Fingerprint,
    LockKeyhole,
    CheckCircle2,
    ArrowUpRight,
    Copy,
} from "lucide-react";

import AppShell from "../components/AppShell";

import {
    getAccount,
} from "../services/api";

import {
    useAuth,
} from "../context/AuthContext";

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
                part
                    .charAt(0)
                    .toUpperCase()
        )
        .join("");
}


function Profile() {

    const {
        user,
    } = useAuth();


    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [copied, setCopied] =
        useState(false);


    useEffect(() => {

        let mounted = true;


        const loadProfile =
            async () => {

                try {

                    setLoading(true);
                    setError("");

                    const data =
                        await getAccount();

                    if (!mounted) {
                        return;
                    }

                    setProfile(data);

                } catch (error) {

                    if (!mounted) {
                        return;
                    }

                    setError(
                        error?.response?.data?.detail ||
                        "Unable to load your profile."
                    );

                } finally {

                    if (mounted) {
                        setLoading(false);
                    }
                }
            };


        loadProfile();


        return () => {
            mounted = false;
        };

    }, []);


    const currentProfile =
        profile || user || {};


    const accountId =
        currentProfile?.user_id ||
        currentProfile?.id ||
        "Not available";


    const fullName =
        currentProfile?.full_name ||
        currentProfile?.name ||
        "FinFlow User";


    const email =
        currentProfile?.email ||
        "No email available";


    const role =
        currentProfile?.role ||
        "customer";


    const handleCopyId =
        async () => {

            if (
                !accountId ||
                accountId === "Not available"
            ) {
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    String(accountId)
                );

                setCopied(true);

                setTimeout(
                    () => setCopied(false),
                    1800
                );

            } catch {
                // Clipboard access can be blocked by browser permissions.
            }
        };


    if (loading) {

        return (
            <AppShell>

                <main className="ff-premium-page">

                    <div className="ff-profile-loading">

                        <div className="ff-loading-orb">
                            <User size={26} />
                        </div>

                        <div>

                            <h3>
                                Loading your profile
                            </h3>

                            <p>
                                Securely retrieving your FinFlow account.
                            </p>

                        </div>

                    </div>

                </main>

            </AppShell>
        );
    }


    return (
        <AppShell>

            <main className="ff-premium-page">

                {/* =================================
                    HEADER
                ================================= */}

                <header className="ff-page-header">

                    <div className="ff-page-header-copy">

                        <div className="ff-eyebrow">

                            <span className="ff-eyebrow-dot" />

                            ACCOUNT

                        </div>

                        <h1>
                            Your Profile
                        </h1>

                        <p>
                            Manage your FinFlow identity,
                            account information and security.
                        </p>

                    </div>


                    <div className="ff-profile-header-status">

                        <div className="ff-live-dot" />

                        Account active

                    </div>

                </header>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="ff-message error">

                        {error}

                    </div>

                )}


                {/* =================================
                    PROFILE HERO
                ================================= */}

                <section className="ff-profile-overview">

                    <div className="ff-profile-overview-glow" />


                    <div className="ff-profile-main">

                        <div className="ff-profile-avatar-large">

                            {getInitials(
                                fullName,
                                email
                            )}

                        </div>


                        <div className="ff-profile-main-copy">

                            <div className="ff-profile-name-row">

                                <h2>
                                    {fullName}
                                </h2>

                                <span className="ff-role-pill">
                                    {role}
                                </span>

                            </div>

                            <p className="ff-profile-email">
                                <Mail size={15} />
                                {email}
                            </p>

                            <div className="ff-profile-trust">

                                <CheckCircle2 size={15} />

                                Verified FinFlow account

                            </div>

                        </div>

                    </div>


                    <div className="ff-profile-overview-stats">

                        <div>

                            <span>
                                ACCESS
                            </span>

                            <strong>
                                Authenticated
                            </strong>

                        </div>


                        <div>

                            <span>
                                PLATFORM
                            </span>

                            <strong>
                                FinFlow
                            </strong>

                        </div>


                        <div>

                            <span>
                                ROLE
                            </span>

                            <strong>
                                {role}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =================================
                    MAIN GRID
                ================================= */}

                <div className="ff-account-layout">


                    {/* =================================
                        LEFT
                    ================================= */}

                    <section>


                        {/* PERSONAL INFORMATION */}

                        <div className="ff-panel ff-form-card">

                            <div className="ff-form-card-header">

                                <div className="ff-form-card-icon">
                                    <User size={20} />
                                </div>

                                <div>

                                    <h2>
                                        Personal information
                                    </h2>

                                    <p>
                                        Information associated with
                                        your FinFlow account.
                                    </p>

                                </div>

                            </div>


                            <div className="ff-form-grid">


                                <div className="ff-form-field">

                                    <label>
                                        Full name
                                    </label>

                                    <div className="ff-profile-readonly">

                                        <User size={17} />

                                        <span>
                                            {fullName}
                                        </span>

                                    </div>

                                </div>


                                <div className="ff-form-field">

                                    <label>
                                        Login email
                                    </label>

                                    <div className="ff-profile-readonly">

                                        <Mail size={17} />

                                        <span>
                                            {email}
                                        </span>

                                    </div>

                                </div>


                            </div>

                        </div>


                        {/* ACCOUNT IDENTITY */}

                        <div className="ff-panel ff-form-card">

                            <div className="ff-form-card-header">

                                <div className="ff-form-card-icon">

                                    <Fingerprint size={20} />

                                </div>

                                <div>

                                    <h2>
                                        Account identity
                                    </h2>

                                    <p>
                                        Your unique FinFlow account
                                        identification details.
                                    </p>

                                </div>

                            </div>


                            <div className="ff-identity-box">

                                <div className="ff-identity-icon">

                                    <Fingerprint size={21} />

                                </div>


                                <div className="ff-identity-content">

                                    <span>
                                        ACCOUNT ID
                                    </span>

                                    <strong>
                                        {accountId}
                                    </strong>

                                </div>


                                <button
                                    type="button"
                                    className="ff-icon-action"
                                    onClick={handleCopyId}
                                    title="Copy account ID"
                                >

                                    {copied ? (
                                        <CheckCircle2 size={17} />
                                    ) : (
                                        <Copy size={17} />
                                    )}

                                </button>

                            </div>


                            <div className="ff-form-grid">


                                <div className="ff-form-field">

                                    <label>
                                        Account role
                                    </label>

                                    <div className="ff-profile-readonly">

                                        <ShieldCheck size={17} />

                                        <span>
                                            {role}
                                        </span>

                                    </div>

                                </div>


                                <div className="ff-form-field">

                                    <label>
                                        Authentication
                                    </label>

                                    <div className="ff-profile-readonly">

                                        <CheckCircle2 size={17} />

                                        <span>
                                            Secure session
                                        </span>

                                    </div>

                                </div>


                            </div>

                        </div>

                    </section>


                    {/* =================================
                        RIGHT SIDEBAR
                    ================================= */}

                    <aside className="ff-profile-side">


                        {/* SECURITY CARD */}

                        <div className="ff-panel ff-profile-security-card">

                            <div className="ff-profile-security-icon">

                                <LockKeyhole size={22} />

                            </div>


                            <div className="ff-security-label">
                                SECURITY
                            </div>


                            <h2>
                                Keep your account protected.
                            </h2>


                            <p>
                                Manage your password and
                                authentication controls from
                                the dedicated security center.
                            </p>


                            <a
                                href="/change-password"
                                className="ff-primary-btn ff-profile-security-btn"
                            >

                                <ShieldCheck size={17} />

                                Security Settings

                                <ArrowUpRight size={17} />

                            </a>

                        </div>


                        {/* ACCOUNT STATUS */}

                        <div className="ff-panel ff-account-status-card">

                            <div className="ff-status-heading">

                                <div className="ff-status-check">

                                    <CheckCircle2 size={19} />

                                </div>

                                <div>

                                    <h3>
                                        Account status
                                    </h3>

                                    <p>
                                        Current account state
                                    </p>

                                </div>

                            </div>


                            <div className="ff-account-status">

                                <span className="ff-live-dot" />

                                <div>

                                    <strong>
                                        Active
                                    </strong>

                                    <span>
                                        Your FinFlow account is
                                        ready to use.
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* PRIVACY */}

                        <div className="ff-panel ff-privacy-card">

                            <ShieldCheck size={19} />

                            <div>

                                <strong>
                                    Your information is protected
                                </strong>

                                <p>
                                    FinFlow uses authenticated
                                    sessions to protect access
                                    to your account and payments.
                                </p>

                            </div>

                        </div>


                    </aside>

                </div>

            </main>

        </AppShell>
    );
}


export default Profile;