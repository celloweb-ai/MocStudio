import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Draft", value: 12, color: "hsl(217, 33%, 17%)" },
  { name: "Submitted", value: 8, color: "hsl(217, 91%, 60%)" },
  { name: "In Review", value: 15, color: "hsl(45, 93%, 47%)" },
  { name: "Approved", value: 28, color: "hsl(142, 76%, 36%)" },
  { name: "Rejected", value: 4, color: "hsl(0, 72%, 51%)" },
  { name: "Implemented", value: 33, color: "hsl(32, 95%, 55%)" },
];

export function StatusChart() {
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
