import { useCallback } from "react";

export function CustomSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  labelLeft,
  labelRight,
  valueSuffix = "%",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labelLeft?: string;
  labelRight?: string;
  valueSuffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  return (
    <div className="w-full">
      {/* Floating value label */}
      <div className="relative h-6 mb-1">
        <div
          className="absolute -top-1 px-3 py-1 rounded-lg text-xs font-bold bg-primary text-primary-foreground shadow-sm transition-all duration-150"
          style={{ left: `calc(${pct}% - 20px)` }}
        >
          {value}{valueSuffix}
        </div>
      </div>

      {/* Track container */}
      <div className="relative w-full h-8 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-muted" />

        {/* Filled track */}
        <div
          className="absolute left-0 h-2 rounded-full bg-primary transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />

        {/* Hidden native range input (for accessibility + interaction) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10 opacity-0"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />

        {/* Custom thumb overlay */}
        <div
          className="absolute w-6 h-6 rounded-full bg-white border-2 border-primary shadow-md pointer-events-none transition-[left] duration-150 -translate-x-1/2"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1.5">
        {labelLeft && (
          <span className="text-xs font-semibold text-muted-foreground max-w-[45%] leading-tight">
            {labelLeft}
          </span>
        )}
        {labelRight && (
          <span className="text-xs font-semibold text-muted-foreground max-w-[45%] leading-tight text-right">
            {labelRight}
          </span>
        )}
      </div>
    </div>
  );
}
