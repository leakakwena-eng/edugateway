import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, title, body = "") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, title, body }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const toast = {
    success: (title, body) => push("success", title, body),
    error: (title, body) => push("error", title, body),
    warning: (title, body) => push("warning", title, body),
    info: (title, body) => push("info", title, body),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onClose }) {
  const config = {
    success: { Icon: CheckCircle2, bar: "bg-green-500", text: "text-green-600" },
    error: { Icon: XCircle, bar: "bg-red-500", text: "text-red-600" },
    warning: { Icon: AlertTriangle, bar: "bg-amber-500", text: "text-amber-600" },
    info: { Icon: Info, bar: "bg-blue-500", text: "text-blue-600" },
  }[toast.type];

  const { Icon } = config;

  return (
    <div className="pointer-events-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in">
      <div className="flex items-start gap-3 p-4">
        <Icon size={20} className={`${config.text} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800">{toast.title}</div>
          {toast.body && <div className="text-xs text-slate-500 mt-0.5">{toast.body}</div>}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 shrink-0">
          <X size={16} />
        </button>
      </div>
      <div className={`h-1 ${config.bar}`} />
    </div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};