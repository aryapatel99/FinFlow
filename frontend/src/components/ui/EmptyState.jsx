import {
    FileText,
} from "lucide-react";

import {
    motion,
} from "motion/react";


function EmptyState({
    icon: Icon = FileText,
    title = "Nothing here yet",
    description = "There is no information to display.",
    action,
}) {

    return (
        <motion.div

            initial={{
                opacity: 0,
                y: 8,
            }}

            animate={{
                opacity: 1,
                y: 0,
            }}

            className="
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-slate-200
                bg-slate-50/70
                px-6
                py-14
                text-center
                dark:border-slate-800
                dark:bg-slate-900/50
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
                    bg-white
                    text-slate-400
                    shadow-sm
                    dark:bg-slate-800
                    dark:text-slate-500
                "
            >

                <Icon
                    size={22}
                />

            </div>


            <h3
                className="
                    text-sm
                    font-semibold
                    text-slate-900
                    dark:text-white
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
                    text-slate-500
                    dark:text-slate-400
                "
            >
                {description}
            </p>


            {action && (

                <div
                    className="mt-5"
                >
                    {action}
                </div>

            )}

        </motion.div>
    );
}


export default EmptyState;