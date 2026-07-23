import {
    HiOutlineHome,
    HiOutlineCollection,
    HiOutlineClock,
    HiOutlineCog,
} from "react-icons/hi";

import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const menus = [
    {
        name: "Home",
        icon: HiOutlineHome,
        path: "/dashboard",
    },
    {
        name: "Extractions",
        icon: HiOutlineCollection,
        path: "/extractions",
    },
    {
        name: "History",
        icon: HiOutlineClock,
        path: "/history",
    },
    {
        name: "Settings",
        icon: HiOutlineCog,
        path: "/settings",
    },
];

export default function Sidebar() {

    const location = useLocation();

    return (
        <aside className="w-[280px] border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen">

            <div className="px-8 py-8 flex items-center gap-3">

                <img
                    src={logo}
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                />

                <h1 className="text-[28px] font-bold dark:text-white">
                    PDF<span className="text-[#6139ff]">2DATA</span>
                </h1>

            </div>

            <div className="px-4 space-y-2">

                {menus.map((item) => {

                    const Icon = item.icon;

                    const active = location.pathname === item.path;

                    return (

                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all
              ${
                                active
                                    ? "bg-gradient-to-r from-[#6139ff] to-[#805af5] text-white"
                                    : "text-gray-600 hover:bg-indigo-50 hover:text-[#6139ff]"
                            }`}
                        >

                            <Icon
                                size={20}
                                className={active ? "text-white" : "text-gray-500"}
                            />

                            {item.name}

                        </Link>

                    );

                })}

            </div>

        </aside>
    );
}