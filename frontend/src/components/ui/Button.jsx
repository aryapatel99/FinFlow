import {
    Loader2,
} from "lucide-react";

import {
    motion,
} from "motion/react";


function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon: Icon,
    onClick,
    className = "",
}) {

    const variants = {

        primary:
            "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",

        secondary:
            "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",

        outline:
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",

        danger:
            "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700",

        ghost:
            "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",

        success:
            "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700",

    };


    const sizes = {

        sm:
            "h-9 px-3 text-sm rounded-lg",

        md:
            "h-10 px-4 text-sm rounded-xl",

        lg:
            "h-12 px-5 text-base rounded-xl",

    };


    return (
        <motion.button

            type={type}

            onClick={onClick}

            disabled={
                disabled ||
                loading
            }

            whileHover={
                !disabled && !loading
                    ? {
                        y: -1,
                    }
                    : {}
            }

            whileTap={
                !disabled && !loading
                    ? {
                        scale: 0.98,
                    }
                    : {}
            }

            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                font-medium
                transition-all
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/30
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}

        >

            {loading && (
                <Loader2
                    size={17}
                    className="animate-spin"
                />
            )}

            {!loading && Icon && (
                <Icon
                    size={17}
                />
            )}

            {children}

        </motion.button>
    );
}


export default Button;