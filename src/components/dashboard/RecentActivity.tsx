import { formatDistanceToNow } from "date-fns";
import { FileText, CheckCircle, AlertTriangle, Clock, XCircle, MessageSquare, ListTodo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const actionIcons: Record<string, { icon: typeof FileText; color: string }> = {
  created: { icon: FileText, color: "text-primary" },
  status_changed: { icon: Clock, color: "text-accent" },
  approved: { icon: CheckCircle, color: "text-success" },
  rejected: { icon: XCircle, color: "text-destructive" },
  comment_added: { icon: MessageSquare, color: "text-info" },
  task_created: { icon: ListTodo, color: "text-warning" },
};

export function RecentActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      // Get recent MOC history
      const { data: history, error } = await supabase
        .from("moc_history")
        .select(`
          id,
          action,
          details,
          created_at,
          moc_request_id,
          user_id
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Fetch MOC titles
      const mocIds = [...new Set(history.map(h => h.moc_request_id))];
      const { data: mocs } = await supabase
        .from("moc_requests")
        .select("id, title, request_number")
        .in("id", mocIds);

      const mocMap = new Map(mocs?.map(m => [m.id, m]) || []);

      // Fetch user profiles
      const userIds = [...new Set(history.map(h => h.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return history.map(h => {
        const moc = mocMap.get(h.moc_request_id);
        const profile = profileMap.get(h.user_id);
        const details = h.details as { from?: string; to?: string; title?: string } | null;
        
        let description = moc?.title || "Unknown MOC";
        if (details?.from && details?.to) {
          description = `${details.from} → ${details.to}`;
        }

        return {
          id: h.id,
          mocId: h.moc_request_id,
          action: h.action,
          title: `${moc?.request_number || "MOC"} - ${h.action.replace("_", " ")}`,
          description,
          time: h.created_at,
          user: profile?.full_name || profile?.email || "System",
        };
      });
    },
    enabled: !!user,
    refetchInterval: 60000, // Refresh every minute
  });

  const handleActivityClick = (mocId: string) => {
    navigate(`/moc-requests/${mocId}`);
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const iconInfo = actionIcons[activity.action] || actionIcons.created;
            const Icon = iconInfo.icon;

            return (
              <button
                key={activity.id}
                onClick={() => handleActivityClick(activity.mocId)}
                className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors text-left"
              >
                <div className={cn("p-2 rounded-lg bg-muted/50", iconInfo.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground capitalize">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
