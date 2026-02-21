import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";
import type { TrendDataPoint } from "@/hooks/useReportsData";

interface ReportsTrendChartProps {
  data: TrendDataPoint[];
  isLoading: boolean;
  title?: string;
}

export function ReportsTrendChart({ data, isLoading, title }: ReportsTrendChartProps) {
  const { t } = useLanguage();

  const chartConfig = {
    created: { label: t("reports.created"), color: "hsl(var(--chart-1))" },
    approved: { label: t("reports.approved"), color: "hsl(var(--chart-3))" },
    rejected: { label: t("reports.rejected"), color: "hsl(var(--chart-4))" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {title || t("reports.mocVolumeTrends")}
        </CardTitle>
        <CardDescription>{t("reports.monthlyActivity")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            {t("reports.noDataPeriod")}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="approvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
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
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area type="monotone" dataKey="created" stroke="hsl(var(--chart-1))" fill="url(#createdGradient)" strokeWidth={2} />
              <Area type="monotone" dataKey="approved" stroke="hsl(var(--chart-3))" fill="url(#approvedGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="rejected" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-4))", r: 4 }} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
