import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";
import {
  ArrowLeft,
  FileText,
  MapPin,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Edit,
  MoreVertical,
  Building2,
  Loader2,
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MOCApprovalTimeline } from "@/components/moc/MOCApprovalTimeline";
import { MOCComments } from "@/components/moc/MOCComments";
import { MOCTaskList } from "@/components/moc/MOCTaskList";
import { useMOCRequest } from "@/hooks/useMOCRequests";
import { useMOCHistory } from "@/hooks/useMOCHistory";
import { useMOCApprovers } from "@/hooks/useMOCApprovers";
import { useMOCTasks } from "@/hooks/useMOCTasks";
import { generateMOCExportData, downloadCSV } from "@/hooks/useMOCReporting";
import type { Database } from "@/integrations/supabase/types";

type MOCStatus = Database["public"]["Enums"]["moc_status"];
type MOCPriority = Database["public"]["Enums"]["moc_priority"];

const getStatusInfo = (status: MOCStatus | null, t: (key: TranslationKey) => string) => {
  switch (status) {
    case "draft":
      return { icon: FileText, color: "bg-muted text-muted-foreground", label: t("moc.draft") };
    case "submitted":
      return { icon: Clock, color: "bg-info/20 text-info", label: t("moc.submitted") };
    case "under_review":
      return { icon: AlertTriangle, color: "bg-warning/20 text-warning", label: t("moc.inReview") };
    case "approved":
      return { icon: CheckCircle, color: "bg-primary/20 text-primary", label: t("moc.approved") };
    case "rejected":
      return { icon: XCircle, color: "bg-destructive/20 text-destructive", label: t("moc.rejected") };
    case "implemented":
      return { icon: CheckCircle, color: "bg-primary/20 text-primary", label: t("moc.implemented") };
    default:
      return { icon: FileText, color: "bg-muted text-muted-foreground", label: status || "Unknown" };
  }
};

const getPriorityColor = (priority: MOCPriority | null) => {
  switch (priority) {
    case "critical":
      return "bg-destructive/20 text-destructive";
    case "high":
      return "bg-warning/20 text-warning";
    case "medium":
      return "bg-accent/20 text-accent";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getRiskLevel = (probability: number | null, severity: number | null) => {
  if (!probability || !severity) return { score: 0, level: "Unknown", color: "bg-muted text-muted-foreground" };
  const score = probability * severity;
  if (score >= 15) return { score, level: "Critical", color: "bg-destructive text-destructive-foreground" };
  if (score >= 10) return { score, level: "High", color: "bg-warning text-warning-foreground" };
  if (score >= 5) return { score, level: "Medium", color: "bg-accent text-accent-foreground" };
  return { score, level: "Low", color: "bg-muted text-muted-foreground" };
};

const getChangeTypeLabel = (type: Database["public"]["Enums"]["moc_change_type"] | null, t: (key: TranslationKey) => string) => {
  const labels: Record<string, TranslationKey> = {
    equipment_modification: "moc.changeType.equipment_modification",
    equipment_replacement: "moc.changeType.equipment_replacement",
    equipment_addition: "moc.changeType.equipment_addition",
    procedure_change: "moc.changeType.procedure_change",
    software_change: "moc.changeType.software_change",
    major_change: "moc.changeType.major_change",
  };
  const key = labels[type || ""];
  return key ? t(key) : type || t("mocDetail.notSpecified");
};

export default function MOCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { data: moc, isLoading: mocLoading } = useMOCRequest(id || "");
  const { data: history, isLoading: historyLoading } = useMOCHistory(id || "");
  const { approvers } = useMOCApprovers(id || "");
  const { taskStats } = useMOCTasks(id || "");

  const handleExportCSV = () => {
    if (moc) {
      const { headers, rows } = generateMOCExportData([moc]);
      downloadCSV(headers, rows, `${moc.request_number}.csv`);
    }
  };

  if (mocLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!moc) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">{t("mocDetail.notFound")}</h2>
        <p className="text-muted-foreground mb-4">{t("mocDetail.notFoundDesc")}</p>
        <Button onClick={() => navigate("/moc-requests")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("mocDetail.backToMOC")}
        </Button>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(moc.status, t);
  const StatusIcon = statusInfo.icon;
  const riskInfo = getRiskLevel(moc.risk_probability, moc.risk_severity);
  const facility = moc.facility as { id: string; name: string; code: string | null } | null;
  const creator = moc.creator as { id: string; full_name: string | null; email: string; department: string | null } | null;

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/moc-requests")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-mono text-primary text-sm">{moc.request_number}</span>
            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </div>
            <Badge className={getPriorityColor(moc.priority)}>{moc.priority || "medium"}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground ml-11">{moc.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {facility?.name || t("mocDetail.noFacility")}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {t("mocDetail.createdOn")} {format(new Date(moc.created_at), "PPP")}
            </div>
            {moc.review_deadline && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t("mocDetail.due")} {format(new Date(moc.review_deadline), "PPP")}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            {t("mocDetail.exportCSV")}
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            {t("moc.edit")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("mocDetail.duplicateRequest")}</DropdownMenuItem>
              <DropdownMenuItem>{t("mocDetail.print")}</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">{t("mocDetail.cancelRequest")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="details">{t("mocDetail.detailsTab")}</TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1.5">
                <ListTodo className="h-3.5 w-3.5" />
                {t("mocDetail.tasks")}
                {taskStats.total > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {taskStats.completed}/{taskStats.total}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approvals">{t("mocDetail.approvals")}</TabsTrigger>
              <TabsTrigger value="comments">{t("mocDetail.comments")}</TabsTrigger>
              <TabsTrigger value="history">{t("mocDetail.history")}</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Description */}
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t("mocDetail.descriptionJustification")}</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("moc.description")}</p>
                    <p className="text-sm">{moc.description || t("mocDetail.noDescription")}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("mocDetail.justification")}</p>
                    <p className="text-sm">{moc.justification || t("mocDetail.noJustification")}</p>
                  </div>
                </div>
              </div>

              {/* Scope */}
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t("mocDetail.scope")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("mocDetail.affectedSystems")}</p>
                    <div className="flex flex-wrap gap-1">
                      {moc.affected_systems?.length ? moc.affected_systems.map((system) => (
                        <Badge key={system} variant="outline" className="text-xs">
                          {system}
                        </Badge>
                      )) : <span className="text-sm text-muted-foreground">{t("mocDetail.noneSpecified")}</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("mocDetail.affectedAreas")}</p>
                    <div className="flex flex-wrap gap-1">
                      {moc.affected_areas?.length ? moc.affected_areas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      )) : <span className="text-sm text-muted-foreground">{t("mocDetail.noneSpecified")}</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("mocDetail.duration")}</p>
                    <p className="text-sm font-medium">
                      {moc.estimated_duration || t("mocDetail.notSpecified")} ({moc.is_temporary ? t("mocDetail.temporary") : t("mocDetail.permanent")})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("mocDetail.changeType")}</p>
                    <p className="text-sm font-medium">{getChangeTypeLabel(moc.change_type, t)}</p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t("mocDetail.riskAssessmentSection")}</h3>
                  </div>
                  <div className={cn("px-3 py-1 rounded-full text-sm font-semibold", riskInfo.color)}>
                    {riskInfo.level} {t("mocDetail.risk")} ({t("mocDetail.score")}: {riskInfo.score})
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("mocDetail.riskCategory")}</p>
                    <p className="text-sm font-medium">{moc.risk_category || t("mocDetail.notSpecified")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("mocDetail.probability")}</p>
                    <p className="text-sm font-medium">{moc.risk_probability || 0}/5</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("mocDetail.severity")}</p>
                    <p className="text-sm font-medium">{moc.risk_severity || 0}/5</p>
                  </div>
                </div>
                {moc.mitigation_measures && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{t("mocDetail.mitigationMeasures")}</p>
                      <p className="text-sm whitespace-pre-line">{moc.mitigation_measures}</p>
                    </div>
                  </>
                )}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn("h-4 w-4", moc.requires_hazop ? "text-primary" : "text-muted-foreground")} />
                    <span className={moc.requires_hazop ? "" : "text-muted-foreground"}>
                      {moc.requires_hazop ? t("mocDetail.requiresHazop") : t("mocDetail.noHazop")}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <MOCTaskList mocId={moc.id} />
            </TabsContent>

            <TabsContent value="approvals" className="mt-6">
              <MOCApprovalTimeline mocId={moc.id} />
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <MOCComments mocId={moc.id} />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">{t("mocDetail.activityHistory")}</h3>
                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : !history || history.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">{t("mocDetail.noHistory")}</p>
                ) : (
                  <div className="space-y-4">
                    {history.map((event, index) => {
                      const eventUser = event.user as { full_name: string | null; email: string } | null;
                      const details = event.details as { title?: string; from?: string; to?: string } | null;
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {index < history.length - 1 && (
                              <div className="w-0.5 h-full bg-border flex-1 mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium capitalize">{event.action.replace("_", " ")}</p>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(event.created_at), "PPp")}
                              </span>
                            </div>
                            {details && (
                              <p className="text-sm text-muted-foreground">
                                {details.from && details.to ? `${details.from} → ${details.to}` : details.title || ""}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              by {eventUser?.full_name || eventUser?.email || "System"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Submitter Info */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">{t("mocDetail.submittedBy")}</h3>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/20 text-primary">
                  {getInitials(creator?.full_name || null, creator?.email || "?")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{creator?.full_name || creator?.email || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{creator?.department || t("mocDetail.teamMember")}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">{t("mocDetail.timelineTitle")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("mocDetail.createdOn")}</span>
                <span>{format(new Date(moc.created_at), "MMM d, yyyy")}</span>
              </div>
              {moc.submitted_at && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("moc.submitted")}</span>
                  <span>{format(new Date(moc.submitted_at), "MMM d, yyyy")}</span>
                </div>
              )}
              {moc.review_deadline && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("mocDetail.reviewDeadline")}</span>
                  <span>{format(new Date(moc.review_deadline), "MMM d, yyyy")}</span>
                </div>
              )}
              {moc.target_implementation_date && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("mocDetail.targetImplementation")}</span>
                  <span>{format(new Date(moc.target_implementation_date), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Approval Progress */}
          {approvers && approvers.length > 0 && (
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold">{t("mocDetail.approvalProgress")}</h3>
              <div className="space-y-3">
                {approvers.map((approval) => {
                  const status = approval.status;
                  const approver = approval.approver as { full_name: string | null } | null;
                  return (
                    <div key={approval.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {status === "approved" ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : status === "rejected" ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm">{approver?.full_name || t("mocDetail.approver")}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          status === "approved" && "border-primary/50 text-primary",
                          status === "rejected" && "border-destructive/50 text-destructive",
                          status === "pending" && "border-muted-foreground/50 text-muted-foreground"
                        )}
                      >
                        {status?.replace("_", " ") || "Pending"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
