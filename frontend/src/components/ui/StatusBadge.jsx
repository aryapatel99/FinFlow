import {
    CheckCircle2,
    Clock3,
    XCircle,
    LoaderCircle,
    CircleAlert,
} from "lucide-react";


function StatusBadge({
    status,
}) {

    const normalized =
        String(
            status || ""
        ).toUpperCase();


    const configurations = {

        COMPLETED: {
            label: "Completed",
            className:
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400",
            icon: CheckCircle2,
        },

        PAID: {
            label: "Paid",
            className:
                "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400",
            icon: CheckCircle2,
        },

        PENDING: {
            label: "Pending",
            className:
                "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400",
            icon: Clock3,
        },

        PROCESSING: {
            label: "Processing",
            className:
                "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400",
            icon: LoaderCircle,
        },

        FAILED: {
            label: "Failed",
            className:
                "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400",
            icon: XCircle,
        },

        CANCELLED: {
            label: "Cancelled",
            className:
                "bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400",
            icon: CircleAlert,
        },

    };


    const config =
        configurations[normalized] || {

            label:
                status || "Unknown",

            className:
                "bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400",

            icon: CircleAlert,

        };


    const Icon =
        config.icon;


    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ring-1
                ring-inset
                ${config.className}
            `}
        >

            <Icon
                size={13}
                className={
                    normalized === "PROCESSING"
                        ? "animate-spin"
                        : ""
                }
            />

            {config.label}

        </span>
    );
}


export default StatusBadge;