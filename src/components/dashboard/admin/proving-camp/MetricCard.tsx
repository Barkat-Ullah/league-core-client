import { cn } from "@/lib/utils";
import { DollarSign, ListOrdered, Users } from "lucide-react";
import type { OverviewMetric } from "./data";

const iconMap = {
  revenue: DollarSign,
  enrollment: Users,
  waitlist: ListOrdered,
} as const;

type MetricCardProps = {
  metric: OverviewMetric;
};

export default function MetricCard({ metric }: MetricCardProps) {
  const Icon = iconMap[metric.icon];

  return (
    <article className="rounded-xl border border-[#232734] bg-[#12141A] px-6 py-5">
      <div className="mb-2 flex items-center gap-3 text-[#8D93A6]">
        <Icon className="h-4 w-4 shrink-0 text-[#CCFF00]" />
        <p className="text-lg font-medium leading-none sm:text-xl">{metric.title}</p>
      </div>

      <p className="break-words text-3xl font-bold tracking-tight text-[#E9EDF5] sm:text-4xl lg:text-5xl">
        {metric.value}
      </p>
      <p className={cn("mt-2 text-base text-[#8D93A6] sm:text-lg lg:text-2xl", metric.accent)}>
        {metric.description}
      </p>
    </article>
  );
}
