import { 
  Users, Building2, Briefcase, Star, Activity,
  TrendingUp, Download, Filter, Check
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

type Lang = "es" | "en" | "pt" | "fr";

export function AdminPanel({ screen }: { lang: Lang; screen: string }) {
  // En un escenario real, estos datos vendrían de Supabase (users_profiles, jobs, applications)
  const mockStats = [
    { title: "Total Candidatos", value: "1,245", growth: "+12%", icon: Users, color: "#1B4B7A" },
    { title: "Total Empresas", value: "84", growth: "+5%", icon: Building2, color: "#2E7D32" },
    { title: "Mentorías Activas", value: "312", growth: "+18%", icon: Star, color: "#B8860B" },
    { title: "Matches Exitosos", value: "892", growth: "+24%", icon: Briefcase, color: "#4A148C" },
  ];

  const chartData = [
    { name: "Ene", candidatos: 400, empresas: 24, matches: 150 },
    { name: "Feb", candidatos: 550, empresas: 28, matches: 210 },
    { name: "Mar", candidatos: 680, empresas: 35, matches: 280 },
    { name: "Abr", candidatos: 820, empresas: 42, matches: 390 },
    { name: "May", candidatos: 1050, empresas: 58, matches: 510 },
    { name: "Jun", candidatos: 1245, empresas: 84, matches: 892 },
  ];

  const renderDashboard = () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Visión General</h2>
          <p className="text-muted-foreground mt-1">Monitorea el crecimiento y salud de la plataforma.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer">
          <Download size={16} /> Exportar Reporte
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-background border border-border">
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                <TrendingUp size={14} /> {stat.growth}
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">Crecimiento de Usuarios</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="candidatos" stroke="#1B4B7A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="empresas" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">Matches Exitosos Mensuales</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: "var(--secondary)" }} contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }} />
                <Bar dataKey="matches" fill="#4A148C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Actividad Reciente</h3>
          <button className="text-sm font-medium text-primary hover:underline cursor-pointer">Ver toda</button>
        </div>
        <div className="divide-y divide-border">
          {[
            { action: "Nueva empresa registrada", subject: "TechCorp Global", time: "Hace 5 minutos", icon: Building2, color: "#2E7D32" },
            { action: "Match de alta compatibilidad (95%)", subject: "Ana G. + Innova Software", time: "Hace 23 minutos", icon: Star, color: "#B8860B" },
            { action: "Nuevo candidato completó onboarding", subject: "Carlos M.", time: "Hace 1 hora", icon: Users, color: "#1B4B7A" },
            { action: "Mentoría finalizada (Día 60)", subject: "Proceso #492 - TechCorp", time: "Hace 2 horas", icon: Check, color: "#4A148C" },
          ].map((item, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{item.action}</p>
                <p className="text-xs text-muted-foreground truncate">{item.subject}</p>
              </div>
              <div className="text-xs font-medium text-muted-foreground whitespace-nowrap">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTableLayout = (title: string, desc: string, columns: string[], data: any[]) => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground mt-1">{desc}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-foreground rounded-lg font-medium text-sm hover:bg-secondary transition-colors cursor-pointer">
            <Filter size={16} /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((c, i) => (
                <th key={i} className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{c}</th>
              ))}
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-secondary/30 transition-colors">
                {row.map((cell: any, j: number) => (
                  <td key={j} className="px-6 py-4 text-sm text-foreground">
                    {cell}
                  </td>
                ))}
                <td className="px-6 py-4 text-sm text-right">
                  <button className="text-primary hover:underline font-medium text-sm cursor-pointer">Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const mockCompanies = [
    [<div className="font-bold flex items-center gap-2"><div className="w-8 h-8 rounded bg-gray-200" />TechCorp Global</div>, "Tecnología", "Remoto", "Activo (12 vacantes)", "98%"],
    [<div className="font-bold flex items-center gap-2"><div className="w-8 h-8 rounded bg-gray-200" />Innova Software</div>, "Software", "Híbrido", "Activo (4 vacantes)", "92%"],
    [<div className="font-bold flex items-center gap-2"><div className="w-8 h-8 rounded bg-gray-200" />EcoLogistics</div>, "Logística", "Presencial", "Inactivo", "N/A"],
  ];

  const mockCandidates = [
    [<div className="font-bold">Ana G.</div>, "Remoto", "Procesamiento, T. Ambiental", "Buscando", "12 May 2026"],
    [<div className="font-bold">Carlos M.</div>, "Híbrido", "Ejecución, Ajustes", "En proceso (Innova)", "18 May 2026"],
    [<div className="font-bold">Laura F.</div>, "Cualquiera", "Procesamiento", "Contratada", "02 Jun 2026"],
  ];

  const mockMentorships = [
    [<div className="font-bold">Proceso #492</div>, "Ana G.", "Innova Software", "Mentor: David P.", <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">Activo (Día 15)</span>],
    [<div className="font-bold">Proceso #381</div>, "Luis T.", "TechCorp Global", "Mentor: Sarah C.", <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Completado (Día 60)</span>],
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-8 py-10">
      {screen === "dashboard" && renderDashboard()}
      {screen === "companies" && renderTableLayout("Gestión de Empresas", "Directorio de todas las empresas colaboradoras.", ["Empresa", "Sector", "Modalidad", "Estado", "Retención ESG"], mockCompanies)}
      {screen === "candidates" && renderTableLayout("Base de Candidatos", "Directorio de candidatos registrados en la plataforma.", ["Candidato", "Preferencia", "Ejes Fuertes", "Estado", "Registro"], mockCandidates)}
      {screen === "mentorships" && renderTableLayout("Seguimiento de Mentorías", "Procesos de acompañamiento post-contratación activos.", ["ID Proceso", "Candidato", "Empresa", "Asignación", "Estado"], mockMentorships)}
      {(screen === "mentors" || screen === "activity") && (
        <div className="text-center py-20">
          <Activity size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-foreground">Módulo en Construcción</h2>
          <p className="text-muted-foreground mt-2">Esta sección está siendo conectada con Supabase.</p>
        </div>
      )}
    </div>
  );
}
