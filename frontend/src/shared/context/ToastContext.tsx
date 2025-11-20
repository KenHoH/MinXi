import React, { createContext, useContext, useState } from "react";

interface ToastContextType {
  showToast: (text: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (text: string) => {
    setMessage(text);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setMessage(""), 300);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {isVisible && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-700 max-w-xs">
            <p className="font-medium text-sm">{message}</p>
          </div>
        </div>
      )}
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
