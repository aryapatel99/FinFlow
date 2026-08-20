import {
    motion,
} from "motion/react";


function Card({
    children,
    className = "",
    hover = false,
    padding = "p-5",
}) {

    const content = (
        <div
            className={`
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
                ${padding}
                ${className}
            `}
        >
            {children}
        </div>
    );


    if (!hover) {
        return content;
    }


    return (
        <motion.div
            whileHover={{
                y: -3,
            }}
            transition={{
                duration: 0.2,
            }}
        >
            {content}
        </motion.div>
    );
}


export default Card;