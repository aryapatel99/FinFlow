import {
    motion,
} from "motion/react";


function AnimatedPage({
    children,
    className = "",
}) {

    return (
        <motion.main

            initial={{
                opacity: 0,
                y: 10,
            }}

            animate={{
                opacity: 1,
                y: 0,
            }}

            transition={{
                duration: 0.3,
                ease: "easeOut",
            }}

            className={`
                mx-auto
                w-full
                max-w-7xl
                px-4
                py-6
                sm:px-6
                lg:px-8
                ${className}
            `}
        >

            {children}

        </motion.main>
    );
}


export default AnimatedPage;