import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Approver {
  id: string;
  name: string;
  role: string;
  status: "Approved" | "Rejected" | "Pending";
  date: string | null;
  comment: string | null;
}

interface MOCApprovalTimelineProps {
  approvers: Approver[];
}

export function MOCApprovalTimeline({ approvers }: MOCApprovalTimelineProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-6">Approval Workflow</h3>
      <div className="space-y-0">
        {approvers.map((approver, index) => {
          const isLast = index === approvers.length - 1;
          const StatusIcon = approver.status === "Approved" 
            ? CheckCircle 
            : approver.status === "Rejected" 
              ? XCircle 
              : Clock;
          
          return (
            <div key={approver.id} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    approver.status === "Approved" && "bg-emerald-500/20",
                    approver.status === "Rejected" && "bg-destructive/20",
                    approver.status === "Pending" && "bg-muted"
                  )}
                >
                  <StatusIcon
                    className={cn(
                      "h-5 w-5",
                      approver.status === "Approved" && "text-emerald-500",
                      approver.status === "Rejected" && "text-destructive",
                      approver.status === "Pending" && "text-muted-foreground"
                    )}
                  />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[40px]",
                      approver.status === "Approved" ? "bg-emerald-500/30" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {approver.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{approver.name}</p>
                      <p className="text-xs text-muted-foreground">{approver.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        approver.status === "Approved" && "border-emerald-500/50 text-emerald-500",
                        approver.status === "Rejected" && "border-destructive/50 text-destructive",
                        approver.status === "Pending" && "border-muted-foreground/50 text-muted-foreground"
                      )}
                    >
                      {approver.status}
                    </Badge>
                    {approver.date && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(approver.date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
                
                {approver.comment && (
                  <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{approver.comment}</p>
                    </div>
                  </div>
                )}

                {approver.status === "Pending" && (
                  <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
