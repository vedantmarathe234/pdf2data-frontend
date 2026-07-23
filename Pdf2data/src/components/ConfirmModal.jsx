import { HiOutlineExclamation } from "react-icons/hi";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            danger
              ? "bg-red-50 dark:bg-red-500/10 text-red-500"
              : "bg-indigo-50 dark:bg-indigo-500/10 text-[#6139ff]"
          }`}
        >
          <HiOutlineExclamation size={22} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        {message && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">
            {message}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#6139ff] hover:bg-indigo-700"
            }`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
