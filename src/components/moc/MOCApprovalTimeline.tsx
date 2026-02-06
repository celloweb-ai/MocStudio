import { format } from "date-fns";
import { Check, Clock, X, MessageSquare, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMOCApprovers } from "@/hooks/useMOCApprovers";
import type { Database } from "@/integrations/supabase/types";

type ApprovalStatus = Database["public"]["Enums"]["approval_status"];

interface MOCApprovalTimelineProps {
  mocId: string;
}

const getRoleLabel = (role: Database["public"]["Enums"]["app_role"]) => {
  const labels: Record<string, string> = {
    administrator: "Administrator",
    facility_manager: "Facility Manager",
    process_engineer: "Process Engineer",
    maintenance_technician: "Maintenance Technician",
    hse_coordinator: "HSE Coordinator",
    approval_committee: "Approval Committee",
  };
  return labels[role] || role;
};

export function MOCApprovalTimeline({ mocId }: MOCApprovalTimelineProps) {
  const { approvers, isLoading } = useMOCApprovers(mocId);

  const getStatusIcon = (status: ApprovalStatus | null) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      case "changes_requested":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ApprovalStatus | null) => {
    switch (status) {
      case "approved":
        return "bg-primary text-primary-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      case "changes_requested":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-6">Approval Workflow</h3>
      
      {(!approvers || approvers.length === 0) ? (
        <p className="text-muted-foreground text-center py-8">
          No approvers assigned yet.
        </p>
      ) : (
        <div className="space-y-6">
          {approvers.map((approval, index) => {
            const approver = approval.approver as { full_name: string | null; email: string; department: string | null } | null;
            return (
              <div key={approval.id} className="relative">
                {index < approvers.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
                )}
                <div className="flex gap-4">
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                    getStatusColor(approval.status)
                  )}>
                    {getStatusIcon(approval.status)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-muted">
                            {getInitials(approver?.full_name || null, approver?.email || "?")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {approver?.full_name || approver?.email || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getRoleLabel(approval.role_required)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "text-xs font-medium capitalize",
                          approval.status === "approved" && "text-primary",
                          approval.status === "rejected" && "text-destructive",
                          approval.status === "changes_requested" && "text-warning",
                          approval.status === "pending" && "text-muted-foreground"
                        )}>
                          {approval.status?.replace("_", " ") || "Pending"}
                        </span>
                        {approval.responded_at && (
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(approval.responded_at), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                    {approval.comments && (
                      <div className="ml-11 p-3 rounded-lg bg-muted/50 text-sm">
                        {approval.comments}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
