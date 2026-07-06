import { RadarChart, Radar, PolarAngleAxis, PolarGrid, ResponsiveContainer } from "recharts";

export function RadarViz({ data, height = 280, color = "#1B4B7A", outerRadius = 95, fontSize = 11 }: {
  data: Array<{ axis: string; value: number }>;
  height?: number; color?: string; outerRadius?: number; fontSize?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius={outerRadius}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize, fill: "#4A5568", fontFamily: "'Atkinson Hyperlegible', Inter, sans-serif" }} />
        <Radar
          dataKey="value" stroke={color} fill={color} fillOpacity={0.25} strokeWidth={2.5}
          isAnimationActive={true} animationDuration={800} animationEasing="ease-out"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
