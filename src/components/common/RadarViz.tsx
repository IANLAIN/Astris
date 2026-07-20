import { useMemo } from "react";

function polarToCartesian(
  cx: number, cy: number, r: number, angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Pure SVG radar chart — no recharts ResponsiveContainer,
 * so it never triggers infinite resize loops.
 */
export function RadarViz({
  data,
  height = 380,
  color = "#1B4B7A",
  outerRadius = 120,
  fontSize = 14,
}: {
  data: Array<{ axis: string; value: number }>;
  height?: number;
  color?: string;
  outerRadius?: number;
  fontSize?: number;
}) {
  const cx = 140;
  const cy = height / 2;

  const levels = 5; // concentric grid rings

  const { polygonPoints, gridPolygons, axisLines, labels } = useMemo(() => {
    const n = data.length;
    if (n === 0)
      return { polygonPoints: "", gridPolygons: [], axisLines: [], labels: [] };

    const angleStep = 360 / n;

    // Data polygon
    const pts = data
      .map((d, i) => {
        const r = (d.value / 100) * outerRadius;
        const p = polarToCartesian(cx, cy, r, i * angleStep);
        return `${p.x},${p.y}`;
      })
      .join(" ");
    const polygonPoints = pts;

    // Grid rings (for each level)
    const gridPolygons: Array<{ points: string; level: number }> = [];
    for (let level = 1; level <= levels; level++) {
      const r = (level / levels) * outerRadius;
      const pts2 = data
        .map((_, i) => {
          const p = polarToCartesian(cx, cy, r, i * angleStep);
          return `${p.x},${p.y}`;
        })
        .join(" ");
      gridPolygons.push({ points: pts2, level });
    }

    // Axis lines from center to vertices
    const lines = data.map((_, i) => {
      const p = polarToCartesian(cx, cy, outerRadius, i * angleStep);
      return { x1: cx, y1: cy, x2: p.x, y2: p.y };
    });

    // Labels at the vertices (pushed slightly outward)
    const lbls = data.map((d, i) => {
      const labelR = outerRadius + 26;
      const p = polarToCartesian(cx, cy, labelR, i * angleStep);
      return { x: p.x, y: p.y, text: d.axis, anchor: getTextAnchor(i * angleStep), dy: getTextDy(i * angleStep) };
    });

    return { polygonPoints, gridPolygons, axisLines: lines, labels: lbls };
  }, [data, outerRadius, cx, cy]);

  if (data.length === 0) {
    return (
      <div style={{ height, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 13 }}>
        No data
      </div>
    );
  }

  const svgW = cx + outerRadius + 60;
  const svgH = height;
  const inset = 40;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${svgW + inset} ${svgH}`}
      style={{ overflow: "visible", display: "block" }}
      role="img"
      aria-label="Radar chart"
    >
      <g transform={`translate(${inset / 2}, 0)`}>
        {/* Grid rings */}
        {gridPolygons.map((g) => (
          <polygon
            key={g.level}
            points={g.points}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth={g.level === levels ? 1.5 : 0.8}
            opacity={0.6}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#94A3B8"
            strokeWidth={0.8}
            opacity={0.4}
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill={color}
          fillOpacity={0.2}
          stroke={color}
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {/* Data dots */}
        {data.map((d, i) => {
          const r = (d.value / 100) * outerRadius;
          const p = polarToCartesian(cx, cy, r, i * (360 / data.length));
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={color}
              stroke="#fff"
              strokeWidth={2}
            />
          );
        })}

        {/* Labels */}
        {labels.map((lbl, i) => (
          <text
            key={i}
            x={lbl.x}
            y={lbl.y}
            textAnchor={lbl.anchor as any}
            dominantBaseline="middle"
            dy={lbl.dy}
            fill="#1E293B"
            fontSize={fontSize}
            fontFamily="'Atkinson Hyperlegible', Inter, sans-serif"
            fontWeight={600}
          >
            {lbl.text}
          </text>
        ))}
      </g>
    </svg>
  );
}

function getTextAnchor(angleDeg: number): string {
  if (angleDeg === 0 || angleDeg === 360) return "start";
  if (angleDeg > 170 && angleDeg < 190) return "end";
  if (angleDeg > 80 && angleDeg < 100) return "middle";
  if (angleDeg > 260 && angleDeg < 280) return "middle";
  if (angleDeg > 180) return "end";
  return "start";
}

function getTextDy(angleDeg: number): string {
  if (angleDeg === 0 || angleDeg === 360) return "-0.35em";
  if (angleDeg === 180) return "-0.35em";
  if (angleDeg === 90 || angleDeg === 270) return "0.85em";
  if (angleDeg > 90 && angleDeg < 270) return "1em";
  return "-0.5em";
}
