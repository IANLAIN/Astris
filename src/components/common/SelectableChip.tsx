import { Check } from "lucide-react";

export function SelectableChip({
  selected,
  onClick,
  label,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full border-2 cursor-pointer transition-all text-sm font-semibold leading-tight ${
        selected
          ? "border-primary bg-primary/10 text-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      } ${className}`}
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? "border-primary bg-primary" : "border-muted-foreground"
        }`}
      >
        {selected && <Check size={12} className="text-primary-foreground" />}
      </div>
      {label}
    </button>
  );
}
