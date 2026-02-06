import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  FileText,
  MapPin,
  AlertTriangle,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  Download,
  Edit,
  MoreVertical,
  Building2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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

type ApproverStatus = "Approved" | "Rejected" | "Pending";

interface Approver {
  id: string;
  name: string;
  role: string;
  status: ApproverStatus;
  date: string | null;
  comment: string | null;
}

// Mock data for a single MOC request
const mockMOCDetail: {
  id: string;
  title: string;
  facility: string;
  facilityId: string;
  type: string;
  status: string;
  priority: string;
  submittedBy: { name: string; role: string; email: string };
  submittedDate: string;
  dueDate: string;
  description: string;
  justification: string;
  affectedSystems: string[];
  affectedAreas: string[];
  estimatedDuration: string;
  temporaryOrPermanent: string;
  relatedAssets: { id: string; name: string }[];
  probability: number;
  severity: number;
  riskScore: number;
  riskLevel: string;
  riskCategory: string;
  mitigationMeasures: string;
  requiresHazop: boolean;
  requiresMoc: boolean;
  requiredApprovers: Approver[];
  targetImplementationDate: string;
  reviewDeadline: string;
  notifyStakeholders: string[];
  workOrders: { id: string; title: string; status: string; assignee: string }[];
  history: { date: string; action: string; user: string; details: string }[];
} = {
  id: "MOC-2024-043",
  title: "Wellhead Platform Integration",
  facility: "Platform Alpha",
  facilityId: "platform-alpha",
  type: "Major Change",
  status: "In Review",
  priority: "Critical",
  submittedBy: {
    name: "Carlos Silva",
    role: "Process Engineer",
    email: "carlos.silva@company.com",
  },
  submittedDate: "2024-02-05",
  dueDate: "2024-02-19",
  description:
    "Integration of the new wellhead platform with existing production systems. This includes connecting the wellhead manifold to the main production header, installing new control systems, and updating the safety instrumented systems (SIS) to accommodate the additional production capacity.",
  justification:
    "The integration is necessary to increase production capacity by 15% and improve operational efficiency. The new wellhead platform will provide access to previously untapped reserves.",
  
  // Scope
  affectedSystems: ["Process Systems", "Instrumentation & Control", "Safety Systems (ESD/PSV)", "Electrical Systems"],
  affectedAreas: ["Wellhead", "Production", "Utilities"],
  estimatedDuration: "4 weeks",
  temporaryOrPermanent: "Permanent",
  relatedAssets: [
    { id: "VAL-027", name: "Emergency Shutdown Valve" },
    { id: "SEP-001", name: "Production Separator" },
    { id: "COMP-001", name: "Main Gas Compressor" },
  ],
  
  // Risk Assessment
  probability: 3,
  severity: 4,
  riskScore: 12,
  riskLevel: "High",
  riskCategory: "Safety",
  mitigationMeasures:
    "1. Implement lockout/tagout procedures during installation\n2. Conduct pre-startup safety review (PSSR)\n3. Install temporary barriers around work area\n4. Ensure trained personnel are present during hot work\n5. Conduct emergency response drill before startup",
  requiresHazop: true,
  requiresMoc: true,
  
  // Approvals
  requiredApprovers: [
    { id: "1", name: "Antonio Mendes", role: "Facility Manager", status: "Approved" as const, date: "2024-02-06", comment: "Approved. Ensure all safety protocols are followed." },
    { id: "2", name: "Helena Santos", role: "HSE Coordinator", status: "Approved" as const, date: "2024-02-07", comment: "Safety assessment complete. Proceed with caution." },
    { id: "3", name: "Ricardo Ferreira", role: "Process Engineer", status: "Pending" as const, date: null, comment: null },
    { id: "4", name: "Approval Committee", role: "Final Approval", status: "Pending" as const, date: null, comment: null },
  ],
  targetImplementationDate: "2024-03-01",
  reviewDeadline: "2024-02-19",
  notifyStakeholders: ["Production Team", "Maintenance Team", "Safety Team"],
  
  // Related Work Orders
  workOrders: [
    { id: "WO-2024-089", title: "Install Wellhead Manifold", status: "In Progress", assignee: "Maintenance Team" },
    { id: "WO-2024-090", title: "Update SIS Configuration", status: "Pending", assignee: "Instrumentation Team" },
  ],
  
  // History
  history: [
    { date: "2024-02-05T09:00:00", action: "Created", user: "Carlos Silva", details: "MOC request created and submitted for review" },
    { date: "2024-02-05T14:30:00", action: "Assigned", user: "System", details: "Assigned to Antonio Mendes for initial review" },
    { date: "2024-02-06T10:15:00", action: "Approved", user: "Antonio Mendes", details: "Initial approval granted" },
    { date: "2024-02-06T11:00:00", action: "Assigned", user: "System", details: "Assigned to Helena Santos for HSE review" },
    { date: "2024-02-07T16:45:00", action: "Approved", user: "Helena Santos", details: "HSE review completed and approved" },
    { date: "2024-02-08T09:00:00", action: "Assigned", user: "System", details: "Assigned to Ricardo Ferreira for technical review" },
  ],
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case "Draft":
      return { icon: FileText, color: "bg-muted text-muted-foreground", label: "Draft" };
    case "Submitted":
      return { icon: Clock, color: "bg-blue-500/20 text-blue-400", label: "Submitted" };
    case "In Review":
      return { icon: AlertTriangle, color: "bg-warning/20 text-warning", label: "In Review" };
    case "Approved":
      return { icon: CheckCircle, color: "bg-emerald-500/20 text-emerald-400", label: "Approved" };
    case "Rejected":
      return { icon: XCircle, color: "bg-destructive/20 text-destructive", label: "Rejected" };
    case "Implemented":
      return { icon: CheckCircle, color: "bg-primary/20 text-primary", label: "Implemented" };
    default:
      return { icon: FileText, color: "bg-muted text-muted-foreground", label: status };
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-destructive/20 text-destructive";
    case "High":
      return "bg-warning/20 text-warning";
    case "Medium":
      return "bg-accent/20 text-accent";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case "Critical":
      return "bg-destructive text-destructive-foreground";
    case "High":
      return "bg-warning text-warning-foreground";
    case "Medium":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function MOCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const moc = mockMOCDetail;
  
  const statusInfo = getStatusInfo(moc.status);
  const StatusIcon = statusInfo.icon;

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
            <span className="font-mono text-primary text-sm">{moc.id}</span>
            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </div>
            <Badge className={getPriorityColor(moc.priority)}>{moc.priority}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground ml-11">{moc.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {moc.facility}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Submitted {format(new Date(moc.submittedDate), "PPP")}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Due {format(new Date(moc.dueDate), "PPP")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate Request</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancel Request</DropdownMenuItem>
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
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Description */}
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Description & Justification</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{moc.description}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Justification</p>
                    <p className="text-sm">{moc.justification}</p>
                  </div>
                </div>
              </div>

              {/* Scope */}
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Scope</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Affected Systems</p>
                    <div className="flex flex-wrap gap-1">
                      {moc.affectedSystems.map((system) => (
                        <Badge key={system} variant="outline" className="text-xs">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Affected Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {moc.affectedAreas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                    <p className="text-sm font-medium">{moc.estimatedDuration} ({moc.temporaryOrPermanent})</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Change Type</p>
                    <p className="text-sm font-medium">{moc.type}</p>
                  </div>
                </div>
                {moc.relatedAssets.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Related Assets</p>
                      <div className="space-y-2">
                        {moc.relatedAssets.map((asset) => (
                          <div key={asset.id} className="flex items-center gap-2 text-sm">
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-primary">{asset.id}</span>
                            <span className="text-muted-foreground">-</span>
                            <span>{asset.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Risk Assessment */}
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Risk Assessment</h3>
                  </div>
                  <div className={cn("px-3 py-1 rounded-full text-sm font-semibold", getRiskLevelColor(moc.riskLevel))}>
                    {moc.riskLevel} Risk (Score: {moc.riskScore})
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-medium">{moc.riskCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Probability</p>
                    <p className="text-sm font-medium">{moc.probability}/5</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Severity</p>
                    <p className="text-sm font-medium">{moc.severity}/5</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Mitigation Measures</p>
                  <p className="text-sm whitespace-pre-line">{moc.mitigationMeasures}</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn("h-4 w-4", moc.requiresHazop ? "text-primary" : "text-muted-foreground")} />
                    <span className={moc.requiresHazop ? "" : "text-muted-foreground"}>
                      {moc.requiresHazop ? "Requires HAZOP" : "No HAZOP required"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn("h-4 w-4", moc.requiresMoc ? "text-primary" : "text-muted-foreground")} />
                    <span className={moc.requiresMoc ? "" : "text-muted-foreground"}>
                      {moc.requiresMoc ? "Full MOC Process" : "Simplified process"}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="approvals" className="mt-6">
              <MOCApprovalTimeline approvers={moc.requiredApprovers} />
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <MOCComments mocId={moc.id} />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="font-semibold mb-4">Activity History</h3>
                <div className="space-y-4">
                  {moc.history.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {index < moc.history.length - 1 && (
                          <div className="w-0.5 h-full bg-border flex-1 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{event.action}</p>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.date), "PPp")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {event.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Submitter Info */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Submitted By</h3>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary/20 text-primary">
                  {moc.submittedBy.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{moc.submittedBy.name}</p>
                <p className="text-xs text-muted-foreground">{moc.submittedBy.role}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span>{format(new Date(moc.submittedDate), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Review Deadline</span>
                <span>{format(new Date(moc.reviewDeadline), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target Implementation</span>
                <span>{format(new Date(moc.targetImplementationDate), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          {/* Approval Progress */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Approval Progress</h3>
            <div className="space-y-3">
              {moc.requiredApprovers.map((approver) => {
                const status = approver.status;
                return (
                  <div key={approver.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {status === "Approved" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : status === "Rejected" ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{approver.role}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        status === "Approved" && "border-emerald-500/50 text-emerald-500",
                        status === "Rejected" && "border-destructive/50 text-destructive",
                        status === "Pending" && "border-muted-foreground/50 text-muted-foreground"
                      )}
                    >
                      {status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Work Orders */}
          {moc.workOrders.length > 0 && (
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold">Related Work Orders</h3>
              <div className="space-y-3">
                {moc.workOrders.map((wo) => (
                  <div key={wo.id} className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-primary">{wo.id}</span>
                      <Badge variant="outline" className="text-xs">{wo.status}</Badge>
                    </div>
                    <p className="text-sm">{wo.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{wo.assignee}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notify Stakeholders */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Notified Stakeholders</h3>
            <div className="flex flex-wrap gap-1">
              {moc.notifyStakeholders.map((stakeholder) => (
                <Badge key={stakeholder} variant="secondary" className="text-xs">
                  {stakeholder}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
