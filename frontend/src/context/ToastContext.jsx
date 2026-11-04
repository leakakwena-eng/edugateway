import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (type, title, body = "") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, type, title, body }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove]
  );

  const toast = useMemo(
    () => ({
      success: (title, body) => push("success", title, body),
      error: (title, body) => push("error", title, body),
      warning: (title, body) => push("warning", title, body),
      info: (title, body) => push("info", title, body),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 sm:max-w-sm sm:w-full pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const CONFIG = {
  success: { Icon: CheckCircle2, tile: "bg-brand-50 text-brand-600", bar: "bg-brand-500" },
  error: { Icon: XCircle, tile: "bg-rose-50 text-rose-600", bar: "bg-rose-500" },
  warning: { Icon: AlertTriangle, tile: "bg-sun-50 text-sun-600", bar: "bg-sun-500" },
  info: { Icon: Info, tile: "bg-sky-50 text-sky-600", bar: "bg-sky-500" },
};

function Toast({ toast, onClose }) {
  const { Icon, tile, bar } = CONFIG[toast.type];
  return (
    <div className="pointer-events-auto relative bg-white rounded-2xl shadow-lift border border-stone-200/80 overflow-hidden animate-slide-in">
      <div className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <div className="flex items-start gap-3 p-4 pl-5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tile}`}>
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="text-sm font-semibold text-stone-900">{toast.title}</div>
          {toast.body && <div className="text-xs text-stone-500 mt-0.5">{toast.body}</div>}
        </div>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-600 shrink-0" aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
