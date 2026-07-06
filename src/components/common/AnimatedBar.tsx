import { useState, useEffect } from "react";

export function AnimatedBar({ value, color = "var(--primary)", height = "h-2.5" }: {
  value: number; color?: string; height?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(value), 60);
    return () => clearTimeout(id);
  }, [value]);
  return (
    <div
      className={`${height} rounded-full`}
      style={{
        width: `${w}%`,
        backgroundColor: color,
        transition: "width 650ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
}
