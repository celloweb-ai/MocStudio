import { FileText, Building2, AlertTriangle, ClipboardList, Clock, CheckCircle } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TrendChart } from "@/components/dashboard/TrendChart";

export default function Dashboard() {
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
        <KPICard
          title="Active MOCs"
          value={47}
          change="+12% from last month"
          changeType="positive"
          icon={FileText}
          iconColor="text-primary"
        />
        <KPICard
          title="Pending Approval"
          value={15}
          change="5 require immediate action"
          changeType="neutral"
          icon={Clock}
          iconColor="text-warning"
        />
        <KPICard
          title="Avg. Approval Time"
          value="4.2 days"
          change="-0.8 days improvement"
          changeType="positive"
          icon={CheckCircle}
          iconColor="text-success"
        />
        <KPICard
          title="Open Work Orders"
          value={23}
          change="8 due this week"
          changeType="neutral"
          icon={ClipboardList}
          iconColor="text-accent"
        />
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
            {[
              { name: "Platform Alpha", mocs: 12, status: "Operational" },
              { name: "Platform Beta", mocs: 8, status: "Operational" },
              { name: "FPSO Gamma", mocs: 15, status: "Maintenance" },
              { name: "Platform Delta", mocs: 6, status: "Operational" },
            ].map((facility) => (
              <div
                key={facility.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{facility.name}</p>
                    <p className="text-xs text-muted-foreground">{facility.mocs} active MOCs</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    facility.status === "Operational"
                      ? "bg-success/20 text-success"
                      : "bg-warning/20 text-warning"
                  }`}
                >
                  {facility.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="glass-card rounded-xl p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risk Alerts</h3>
          <div className="space-y-4">
            {[
              { title: "High-risk MOC pending review", severity: "High", id: "MOC-2024-041" },
              { title: "Overdue risk assessment", severity: "Medium", id: "MOC-2024-038" },
              { title: "Expiring mitigation measures", severity: "Low", id: "MOC-2024-035" },
            ].map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <AlertTriangle
                  className={`h-5 w-5 shrink-0 ${
                    alert.severity === "High"
                      ? "text-destructive"
                      : alert.severity === "Medium"
                      ? "text-warning"
                      : "text-muted-foreground"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.id}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full shrink-0 ${
                    alert.severity === "High"
                      ? "bg-destructive/20 text-destructive"
                      : alert.severity === "Medium"
                      ? "bg-warning/20 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
