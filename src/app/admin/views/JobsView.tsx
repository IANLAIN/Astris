import React from "react";
import { Briefcase } from "lucide-react";

export default function JobsView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground anim-fade-in">
      <Briefcase className="w-12 h-12 opacity-20" />
      <h2 className="text-xl font-bold">Gestión de Vacantes</h2>
      <p>El módulo avanzado de vacantes estará disponible en la Fase 2.</p>
    </div>
  );
}
