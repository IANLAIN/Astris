import React, { useEffect } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface OverlayProps {
  children: React.ReactNode;
  label?: string;
  onClose?: () => void;
}

export function Overlay({ children, label, onClose }: OverlayProps) {
  const trapRef = useFocusTrap(onClose);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClose && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto py-4"
      style={{ backgroundColor: "rgba(26,26,46,0.72)" }}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={handleBackdropClick}
    >
      <div ref={trapRef} className="anim-modal min-h-full flex items-center justify-center p-3 sm:p-6">
        {children}
      </div>
    </div>
  );
}
