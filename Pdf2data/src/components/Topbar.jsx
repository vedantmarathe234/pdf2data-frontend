import {
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineChevronDown,
} from "react-icons/hi";

export default function Topbar({ dark, setDark }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center dark:bg-slate-900 p-8 transition-colors border-b border-gray-300 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Home
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 font-medium">
            Dashboard
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div
            onClick={() => setDark(!dark)}
            className="relative flex items-center w-[74px] h-[38px] rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-1 cursor-pointer"
          >
            <div
              className={`absolute top-1 h-[30px] w-[30px] rounded-full bg-gray-100 dark:bg-slate-700 shadow-sm transition-all duration-300 ${
                dark ? "translate-x-[34px]" : "translate-x-0"
              }`}
            />

            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineSun
                size={18}
                className={!dark ? "text-gray-900" : "text-gray-400"}
              />
            </div>

            <div className="relative z-10 flex-1 flex justify-center">
              <HiOutlineMoon
                size={18}
                className={dark ? "text-white" : "text-gray-400"}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#6139ff] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              D
            </div>
            <div className="hidden sm:block text-left">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                Stavan@123.com
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
            <HiOutlineChevronDown size={16} className="text-gray-400 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
