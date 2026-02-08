import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Clock, Loader2 } from "lucide-react";
import type { ApprovalTimeData } from "@/hooks/useReportsData";

interface ReportsApprovalTimeChartProps {
  data: ApprovalTimeData[];
  isLoading: boolean;
}

const chartConfig = {
  avgDays: {
    label: "Avg. Days",
    color: "hsl(var(--chart-2))",
  },
};

export function ReportsApprovalTimeChart({ data, isLoading }: ReportsApprovalTimeChartProps) {
  const avgTotal = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + d.avgDays, 0) / data.filter(d => d.avgDays > 0).length) || 0
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Approval Time Trend
        </CardTitle>
        <CardDescription>
          Average days to approve MOC requests
          {avgTotal > 0 && (
            <span className="ml-2 text-primary font-medium">
              (Overall avg: {avgTotal} days)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No approval data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="approvalTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
                label={{ 
                  value: "Days", 
                  angle: -90, 
                  position: "insideLeft",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12
                }}
              />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ApprovalTimeData;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{item.month}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.avgDays > 0 ? `${item.avgDays} days avg` : "No approvals"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgDays" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
