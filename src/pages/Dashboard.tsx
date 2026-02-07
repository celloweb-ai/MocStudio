import { FileText, Building2, AlertTriangle, ClipboardList, Clock, CheckCircle, ListTodo, TrendingUp } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { useMOCReporting } from "@/hooks/useMOCReporting";
import { useFacilities } from "@/hooks/useFacilities";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { mocStats, taskStats, isLoading } = useMOCReporting();
  const { facilities } = useFacilities();

  // Calculate month-over-month change
  const monthChange = mocStats ? (
    mocStats.lastMonthCount > 0 
      ? Math.round(((mocStats.thisMonthCount - mocStats.lastMonthCount) / mocStats.lastMonthCount) * 100)
      : mocStats.thisMonthCount > 0 ? 100 : 0
  ) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your Management of Change operations
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <KPICard
              title="Total MOCs"
              value={mocStats?.total || 0}
              change={monthChange > 0 ? `+${monthChange}% from last month` : monthChange < 0 ? `${monthChange}% from last month` : "No change"}
              changeType={monthChange > 0 ? "positive" : monthChange < 0 ? "negative" : "neutral"}
              icon={FileText}
              iconColor="text-primary"
            />
            <KPICard
              title="Pending Approval"
              value={(mocStats?.byStatus?.submitted || 0) + (mocStats?.byStatus?.under_review || 0)}
              change={mocStats?.overdueCount ? `${mocStats.overdueCount} overdue` : "All on track"}
              changeType={mocStats?.overdueCount ? "negative" : "positive"}
              icon={Clock}
              iconColor="text-warning"
            />
            <KPICard
              title="Avg. Approval Time"
              value={mocStats?.averageApprovalTime ? `${mocStats.averageApprovalTime} days` : "N/A"}
              change="Based on completed MOCs"
              changeType="neutral"
              icon={CheckCircle}
              iconColor="text-success"
            />
            <KPICard
              title="Action Items"
              value={taskStats?.total || 0}
              change={taskStats?.total ? `${taskStats.completionRate}% complete` : "No tasks yet"}
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
        <div className="glass-card rounded-xl p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-foreground mb-4">Facilities Overview</h3>
          <div className="space-y-4">
            {facilities && facilities.length > 0 ? (
              facilities.slice(0, 4).map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{facility.name}</p>
                      <p className="text-xs text-muted-foreground">{facility.code || "No code"}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      facility.status === "active"
                        ? "bg-success/20 text-success"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {facility.status || "Active"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No facilities configured</p>
            )}
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="glass-card rounded-xl p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risk Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium">Critical Priority</span>
              </div>
              <span className="text-lg font-bold text-destructive">
                {mocStats?.byPriority?.critical || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium">High Priority</span>
              </div>
              <span className="text-lg font-bold text-warning">
                {mocStats?.byPriority?.high || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium">Overdue MOCs</span>
              </div>
              <span className="text-lg font-bold text-destructive">
                {mocStats?.overdueCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <ListTodo className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium">Overdue Tasks</span>
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
