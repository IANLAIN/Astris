import React, { useEffect } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface OverlayProps {
  children: React.ReactNode;
  /** Etiqueta accesible para el diálogo (leída por lectores de pantalla) */
  label?: string;
  /** Callback de cierre al presionar Escape o clic en el fondo */
  onClose?: () => void;
}

/** Overlay de modal con focus trap completo, soporte Escape y atributos ARIA. */
export function Overlay({ children, label, onClose }: OverlayProps) {
  const trapRef = useFocusTrap(onClose);

  // Bloquea el scroll del body mientras el modal está abierto
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 anim-overlay"
      style={{ backgroundColor: "rgba(26,26,46,0.72)" }}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={handleBackdropClick}
    >
      <div ref={trapRef} className="anim-modal w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
