import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0b1f3a] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xl border border-cyan-400/30 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {message}
    </div>
  );
};
