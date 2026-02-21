import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { CheckSquare, Loader2 } from "lucide-react";

interface TaskStatusData {
  name: string;
  value: number;
  color: string;
}

interface ReportsTaskChartProps {
  data: TaskStatusData[];
  isLoading: boolean;
}

export function ReportsTaskChart({ data, isLoading }: ReportsTaskChartProps) {
  const { t } = useLanguage();

  const chartConfig = data.reduce((acc, item) => {
    acc[item.name.toLowerCase().replace(" ", "_")] = { label: item.name, color: item.color };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const completed = data.find(d => d.name === "Completed")?.value || 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          {t("reports.taskStatusDist")}
        </CardTitle>
        <CardDescription>{t("reports.actionItemsBreakdown")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            {t("reports.noTaskData")}
          </div>
        ) : (
          <div className="h-[300px] relative">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" nameKey="name">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as TaskStatusData;
                      return (
                        <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.value} {t("reports.tasks")} ({((item.value / total) * 100).toFixed(1)}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-2xl font-bold text-chart-3">{completionRate}%</div>
              <div className="text-xs text-muted-foreground">{t("reports.complete")}</div>
            </div>
          </div>
        )}

        {!isLoading && data.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
