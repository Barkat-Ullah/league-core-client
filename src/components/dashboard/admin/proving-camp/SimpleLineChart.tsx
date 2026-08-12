type ChartPoint = {
  week: string;
  value: number;
};

type SimpleLineChartProps = {
  data: ChartPoint[];
};

export default function SimpleLineChart({ data }: SimpleLineChartProps) {
  const width = 640;
  const height = 280;

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-[#7E869C] text-sm sm:text-base">
        No data available
      </div>
    );
  }

  const min = Math.min(...data.map((item) => item.value));
  const max = Math.max(...data.map((item) => item.value));
  const span = Math.max(max - min, 1);

  // Dynamic left padding based on longest y-axis number
  const longestLabel = String(Math.round(max)).length;
  const paddingLeft = Math.max(36, longestLabel * 10 + 14);
  const paddingRight = 12;
  const paddingTop = 14;
  const paddingBottom = 34;

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? width / 2
        : paddingLeft +
          (index / (data.length - 1)) * (width - paddingLeft - paddingRight);

    const y =
      height -
      paddingBottom -
      ((item.value - min) / span) * (height - paddingTop - paddingBottom);

    return { x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  const yAxisTicks = [0, 1, 2, 3, 4].map((tick) => {
    const y = paddingTop + (tick / 4) * (height - paddingTop - paddingBottom);
    const value = Math.round(max - (tick / 4) * span);
    return { y, value };
  });

  // Decide how many x labels to show
  const shouldShowLabel = (index: number) => {
    if (data.length <= 4) return true;
    if (data.length <= 7) return index % 2 === 0 || index === data.length - 1;
    return index % 3 === 0 || index === data.length - 1;
  };

  // Shorten long week names so they fit on mobile
  const formatWeekLabel = (week: string) => {
    // "Week 1" → "W1", "Week 12" → "W12"
    const match = week.match(/(\d+)/);
    if (match && week.toLowerCase().includes("week")) {
      return `W${match[1]}`;
    }
    // fallback: truncate long names
    return week.length > 6 ? `${week.slice(0, 5)}…` : week;
  };

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto block"
        style={{ maxHeight: "280px" }}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Revenue by week line chart"
      >
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        {/* Horizontal grid + Y labels */}
        {yAxisTicks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={paddingLeft}
              y1={tick.y}
              x2={width - paddingRight}
              y2={tick.y}
              stroke="#2A3040"
              strokeDasharray="3 3"
            />
            <text
              x={paddingLeft - 8}
              y={tick.y + 4}
              textAnchor="end"
              fill="#7E869C"
              fontSize="12"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {/* Vertical guides */}
        {points.length > 1 &&
          points.map((point, index) => (
            <line
              key={`v-${index}`}
              x1={point.x}
              y1={paddingTop}
              x2={point.x}
              y2={height - paddingBottom}
              stroke={index % 2 === 0 ? "#242A38" : "transparent"}
              strokeDasharray="2 3"
            />
          ))}

        {/* Line */}
        {points.length > 1 && (
          <path
            d={path}
            fill="none"
            stroke="#CCFF00"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Dots */}
        {points.map((point, index) => (
          <circle
            key={`dot-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#CCFF00"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* X-axis labels */}
        {data.map((item, index) => {
          if (!shouldShowLabel(index)) return null;

          return (
            <text
              key={`label-${index}`}
              x={points[index].x}
              y={height - 12}
              textAnchor="middle"
              fill="#7E869C"
              fontSize="11"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {formatWeekLabel(item.week)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
