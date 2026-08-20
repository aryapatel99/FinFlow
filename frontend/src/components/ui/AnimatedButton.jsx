import {
    LoaderCircle,
} from "lucide-react";

import {
    motion,
} from "motion/react";

function AnimatedButton({
    children,
    type = "button",
    onClick,
    disabled = false,
    loading = false,
    variant = "primary",
    icon: Icon,
    className = "",
}) {
    const variants = {
        primary:
            "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10",

        secondary:
            "bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50",

        danger:
            "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/10",

        success:
            "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/10",
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
                disabled || loading
                    ? {}
                    : {
                          y: -1,
                      }
            }
            whileTap={
                disabled || loading
                    ? {}
                    : {
                          scale: 0.98,
                      }
            }
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant] || variants.primary} ${className}`}
        >
            {loading ? (
                <LoaderCircle
                    size={17}
                    className="animate-spin"
                />
            ) : (
                Icon && (
                    <Icon
                        size={17}
                    />
                )
            )}

            {children}
        </motion.button>
    );
}

export default AnimatedButton;