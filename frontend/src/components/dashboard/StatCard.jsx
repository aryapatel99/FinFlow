import {
    motion,
} from "motion/react";


function StatCard({
    title,
    value,
    description,
    icon: Icon,
    delay = 0,
    positive = false,
}) {

    return (
        <motion.div
            className="dashboard-stat-card"
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.4,
                delay,
            }}
            whileHover={{
                y: -3,
            }}
        >

            <div className="stat-card-top">

                <div className="stat-icon">

                    <Icon
                        size={19}
                        strokeWidth={2}
                    />

                </div>

            </div>


            <div className="stat-value">
                {value}
            </div>


            <div className="stat-title">
                {title}
            </div>


            <div
                className={
                    positive
                        ? "stat-description positive"
                        : "stat-description"
                }
            >

                {description}

            </div>

        </motion.div>
    );
}


export default StatCard;