import React, { createContext, useContext, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (title: string, description?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig = {
  success: {
    bg: "bg-slate-900/95 border-l-4 border-l-emerald-500",
    border: "border border-emerald-500/30",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    titleColor: "text-slate-50",
    descColor: "text-slate-300",
  },
  error: {
    bg: "bg-slate-900/95 border-l-4 border-l-red-500",
    border: "border border-red-500/30",
    icon: AlertCircle,
    iconColor: "text-red-500",
    titleColor: "text-slate-50",
    descColor: "text-slate-300",
  },
  info: {
    bg: "bg-slate-900/95 border-l-4 border-l-blue-500",
    border: "border border-blue-500/30",
    icon: Info,
    iconColor: "text-blue-400",
    titleColor: "text-slate-50",
    descColor: "text-slate-300",
  },
  warning: {
    bg: "bg-slate-900/95 border-l-4 border-l-red-500",
    border: "border border-red-500/30",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    titleColor: "text-slate-50",
    descColor: "text-slate-300",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    title: string,
    description?: string,
    type: ToastType = "info"
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, title, description, type };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Notifications (top-right) */}
      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className="pointer-events-auto"
              style={{
                animation:
                  "slideInFromTopRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <div
                className={`${config.bg} ${config.border} border rounded-xl shadow-lg backdrop-blur-sm p-4 max-w-sm w-full hover:shadow-xl transition-all duration-200`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${config.titleColor}`}>
                      {toast.title}
                    </p>
                    {toast.description && (
                      <p
                        className={`text-xs ${config.descColor} mt-1 leading-snug`}
                      >
                        {toast.description}
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes slideInFromTopRight {
          from {
            opacity: 0;
            transform: translateX(100px) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
