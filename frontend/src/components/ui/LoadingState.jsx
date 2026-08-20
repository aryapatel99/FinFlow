import {
    LoaderCircle,
} from "lucide-react";

import {
    motion,
} from "motion/react";


function LoadingState({
    message = "Loading...",
    fullPage = false,
}) {

    return (
        <div
            className={`
                flex
                items-center
                justify-center
                ${fullPage
                    ? "min-h-[60vh]"
                    : "py-12"
                }
            `}
        >

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
                    gap-3
                    text-center
                "
            >

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                        dark:bg-blue-500/10
                        dark:text-blue-400
                    "
                >

                    <LoaderCircle
                        size={21}
                        className="animate-spin"
                    />

                </div>


                <p
                    className="
                        text-sm
                        font-medium
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    {message}
                </p>

            </motion.div>

        </div>
    );
}


export default LoadingState;