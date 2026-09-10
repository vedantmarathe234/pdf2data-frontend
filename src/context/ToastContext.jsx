import { createContext, useCallback, useContext, useRef, useState } from "react";
import { HiCheckCircle, HiExclamationCircle, HiXCircle, HiX } from "react-icons/hi";

const ToastContext = createContext(null);

const STYLES = {
  success: {
    icon: HiCheckCircle,
    iconClass: "text-emerald-500",
    barClass: "bg-emerald-500",
  },
  error: {
    icon: HiXCircle,
    iconClass: "text-red-500",
    barClass: "bg-red-500",
  },
  info: {
    icon: HiExclamationCircle,
    iconClass: "text-indigo-500",
    barClass: "bg-indigo-500",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-[320px]">
        {toasts.map((t) => {
          const style = STYLES[t.type];
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              className="animate-toastIn relative overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg p-4 pr-9 flex items-start gap-3"
            >
              <div className={`absolute left-0 top-0 h-full w-1 ${style.barClass}`} />
              <Icon size={20} className={`${style.iconClass} shrink-0 mt-0.5`} />
              <p className="text-sm text-gray-800 dark:text-slate-200 leading-snug">
                {t.message}
              </p>
              <button
                onClick={() => remove(t.id)}
                className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 dark:hover:text-slate-300"
              >
                <HiX size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
