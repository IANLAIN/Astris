import React from "react";

export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 anim-overlay" style={{ backgroundColor: "rgba(26,26,46,0.72)" }} role="dialog" aria-modal="true">
      <div className="anim-modal w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
