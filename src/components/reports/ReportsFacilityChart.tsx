import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Building2, Loader2 } from "lucide-react";
import type { FacilityData } from "@/hooks/useReportsData";

interface ReportsFacilityChartProps {
  data: FacilityData[];
  isLoading: boolean;
  title?: string;
}

export function ReportsFacilityChart({ data, isLoading, title }: ReportsFacilityChartProps) {
  const { t } = useLanguage();

  const chartConfig = {
    count: { label: t("reports.mocs"), color: "hsl(var(--primary))" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {title || t("reports.topFacilities")}
        </CardTitle>
        <CardDescription>{t("reports.mocsByLocation")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            {t("reports.noFacilityData")}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="facilityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={{ stroke: "hsl(var(--muted))" }} angle={-45} textAnchor="end" height={60} interval={0} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickLine={{ stroke: "hsl(var(--muted))" }} />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as FacilityData;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.count} {t("reports.mocs")}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="url(#facilityGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
