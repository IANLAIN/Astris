import { useMemo } from "react";

/** Convierte coordenadas polares a cartesianas, con 0° en la parte superior. */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Elige el anchor horizontal según la posición angular del vértice. */
function anchorFor(angleDeg: number): "start" | "middle" | "end" {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a > 345 || a < 15) return "middle";  // top
  if (a > 165 && a < 195) return "middle"; // bottom
  if (a >= 15 && a <= 165) return "start"; // right half
  return "end";                             // left half
}

/** Desplazamiento vertical extra para que la etiqueta no tape el vértice. */
function baselineFor(angleDeg: number): "auto" | "middle" | "hanging" {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a > 345 || a < 15) return "auto";    // top → texto arriba
  if (a > 165 && a < 195) return "hanging";// bottom → texto abajo
  return "middle";
}

/**
 * Gráfico radar puro en SVG sin dependencias externas.
 * El viewBox se calcula para que las etiquetas nunca queden recortadas.
 */
export function RadarViz({
  data,
  height = 380,
  color = "var(--primary)",
  outerRadius = 120,
  fontSize = 13,
}: {
  data: Array<{ axis: string; value: number }>;
  height?: number;
  color?: string;
  outerRadius?: number;
  fontSize?: number;
}) {
  // El centro está exactamente en el medio del área de dibujo
  const cx = 0;
  const cy = 0;

  // Margen alrededor del radar para que las etiquetas quepan
  const labelGap = fontSize * 15; // espacio para texto multipalabra
  const margin = outerRadius + labelGap;

  const { polygonPoints, gridPolygons, axisLines, labelData } = useMemo(() => {
    const n = data.length;
    if (n === 0)
      return { polygonPoints: "", gridPolygons: [], axisLines: [], labelData: [] };

    const step = 360 / n;
    const levels = 5;

    const pts = data
      .map((d, i) => {
        const r = (d.value / 100) * outerRadius;
        const p = polar(cx, cy, r, i * step);
        return `${p.x},${p.y}`;
      })
      .join(" ");

    const gridPolygons: { points: string; level: number }[] = [];
    for (let lv = 1; lv <= levels; lv++) {
      const r = (lv / levels) * outerRadius;
      const pts2 = data
        .map((_, i) => {
          const p = polar(cx, cy, r, i * step);
          return `${p.x},${p.y}`;
        })
        .join(" ");
      gridPolygons.push({ points: pts2, level: lv });
    }

    const axisLines = data.map((_, i) => {
      const p = polar(cx, cy, outerRadius, i * step);
      return { x1: cx, y1: cy, x2: p.x, y2: p.y };
    });

    // Etiquetas: partimos el texto en múltiples líneas si es largo
    const labelData = data.map((d, i) => {
      const angleDeg = i * step;
      const r = outerRadius + fontSize * 1.6;
      const p = polar(cx, cy, r, angleDeg);
      const words = d.axis.split(" ");
      return {
        x: p.x,
        y: p.y,
        words,
        anchor: anchorFor(angleDeg),
        baseline: baselineFor(angleDeg),
      };
    });

    return { polygonPoints: pts, gridPolygons, axisLines, labelData };
  }, [data, outerRadius, fontSize]);

  if (data.length === 0) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-foreground)", fontSize: 13 }}>
        —
      </div>
    );
  }

  // viewBox centrado en (0,0), con margen simétrico
  const vb = `-${margin} -${margin} ${margin * 2} ${margin * 2}`;

  return (
    <svg
      width="100%"
      viewBox={vb}
      style={{ display: "block", overflow: "hidden" }}
      role="img"
      aria-label="Radar chart"
    >
      {/* Grid rings */}
      {gridPolygons.map((g) => (
        <polygon
          key={g.level}
          points={g.points}
          fill="none"
          stroke="var(--border)"
          strokeWidth={g.level === 5 ? 1.5 : 0.8}
          opacity={0.6}
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="var(--muted-foreground)"
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
        const p = polar(cx, cy, r, i * (360 / data.length));
        return (
          <circle
            key={i}
            cx={p.x} cy={p.y} r={5}
            fill={color}
            stroke="var(--background)"
            strokeWidth={2}
          />
        );
      })}

      {/* Labels — wrapped into individual tspan lines */}
      {labelData.map((lbl, i) => {
        const lineH = fontSize * 1.25;
        // Para labels en la parte superior desplazamos hacia arriba,
        // para la parte inferior hacia abajo, para los lados centramos.
        const totalLines = lbl.words.length;
        const offsetY =
          lbl.baseline === "auto"
            ? -(totalLines * lineH)
            : lbl.baseline === "hanging"
              ? lineH * 0.2
              : -(((totalLines - 1) * lineH) / 2);

        return (
          <text
            key={i}
            x={lbl.x}
            y={lbl.y + offsetY}
            textAnchor={lbl.anchor}
            fill="var(--foreground)"
            fontSize={fontSize}
            fontFamily="'Inter', sans-serif"
            fontWeight={600}
          >
            {lbl.words.map((word, wi) => (
              <tspan key={wi} x={lbl.x} dy={wi === 0 ? 0 : lineH}>
                {word}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}
