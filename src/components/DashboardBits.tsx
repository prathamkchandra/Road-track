import { ArrowUpRight, CheckCircle2, Clock3, XCircle } from "lucide-react";

import { LeadStatus } from "@/lib/data";
import { cx } from "@/lib/utils";

const statusStyles: Record<LeadStatus, string> = {
  New: "bg-coral/15 text-coral ring-coral/30",
  Contacted: "bg-sky/15 text-sky ring-sky/30",
  Confirmed: "bg-mint/15 text-emerald-700 ring-mint/40",
  Cancelled: "bg-stone/15 text-stone ring-stone/30",
};

const statusIcons: Record<LeadStatus, typeof Clock3> = {
  New: Clock3,
  Contacted: ArrowUpRight,
  Confirmed: CheckCircle2,
  Cancelled: XCircle,
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const Icon = statusIcons[status];

  return (
    <span
      className={cx(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-black ring-1",
        statusStyles[status],
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

export function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-stone">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-3xl font-black tracking-tight text-ink">{value}</p>
        <span className="rounded-full bg-mint/15 px-3 py-1 text-xs font-black text-emerald-700">
          {change}
        </span>
      </div>
    </div>
  );
}
