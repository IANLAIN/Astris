import { useState } from "react";
import { Search, Trash2, RotateCcw, Filter, Download } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  completed_onboarding: boolean;
  deleted_at: string | null;
}

interface UsersProps {
  users: UserProfile[];
  onRoleChange: (userId: string, newRole: string) => void;
  onSoftDelete: (userId: string, isDeleted: boolean) => void;
}

export default function UsersView({ users, onRoleChange, onSoftDelete }: UsersProps) {
  const [search, setSearch] = useState("");

  const filtered = users.filter(u => 
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 anim-fade-in flex flex-col h-full">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar por email o nombre..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm"
            />
          </div>
          <button 
            onClick={() => alert("Filtros avanzados en desarrollo")}
            className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-xl font-medium text-sm hover:bg-secondary transition-colors cursor-pointer"
          >
            <Filter size={16} /> Filtros
          </button>
          <button 
            onClick={() => alert("Exportando datos a CSV...")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Onboarding</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(u => (
                <tr key={u.id} className={"hover:bg-muted/30 transition-colors " + (u.deleted_at ? "opacity-50" : "")}>
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {u.full_name?.charAt(0) || "U"}
                    </div>
                    {u.full_name || "Sin Nombre"}
                    {u.deleted_at && <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-bold">DELETED</span>}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role} 
                      onChange={(e) => onRoleChange(u.id, e.target.value)}
                      className="bg-background border border-border rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer"
                    >
                      <option value="candidate">Candidato</option>
                      <option value="company">Empresa</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {u.completed_onboarding 
                      ? <span className="text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-bold">Completado</span>
                      : <span className="text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-2.5 py-1 rounded-full text-xs font-bold">Pendiente</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => alert(`Detalles de ${u.full_name || 'usuario'}`)}
                      className="text-primary hover:underline font-medium text-sm cursor-pointer mr-4"
                    >
                      Detalles
                    </button>
                    <button 
                      onClick={() => onSoftDelete(u.id, !u.deleted_at)}
                      className={"p-2 rounded-lg transition-colors cursor-pointer " + (u.deleted_at ? "hover:bg-blue-500/10 text-blue-500" : "hover:bg-destructive/10 text-destructive")}
                      title={u.deleted_at ? "Restaurar usuario" : "Eliminar usuario (Soft Delete)"}
                    >
                      {u.deleted_at ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
