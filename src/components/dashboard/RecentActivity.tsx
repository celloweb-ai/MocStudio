import { FileText, CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "approved",
    title: "MOC-2024-042 Approved",
    description: "Compressor replacement at Platform Alpha",
    time: "2 hours ago",
    icon: CheckCircle,
    iconColor: "text-success",
  },
  {
    id: 2,
    type: "submitted",
    title: "MOC-2024-045 Submitted",
    description: "Fire detection system upgrade - Platform Beta",
    time: "4 hours ago",
    icon: FileText,
    iconColor: "text-accent",
  },
  {
    id: 3,
    type: "review",
    title: "Risk Assessment Required",
    description: "MOC-2024-041 pending HSE review",
    time: "6 hours ago",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  {
    id: 4,
    type: "rejected",
    title: "MOC-2024-039 Rejected",
    description: "Additional documentation required",
    time: "1 day ago",
    icon: XCircle,
    iconColor: "text-destructive",
  },
  {
    id: 5,
    type: "pending",
    title: "Work Order WO-1852 Created",
    description: "Valve replacement scheduled",
    time: "1 day ago",
    icon: Clock,
    iconColor: "text-muted-foreground",
  },
];

export function RecentActivity() {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className={cn("p-2 rounded-lg bg-muted/50", activity.iconColor)}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
