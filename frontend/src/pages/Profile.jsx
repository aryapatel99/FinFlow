import {
    useEffect,
    useState,
} from "react";

import {
    getMyProfile,
} from "../services/api";


function Profile() {

    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {

        const loadProfile =
            async () => {

                try {

                    const data =
                        await getMyProfile();

                    setProfile(data);

                } catch (err) {

                    setError(
                        err.response?.data?.detail ||
                        "Unable to load profile."
                    );

                } finally {

                    setLoading(false);

                }

            };

        loadProfile();

    }, []);


    if (loading) {

        return (
            <div>
                Loading profile...
            </div>
        );

    }


    if (error) {

        return (
            <div>
                {error}
            </div>
        );

    }


    return (
        <div>

            <h1>My Profile</h1>

            {profile && (

                <div>

                    <p>
                        <strong>Name:</strong>{" "}
                        {profile.full_name}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {profile.email}
                    </p>

                    <p>
                        <strong>Role:</strong>{" "}
                        {profile.role}
                    </p>

                    <p>
                        <strong>User ID:</strong>{" "}
                        {profile.user_id}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                            profile.created_at
                        ).toLocaleString()}
                    </p>

                </div>

            )}

        </div>
    );
}


export default Profile;