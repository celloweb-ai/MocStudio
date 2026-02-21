import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ListTodo,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Summary {
  totalMOCs: number;
  approved: number;
  rejected: number;
  pending: number;
  implemented: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

interface ReportsSummaryCardsProps {
  summary: Summary;
  avgApprovalTime: number | null;
  isLoading: boolean;
}

export function ReportsSummaryCards({ summary, avgApprovalTime, isLoading }: ReportsSummaryCardsProps) {
  const { t } = useLanguage();

  const cards = [
    {
      title: t("reports.totalMOCs"),
      value: summary.totalMOCs,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t("reports.approved"),
      value: summary.approved,
      icon: CheckCircle2,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      suffix: summary.totalMOCs > 0 ? `(${Math.round((summary.approved / summary.totalMOCs) * 100)}%)` : "",
    },
    {
      title: t("reports.rejected"),
      value: summary.rejected,
      icon: XCircle,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: t("reports.pending"),
      value: summary.pending,
      icon: Clock,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: t("reports.avgApprovalTime"),
      value: avgApprovalTime !== null ? `${avgApprovalTime}d` : "—",
      icon: TrendingUp,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      title: t("reports.totalTasks"),
      value: summary.totalTasks,
      icon: ListTodo,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t("reports.completed"),
      value: summary.completedTasks,
      icon: CheckCircle2,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      suffix: summary.totalTasks > 0 ? `(${Math.round((summary.completedTasks / summary.totalTasks) * 100)}%)` : "",
    },
    {
      title: t("reports.overdue"),
      value: summary.overdueTasks,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{card.title}</p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-xl font-bold">{card.value}</p>
                    {card.suffix && (
                      <span className="text-xs text-muted-foreground">{card.suffix}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
