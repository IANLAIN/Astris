import React from "react";

export function matchColor(v: number) {
  return v >= 90 ? "#2D7D5F" : v >= 82 ? "#1B4B7A" : v >= 74 ? "#C9830A" : "#6B7E9A";
}

export function MatchBadge({ value, size = "lg" }: { value: number; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const r = isLg ? 44 : 28;
  const sw = isLg ? 7 : 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const dim = (r + sw) * 2 + 6;
  const color = matchColor(value);
  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} style={{ position: "absolute", transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="#D5E2EF" strokeWidth={sw} />
        <circle
          cx={dim / 2} cy={dim / 2} r={r}
          fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{
            "--circ": circ,
            "--offset": offset,
            animation: "astris-draw-stroke 1s cubic-bezier(0.33, 1, 0.68, 1) both",
          } as React.CSSProperties}
        />
      </svg>
      <div className="relative z-10 text-center leading-tight">
        <div style={{ color, fontWeight: 700, fontSize: isLg ? 17 : 10 }}>{value}%</div>
        {isLg && <div style={{ color, fontSize: 9, opacity: 0.8, fontFamily: "DM Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>match</div>}
      </div>
    </div>
  );
}
