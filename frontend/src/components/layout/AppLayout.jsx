import {
    useState,
} from "react";

import {
    motion,
} from "motion/react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


function AppLayout({
    children,
}) {

    const [
        collapsed,
        setCollapsed,
    ] = useState(false);


    const [
        mobileOpen,
        setMobileOpen,
    ] = useState(false);


    return (
        <div
            className="
                min-h-screen
                bg-slate-50
                text-slate-900
                dark:bg-slate-950
                dark:text-white
            "
        >

            {/* =================================
                Desktop Sidebar
            ================================= */}

            <div
                className="
                    hidden
                    lg:block
                "
            >

                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={
                        setCollapsed
                    }
                />

            </div>


            {/* =================================
                Mobile Sidebar
            ================================= */}

            {mobileOpen && (

                <>

                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() =>
                            setMobileOpen(
                                false
                            )
                        }
                        className="
                            fixed
                            inset-0
                            z-40
                            bg-slate-950/40
                            backdrop-blur-sm
                            lg:hidden
                        "
                    />


                    <div
                        className="
                            fixed
                            left-0
                            top-0
                            z-50
                            lg:hidden
                        "
                    >

                        <Sidebar
                            collapsed={false}
                            setCollapsed={
                                undefined
                            }
                        />

                    </div>

                </>

            )}


            {/* =================================
                Main Content
            ================================= */}

            <motion.div
                initial={false}
                animate={{
                    marginLeft:
                        collapsed
                            ? 82
                            : 256,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
                className="
                    min-h-screen
                    max-lg:ml-0
                "
            >

                <Topbar
                    onMobileMenu={() =>
                        setMobileOpen(
                            true
                        )
                    }
                />


                <main
                    className="
                        min-h-[calc(100vh-5rem)]
                        px-4
                        py-6
                        sm:px-6
                        sm:py-8
                        lg:px-8
                    "
                >

                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1600px]
                        "
                    >

                        {children}

                    </div>

                </main>

            </motion.div>

        </div>
    );
}


export default AppLayout;