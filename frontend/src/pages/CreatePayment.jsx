import {
    Link,
} from "react-router-dom";

import PaymentForm from "../components/PaymentForm";


function CreatePayment() {

    return (
        <div>

            <h1>
                FinFlow
            </h1>


            <Link to="/dashboard">
                Dashboard
            </Link>


            {" | "}


            <Link to="/payments">
                My Payments
            </Link>


            <hr />


            <PaymentForm />

        </div>
    );
}


export default CreatePayment;