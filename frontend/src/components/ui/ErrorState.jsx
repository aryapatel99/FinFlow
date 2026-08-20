import {
    AlertTriangle,
    RefreshCw,
} from "lucide-react";

import {
    motion,
} from "motion/react";


function ErrorState({
    title = "Something went wrong",
    message = "We couldn't load this information.",
    onRetry,
}) {

    return (
        <motion.div

            initial={{
                opacity: 0,
            }}

            animate={{
                opacity: 1,
            }}

            className="
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-red-100
                bg-red-50/60
                px-6
                py-12
                text-center
                dark:border-red-900/40
                dark:bg-red-950/20
            "
        >

            <div
                className="
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-100
                    text-red-600
                    dark:bg-red-500/10
                    dark:text-red-400
                "
            >

                <AlertTriangle
                    size={22}
                />

            </div>


            <h3
                className="
                    text-sm
                    font-semibold
                    text-red-900
                    dark:text-red-300
                "
            >
                {title}
            </h3>


            <p
                className="
                    mt-1
                    max-w-md
                    text-sm
                    leading-6
                    text-red-700/80
                    dark:text-red-400/80
                "
            >
                {message}
            </p>


            {onRetry && (

                <button

                    type="button"

                    onClick={onRetry}

                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-red-600
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-red-700
                    "
                >

                    <RefreshCw
                        size={16}
                    />

                    Try Again

                </button>

            )}

        </motion.div>
    );
}


export default ErrorState;