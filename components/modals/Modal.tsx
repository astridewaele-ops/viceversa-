"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ title, onClose, children, wide = false }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 animate-fadeIn overflow-y-auto"
      style={{ backgroundColor: "rgba(20,20,18,0.4)" }}
    >
      <div
        className={`w-full ${wide ? "max-w-2xl" : "max-w-md"} relative my-8`}
        style={{ backgroundColor: "#fafaf8", border: "1px solid #d8d8d0" }}
      >
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "#e8e8e3" }}
        >
          <div className="cargo-mono" style={{ color: "#111" }}>
            {title}
          </div>
          <button
            onClick={onClose}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
