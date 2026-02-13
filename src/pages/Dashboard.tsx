import { FileText, Building2, AlertTriangle, ClipboardList, Clock, CheckCircle, ListTodo, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { useMOCReporting } from "@/hooks/useMOCReporting";
import { useFacilities } from "@/hooks/useFacilities";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { mocStats, taskStats, isLoading } = useMOCReporting();
  const { facilities } = useFacilities();
  const { language } = useLanguage();

  const monthChange = mocStats ? (
    mocStats.lastMonthCount > 0 
      ? Math.round(((mocStats.thisMonthCount - mocStats.lastMonthCount) / mocStats.lastMonthCount) * 100)
      : mocStats.thisMonthCount > 0 ? 100 : 0
  ) : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{language === "pt" ? "Painel" : "Dashboard"}</h1>
          <p className="text-muted-foreground mt-2">
            {language === "pt" ? "Visão geral das operações de Gestão de Mudanças" : "Overview of your Management of Change operations"}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl glass-card" />
            <Skeleton className="h-32 rounded-xl glass-card" />
            <Skeleton className="h-32 rounded-xl glass-card" />
            <Skeleton className="h-32 rounded-xl glass-card" />
          </>
        ) : (
          <>
            <KPICard
              title={language === "pt" ? "Total de MOCs" : "Total MOCs"}
              value={mocStats?.total || 0}
              change={monthChange > 0 ? `+${monthChange}% ${language === "pt" ? "em relação ao mês anterior" : "from last month"}` : monthChange < 0 ? `${monthChange}% ${language === "pt" ? "em relação ao mês anterior" : "from last month"}` : (language === "pt" ? "Sem mudança" : "No change")}
              changeType={monthChange > 0 ? "positive" : monthChange < 0 ? "negative" : "neutral"}
              icon={FileText}
              iconColor="text-primary"
            />
            <KPICard
              title={language === "pt" ? "Aguardando aprovação" : "Pending Approval"}
              value={(mocStats?.byStatus?.submitted || 0) + (mocStats?.byStatus?.under_review || 0)}
              change={mocStats?.overdueCount ? `${mocStats.overdueCount} ${language === "pt" ? "atrasados" : "overdue"}` : (language === "pt" ? "Tudo no prazo" : "All on track")}
              changeType={mocStats?.overdueCount ? "negative" : "positive"}
              icon={Clock}
              iconColor="text-warning"
            />
            <KPICard
              title={language === "pt" ? "Tempo médio de aprovação" : "Avg. Approval Time"}
              value={mocStats?.averageApprovalTime ? `${mocStats.averageApprovalTime} ${language === "pt" ? "dias" : "days"}` : "N/A"}
              change={language === "pt" ? "Com base em MOCs concluídos" : "Based on completed MOCs"}
              changeType="neutral"
              icon={CheckCircle}
              iconColor="text-success"
            />
            <KPICard
              title={language === "pt" ? "Itens de ação" : "Action Items"}
              value={taskStats?.total || 0}
              change={taskStats?.total ? `${taskStats.completionRate}% ${language === "pt" ? "concluído" : "complete"}` : (language === "pt" ? "Sem tarefas" : "No tasks yet")}
              changeType={taskStats && taskStats.completionRate >= 50 ? "positive" : "neutral"}
              icon={ListTodo}
              iconColor="text-accent"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart />
        <StatusChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Facilities Overview */}
        <div className="glass-card rounded-xl p-6 card-floating">
          <h3 className="text-lg font-semibold text-gradient-cyber mb-4">{language === "pt" ? "Visão geral das instalações" : "Facilities Overview"}</h3>
          <div className="space-y-3">
            {facilities && facilities.length > 0 ? (
              facilities.slice(0, 4).map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-primary/10 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{facility.name}</p>
                      <p className="text-xs text-muted-foreground">{facility.code || (language === "pt" ? "Sem código" : "No code")}</p>
                    </div>
                  </div>
                  <span
                    className={
                      facility.status === "active"
                        ? "status-approved"
                        : "status-review"
                    }
                  >
                    {facility.status || (language === "pt" ? "Ativa" : "Active")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">{language === "pt" ? "Nenhuma instalação configurada" : "No facilities configured"}</p>
            )}
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="glass-card rounded-xl p-6 card-floating">
          <h3 className="text-lg font-semibold text-gradient-cyber mb-4">{language === "pt" ? "Resumo de risco" : "Risk Summary"}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 backdrop-blur-sm border border-destructive/20 hover:border-destructive/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-sm font-medium text-foreground">{language === "pt" ? "Prioridade crítica" : "Critical Priority"}</span>
              </div>
              <span className="text-lg font-bold text-destructive glow-primary">
                {mocStats?.byPriority?.critical || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 backdrop-blur-sm border border-warning/20 hover:border-warning/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm font-medium text-foreground">{language === "pt" ? "Alta prioridade" : "High Priority"}</span>
              </div>
              <span className="text-lg font-bold text-warning">
                {mocStats?.byPriority?.high || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 backdrop-blur-sm border border-destructive/20 hover:border-destructive/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <Clock className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-sm font-medium text-foreground">{language === "pt" ? "MOCs atrasados" : "Overdue MOCs"}</span>
              </div>
              <span className="text-lg font-bold text-destructive glow-primary">
                {mocStats?.overdueCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 backdrop-blur-sm border border-warning/20 hover:border-warning/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <ListTodo className="h-4 w-4 text-warning" />
                </div>
                <span className="text-sm font-medium text-foreground">{language === "pt" ? "Tarefas atrasadas" : "Overdue Tasks"}</span>
              </div>
              <span className="text-lg font-bold text-warning">
                {taskStats?.overdue || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
