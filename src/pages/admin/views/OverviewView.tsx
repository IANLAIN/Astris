
import { Users, FileText, Building2, Briefcase } from "lucide-react";

interface OverviewProps {
  stats: {
    totalUsers: number;
    totalCandidates: number;
    totalOrganizations: number;
    totalJobs: number;
  };
}

export default function OverviewView({ stats }: OverviewProps) {
  return (
    <div className="space-y-6 anim-fade-in">
      <h1 className="text-3xl font-bold text-foreground">Dashboard General</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Usuarios", val: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Candidatos", val: stats.totalCandidates, icon: FileText, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Empresas", val: stats.totalOrganizations, icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Vacantes", val: stats.totalJobs, icon: Briefcase, color: "text-orange-500", bg: "bg-orange-500/10" }
        ].map((s, i) => (
          <div key={i} className={"p-6 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4 "}>
            <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + s.bg + " " + s.color}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold text-foreground">{s.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
