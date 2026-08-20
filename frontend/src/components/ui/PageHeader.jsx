import {
    motion,
} from "motion/react";


function PageHeader({
    eyebrow,
    title,
    description,
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

            transition={{
                duration: 0.35,
            }}

            className="
                mb-7
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-end
                sm:justify-between
            "
        >

            <div>

                {eyebrow && (

                    <p
                        className="
                            mb-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-blue-600
                            dark:text-blue-400
                        "
                    >
                        {eyebrow}
                    </p>

                )}


                <h1
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-950
                        sm:text-3xl
                        dark:text-white
                    "
                >
                    {title}
                </h1>


                {description && (

                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {description}
                    </p>

                )}

            </div>


            {action && (

                <div
                    className="shrink-0"
                >
                    {action}
                </div>

            )}

        </motion.div>
    );
}


export default PageHeader;