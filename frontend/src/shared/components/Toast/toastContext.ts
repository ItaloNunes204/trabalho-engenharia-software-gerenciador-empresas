import { createContext } from "react";

export interface ToastValue {
    showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastValue | null>(null);
