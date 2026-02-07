import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type MOCStatus = Database["public"]["Enums"]["moc_status"];

interface MOCStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byChangeType: Record<string, number>;
  averageApprovalTime: number | null;
  overdueCount: number;
  thisMonthCount: number;
  lastMonthCount: number;
}

interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number;
}

export function useMOCReporting() {
  const { user } = useAuth();

  const { data: mocStats, isLoading: mocStatsLoading } = useQuery({
    queryKey: ["moc-reporting-stats"],
    queryFn: async () => {
      const { data: mocs, error } = await supabase
        .from("moc_requests")
        .select("id, status, priority, change_type, created_at, submitted_at, completed_at, review_deadline");

      if (error) throw error;

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Calculate stats
      const stats: MOCStats = {
        total: mocs.length,
        byStatus: {},
        byPriority: {},
        byChangeType: {},
        averageApprovalTime: null,
        overdueCount: 0,
        thisMonthCount: 0,
        lastMonthCount: 0,
      };

      let totalApprovalDays = 0;
      let approvedCount = 0;

      mocs.forEach((moc) => {
        // By status
        const status = moc.status || "draft";
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

        // By priority
        const priority = moc.priority || "medium";
        stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;

        // By change type
        if (moc.change_type) {
          stats.byChangeType[moc.change_type] = (stats.byChangeType[moc.change_type] || 0) + 1;
        }

        // Overdue
        if (moc.review_deadline && 
            moc.status !== "approved" && 
            moc.status !== "rejected" && 
            moc.status !== "implemented" &&
            new Date(moc.review_deadline) < now) {
          stats.overdueCount++;
        }

        // This month
        const createdAt = new Date(moc.created_at);
        if (createdAt >= thisMonth) {
          stats.thisMonthCount++;
        }

        // Last month
        if (createdAt >= lastMonth && createdAt <= lastMonthEnd) {
          stats.lastMonthCount++;
        }

        // Calculate approval time
        if (moc.status === "approved" && moc.submitted_at && moc.completed_at) {
          const days = Math.ceil(
            (new Date(moc.completed_at).getTime() - new Date(moc.submitted_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          totalApprovalDays += days;
          approvedCount++;
        }
      });

      if (approvedCount > 0) {
        stats.averageApprovalTime = Math.round(totalApprovalDays / approvedCount);
      }

      return stats;
    },
    enabled: !!user,
  });

  const { data: taskStats, isLoading: taskStatsLoading } = useQuery({
    queryKey: ["task-reporting-stats"],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from("moc_tasks")
        .select("id, status, due_date");

      if (error) throw error;

      const now = new Date();
      const stats: TaskStats = {
        total: tasks.length,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        completionRate: 0,
      };

      tasks.forEach((task) => {
        if (task.status === "pending") stats.pending++;
        else if (task.status === "in_progress") stats.inProgress++;
        else if (task.status === "completed") stats.completed++;

        if (task.status !== "completed" && 
            task.status !== "cancelled" && 
            task.due_date && 
            new Date(task.due_date) < now) {
          stats.overdue++;
        }
      });

      if (stats.total > 0) {
        stats.completionRate = Math.round((stats.completed / stats.total) * 100);
      }

      return stats;
    },
    enabled: !!user,
  });

  return {
    mocStats,
    taskStats,
    isLoading: mocStatsLoading || taskStatsLoading,
  };
}

// Export function to generate CSV data
export function generateMOCExportData(mocs: any[]) {
  const headers = [
    "Request Number",
    "Title",
    "Status",
    "Priority",
    "Change Type",
    "Facility",
    "Created By",
    "Created At",
    "Submitted At",
    "Review Deadline",
    "Risk Score",
    "Risk Category",
  ];

  const rows = mocs.map((moc) => [
    moc.request_number,
    moc.title,
    moc.status || "draft",
    moc.priority || "medium",
    moc.change_type || "",
    moc.facility?.name || "",
    moc.creator?.full_name || moc.creator?.email || "",
    moc.created_at,
    moc.submitted_at || "",
    moc.review_deadline || "",
    (moc.risk_probability || 0) * (moc.risk_severity || 0),
    moc.risk_category || "",
  ]);

  return { headers, rows };
}

export function downloadCSV(headers: string[], rows: any[][], filename: string) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
