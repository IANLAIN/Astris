import { ReactNode } from "react";
import { Check } from "lucide-react";

export function SelectableCard({
  selected,
  onClick,
  children,
  className = "",
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
        selected
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border bg-card hover:border-primary/40 hover:bg-secondary/20"
      } ${className}`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
          <Check size={14} />
        </div>
      )}

      {icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">{children}</div>
    </button>
  );
}
