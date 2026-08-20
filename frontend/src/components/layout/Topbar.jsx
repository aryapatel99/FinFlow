import {
    Bell,
    Search,
    Menu,
} from "lucide-react";

import {
    useAuth,
} from "../../context/AuthContext";


function Topbar({
    onMobileMenu,
}) {

    const {
        user,
    } = useAuth();


    const displayName =
        user?.email
            ? user.email.split("@")[0]
            : "User";


    const initial =
        displayName
            ?.charAt(0)
            ?.toUpperCase() || "U";


    return (
        <header
            className="
                sticky
                top-0
                z-30
                flex
                h-20
                items-center
                justify-between
                border-b
                border-slate-200
                bg-white/90
                px-4
                backdrop-blur-xl
                sm:px-6
                lg:px-8
                dark:border-slate-800
                dark:bg-slate-950/90
            "
        >

            {/* ==============================
                Left
            =============================== */}

            <div
                className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                "
            >

                <button
                    type="button"
                    onClick={onMobileMenu}
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-500
                        hover:bg-slate-100
                        lg:hidden
                        dark:text-slate-400
                        dark:hover:bg-slate-900
                    "
                >

                    <Menu
                        size={21}
                    />

                </button>


                <div
                    className="
                        hidden
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3
                        py-2
                        sm:flex
                        md:w-64
                        lg:w-80
                        dark:border-slate-800
                        dark:bg-slate-900
                    "
                >

                    <Search
                        size={17}
                        className="
                            shrink-0
                            text-slate-400
                        "
                    />

                    <input
                        type="search"
                        placeholder="Search..."
                        className="
                            w-full
                            bg-transparent
                            text-sm
                            text-slate-700
                            outline-none
                            placeholder:text-slate-400
                            dark:text-slate-200
                        "
                    />

                    <span
                        className="
                            hidden
                            rounded-md
                            border
                            border-slate-200
                            bg-white
                            px-1.5
                            py-0.5
                            text-[10px]
                            font-medium
                            text-slate-400
                            md:inline-block
                            dark:border-slate-700
                            dark:bg-slate-800
                        "
                    >
                        /
                    </span>

                </div>

            </div>


            {/* ==============================
                Right
            =============================== */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                    sm:gap-3
                "
            >

                <button
                    type="button"
                    className="
                        relative
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-500
                        transition
                        hover:bg-slate-100
                        hover:text-slate-900
                        dark:text-slate-400
                        dark:hover:bg-slate-900
                        dark:hover:text-white
                    "
                >

                    <Bell
                        size={19}
                    />

                    <span
                        className="
                            absolute
                            right-2.5
                            top-2
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-red-500
                            ring-2
                            ring-white
                            dark:ring-slate-950
                        "
                    />

                </button>


                <div
                    className="
                        h-8
                        w-px
                        bg-slate-200
                        dark:bg-slate-800
                    "
                />


                <button
                    type="button"
                    className="
                        flex
                        items-center
                        gap-2.5
                        rounded-xl
                        p-1.5
                        pr-2
                        transition
                        hover:bg-slate-100
                        dark:hover:bg-slate-900
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-slate-900
                            text-xs
                            font-bold
                            text-white
                        "
                    >
                        {initial}
                    </div>


                    <div
                        className="
                            hidden
                            min-w-0
                            text-left
                            sm:block
                        "
                    >

                        <p
                            className="
                                max-w-28
                                truncate
                                text-xs
                                font-semibold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            {displayName}
                        </p>

                        <p
                            className="
                                text-[10px]
                                font-medium
                                capitalize
                                text-slate-400
                            "
                        >
                            {user?.role || "customer"}
                        </p>

                    </div>

                </button>

            </div>

        </header>
    );
}


export default Topbar;