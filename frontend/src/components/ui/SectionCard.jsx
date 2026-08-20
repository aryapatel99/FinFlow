import {
    ChevronRight,
} from "lucide-react";

import Card from "./Card";


function SectionCard({
    title,
    description,
    icon: Icon,
    action,
    children,
    className = "",
}) {

    return (
        <Card
            className={className}
        >

            {(title || Icon || action) && (

                <div
                    className="
                        mb-5
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        {Icon && (

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                    dark:bg-blue-500/10
                                    dark:text-blue-400
                                "
                            >
                                <Icon
                                    size={19}
                                />
                            </div>

                        )}


                        <div>

                            {title && (

                                <h2
                                    className="
                                        text-base
                                        font-semibold
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    {title}
                                </h2>

                            )}


                            {description && (

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                        dark:text-slate-400
                                    "
                                >
                                    {description}
                                </p>

                            )}

                        </div>

                    </div>


                    {action && (

                        <button
                            type="button"
                            onClick={action.onClick}
                            className="
                                inline-flex
                                items-center
                                gap-1
                                text-sm
                                font-medium
                                text-blue-600
                                transition
                                hover:text-blue-700
                                dark:text-blue-400
                            "
                        >

                            {action.label}

                            <ChevronRight
                                size={16}
                            />

                        </button>

                    )}

                </div>

            )}


            {children}

        </Card>
    );
}


export default SectionCard;