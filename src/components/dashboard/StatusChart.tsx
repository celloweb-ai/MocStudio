import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMOCReporting } from "@/hooks/useMOCReporting";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors: Record<string, string> = {
  draft: "hsl(217, 33%, 40%)",
  submitted: "hsl(217, 91%, 60%)",
  under_review: "hsl(45, 93%, 47%)",
  approved: "hsl(142, 76%, 36%)",
  rejected: "hsl(0, 72%, 51%)",
  implemented: "hsl(32, 95%, 55%)",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  implemented: "Implemented",
};

export function StatusChart() {
  const { mocStats, isLoading } = useMOCReporting();

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">MOC Status Distribution</h3>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const data = Object.entries(mocStats?.byStatus || {}).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count,
    color: statusColors[status] || "hsl(217, 33%, 40%)",
  }));

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">MOC Status Distribution</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No MOC data available yet
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">MOC Status Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 10%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
