type ChartPoint = {
  week: string;
  value: number;
};

type SimpleBarChartProps = {
  data: ChartPoint[];
};

export default function SimpleBarChart({ data }: SimpleBarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  // Thin out x-axis labels as the dataset grows so they never overlap or
  // overflow the plot area on small screens.
  const shouldShowLabel = (index: number) => {
    if (data.length <= 4) return true;
    if (data.length <= 7) return index % 2 === 0 || index === data.length - 1;
    return index % 3 === 0 || index === data.length - 1;
  };

  // Shorten long week names ("Week 12" -> "W12") so they fit on small screens.
  const formatWeekLabel = (week: string) => {
    const match = week.match(/(\d+)/);
    if (match && week.toLowerCase().includes("week")) {
      return `W${match[1]}`;
    }
    return week.length > 6 ? `${week.slice(0, 5)}…` : week;
  };

  return (
    <div className="grid h-56 sm:h-64 md:h-72 grid-rows-[1fr_auto]">
      <div className="relative rounded-md border border-[#2A3040] px-2 sm:px-3 py-3 sm:py-4">
        {/* Grid lines */}
        <div className="pointer-events-none absolute inset-0 grid grid-rows-4 px-2 sm:px-3 py-3 sm:py-4">
          {[0, 1, 2, 3].map((line) => (
            <div
              key={line}
              className="border-b border-dashed border-[#2A3040] last:border-none"
            />
          ))}
        </div>

        {/* Bars */}
        <div className="relative z-10 flex h-full items-end justify-between gap-1.5 sm:gap-2 md:gap-3">
          {data.map((item, index) => (
            <div
              key={`${item.week}-${index}`}
              className="flex h-full flex-1 items-end justify-center min-w-0"
            >
              <div
                className="w-full max-w-4.5 sm:max-w-6 md:max-w-7 rounded-sm bg-[#CCFF00]"
                style={{ height: `${(item.value / max) * 100}%` }}
                title={`${item.week}: ${item.value}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="mt-2 flex justify-between gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 text-[10px] sm:text-xs text-[#7E869C]">
        {data.map((item, index) => {
          if (!shouldShowLabel(index)) {
            // Empty slot keeps columns aligned with the bars above.
            return <span key={`${item.week}-${index}`} className="w-full" />;
          }

          return (
            <span
              key={`${item.week}-${index}`}
              className="w-full min-w-0 text-center truncate"
            >
              {formatWeekLabel(item.week)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
