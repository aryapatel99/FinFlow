import { useAuth } from "../context/AuthContext";


function Dashboard() {

    const {
        user,
        logout,
    } = useAuth();


    return (
        <div>

            <h1>
                FinFlow Dashboard
            </h1>


            <h2>
                Welcome, {user?.email}
            </h2>


            <p>
                User ID: {user?.user_id}
            </p>


            <p>
                Role: {user?.role}
            </p>


            <button
                onClick={logout}
            >
                Logout
            </button>

        </div>
    );
}


export default Dashboard;