function PaymentStatus({ status }) {

    const normalizedStatus =
        status?.toUpperCase() || "UNKNOWN";


    const statusLabels = {

        PENDING: "Pending",

        PROCESSING: "Processing",

        COMPLETED: "Completed",

        FAILED: "Failed",

    };


    return (
        <span>
            {statusLabels[normalizedStatus] ||
                normalizedStatus}
        </span>
    );
}


export default PaymentStatus;