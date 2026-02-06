import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", mocs: 12, approved: 8 },
  { month: "Feb", mocs: 19, approved: 14 },
  { month: "Mar", mocs: 15, approved: 11 },
  { month: "Apr", mocs: 22, approved: 18 },
  { month: "May", mocs: 28, approved: 22 },
  { month: "Jun", mocs: 24, approved: 20 },
  { month: "Jul", mocs: 31, approved: 26 },
  { month: "Aug", mocs: 27, approved: 23 },
  { month: "Sep", mocs: 35, approved: 29 },
  { month: "Oct", mocs: 29, approved: 24 },
  { month: "Nov", mocs: 33, approved: 28 },
  { month: "Dec", mocs: 38, approved: 32 },
];

export function TrendChart() {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">MOC Trends (2024)</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorMocs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(32, 95%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(32, 95%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
            <XAxis
              dataKey="month"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 10%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
            />
            <Area
              type="monotone"
              dataKey="mocs"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMocs)"
              name="Total MOCs"
            />
            <Area
              type="monotone"
              dataKey="approved"
              stroke="hsl(32, 95%, 55%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorApproved)"
              name="Approved"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
