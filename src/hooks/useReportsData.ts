import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { startOfMonth, endOfMonth, subMonths, format, eachMonthOfInterval, parseISO } from "date-fns";

interface DateRange {
  from: Date;
  to: Date;
}

interface TrendDataPoint {
  month: string;
  created: number;
  approved: number;
  rejected: number;
}

interface FacilityData {
  name: string;
  count: number;
}

interface ApprovalTimeData {
  month: string;
  avgDays: number;
}

interface RiskDistribution {
  category: string;
  count: number;
  avgScore: number;
}

export function useReportsData(dateRange: DateRange) {
  const { user } = useAuth();

  // Fetch all MOC data within date range
  const { data: mocData, isLoading: mocLoading } = useQuery({
    queryKey: ["reports-moc-data", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_requests")
        .select(`
          id, title, request_number, status, priority, change_type,
          risk_probability, risk_severity, risk_category,
          created_at, submitted_at, completed_at, review_deadline,
          facility:facilities(id, name)
        `)
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch task data
  const { data: taskData, isLoading: taskLoading } = useQuery({
    queryKey: ["reports-task-data", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_tasks")
        .select("id, status, priority, due_date, completed_at, created_at")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate summary statistics
  const summary = {
    totalMOCs: mocData?.length || 0,
    approved: mocData?.filter(m => m.status === "approved").length || 0,
    rejected: mocData?.filter(m => m.status === "rejected").length || 0,
    pending: mocData?.filter(m => ["draft", "submitted", "under_review"].includes(m.status || "")).length || 0,
    implemented: mocData?.filter(m => m.status === "implemented").length || 0,
    totalTasks: taskData?.length || 0,
    completedTasks: taskData?.filter(t => t.status === "completed").length || 0,
    overdueTasks: taskData?.filter(t => 
      t.status !== "completed" && 
      t.status !== "cancelled" && 
      t.due_date && 
      new Date(t.due_date) < new Date()
    ).length || 0,
  };

  // Calculate average approval time
  const approvalTimes = mocData
    ?.filter(m => m.status === "approved" && m.submitted_at && m.completed_at)
    .map(m => {
      const submitted = new Date(m.submitted_at!);
      const completed = new Date(m.completed_at!);
      return Math.ceil((completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
    }) || [];

  const avgApprovalTime = approvalTimes.length > 0
    ? Math.round(approvalTimes.reduce((a, b) => a + b, 0) / approvalTimes.length)
    : null;

  // Generate monthly trend data
  const trendData: TrendDataPoint[] = [];
  const months = eachMonthOfInterval({ start: dateRange.from, end: dateRange.to });
  
  months.forEach(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const mocsInMonth = mocData?.filter(m => {
      const created = parseISO(m.created_at);
      return created >= monthStart && created <= monthEnd;
    }) || [];

    trendData.push({
      month: format(month, "MMM yyyy"),
      created: mocsInMonth.length,
      approved: mocsInMonth.filter(m => m.status === "approved").length,
      rejected: mocsInMonth.filter(m => m.status === "rejected").length,
    });
  });

  // Status distribution
  const statusDistribution = [
    { name: "Draft", value: mocData?.filter(m => m.status === "draft").length || 0, color: "hsl(var(--muted-foreground))" },
    { name: "Submitted", value: mocData?.filter(m => m.status === "submitted").length || 0, color: "hsl(var(--chart-1))" },
    { name: "Under Review", value: mocData?.filter(m => m.status === "under_review").length || 0, color: "hsl(var(--chart-2))" },
    { name: "Approved", value: mocData?.filter(m => m.status === "approved").length || 0, color: "hsl(var(--chart-3))" },
    { name: "Rejected", value: mocData?.filter(m => m.status === "rejected").length || 0, color: "hsl(var(--chart-4))" },
    { name: "Implemented", value: mocData?.filter(m => m.status === "implemented").length || 0, color: "hsl(var(--chart-5))" },
  ].filter(s => s.value > 0);

  // Priority distribution
  const priorityDistribution = [
    { name: "Low", value: mocData?.filter(m => m.priority === "low").length || 0, color: "hsl(var(--muted-foreground))" },
    { name: "Medium", value: mocData?.filter(m => m.priority === "medium").length || 0, color: "hsl(var(--chart-2))" },
    { name: "High", value: mocData?.filter(m => m.priority === "high").length || 0, color: "hsl(var(--chart-4))" },
    { name: "Critical", value: mocData?.filter(m => m.priority === "critical").length || 0, color: "hsl(var(--destructive))" },
  ].filter(p => p.value > 0);

  // Change type distribution
  const changeTypeLabels: Record<string, string> = {
    equipment_modification: "Equipment Modification",
    equipment_replacement: "Equipment Replacement",
    equipment_addition: "Equipment Addition",
    procedure_change: "Procedure Change",
    software_change: "Software Change",
    major_change: "Major Change",
  };

  const changeTypeDistribution = Object.entries(
    mocData?.reduce((acc, m) => {
      if (m.change_type) {
        acc[m.change_type] = (acc[m.change_type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {}
  ).map(([type, count]) => ({
    name: changeTypeLabels[type] || type,
    value: count,
  }));

  // Facility distribution
  const facilityDistribution: FacilityData[] = Object.entries(
    mocData?.reduce((acc, m) => {
      const name = m.facility?.name || "Unassigned";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {}
  ).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Risk distribution
  const riskDistribution: RiskDistribution[] = Object.entries(
    mocData?.reduce((acc, m) => {
      const category = m.risk_category || "Unassessed";
      if (!acc[category]) {
        acc[category] = { count: 0, totalScore: 0 };
      }
      acc[category].count++;
      const score = (m.risk_probability || 0) * (m.risk_severity || 0);
      acc[category].totalScore += score;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>) || {}
  ).map(([category, data]) => ({
    category,
    count: data.count,
    avgScore: Math.round(data.totalScore / data.count),
  }));

  // Monthly approval time trend
  const approvalTimeTrend: ApprovalTimeData[] = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const approvedInMonth = mocData?.filter(m => {
      if (m.status !== "approved" || !m.completed_at) return false;
      const completed = parseISO(m.completed_at);
      return completed >= monthStart && completed <= monthEnd;
    }) || [];

    const times = approvedInMonth
      .filter(m => m.submitted_at && m.completed_at)
      .map(m => {
        const submitted = new Date(m.submitted_at!);
        const completed = new Date(m.completed_at!);
        return Math.ceil((completed.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
      });

    return {
      month: format(month, "MMM yyyy"),
      avgDays: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
    };
  });

  // Task status distribution
  const taskStatusDistribution = [
    { name: "Pending", value: taskData?.filter(t => t.status === "pending").length || 0, color: "hsl(var(--muted-foreground))" },
    { name: "In Progress", value: taskData?.filter(t => t.status === "in_progress").length || 0, color: "hsl(var(--chart-2))" },
    { name: "Completed", value: taskData?.filter(t => t.status === "completed").length || 0, color: "hsl(var(--chart-3))" },
    { name: "Cancelled", value: taskData?.filter(t => t.status === "cancelled").length || 0, color: "hsl(var(--muted-foreground))" },
  ].filter(s => s.value > 0);

  return {
    mocData,
    taskData,
    summary,
    avgApprovalTime,
    trendData,
    statusDistribution,
    priorityDistribution,
    changeTypeDistribution,
    facilityDistribution,
    riskDistribution,
    approvalTimeTrend,
    taskStatusDistribution,
    isLoading: mocLoading || taskLoading,
  };
}

export type { DateRange, TrendDataPoint, FacilityData, ApprovalTimeData, RiskDistribution };
