import { motion } from "motion/react";

function PremiumCard({
    children,
    className = "",
    hover = true,
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            whileHover={
                hover
                    ? {
                          y: -2,
                      }
                    : undefined
            }
            transition={{
                duration: 0.25,
            }}
            className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ${
                hover
                    ? "transition-shadow duration-200 hover:shadow-lg"
                    : ""
            } ${className}`}
        >
            {children}
        </motion.div>
    );
}

export default PremiumCard;