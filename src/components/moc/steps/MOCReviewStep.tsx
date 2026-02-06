import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { FileText, MapPin, AlertTriangle, Users, Calendar, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { MOCFormData } from "../MOCFormWizard";

const FACILITIES_MAP: Record<string, string> = {
  "platform-alpha": "Platform Alpha",
  "platform-beta": "Platform Beta",
  "platform-delta": "Platform Delta",
  "fpso-gamma": "FPSO Gamma",
};

const CHANGE_TYPES_MAP: Record<string, string> = {
  "equipment-modification": "Equipment Modification",
  "equipment-replacement": "Equipment Replacement",
  "equipment-addition": "Equipment Addition",
  "procedure-change": "Procedure Change",
  "software-change": "Software/Control Logic Change",
  "major-change": "Major Change",
};

const RISK_CATEGORIES_MAP: Record<string, string> = {
  safety: "Safety",
  environmental: "Environmental",
  operational: "Operational",
  financial: "Financial",
  regulatory: "Regulatory Compliance",
  reputation: "Reputation",
};

const APPROVERS_MAP: Record<string, string> = {
  "facility-manager": "Facility Manager",
  "process-engineer": "Process Engineer",
  "hse-coordinator": "HSE Coordinator",
  "maintenance-lead": "Maintenance Lead",
  "operations-manager": "Operations Manager",
  "approval-committee": "Approval Committee",
};

const getRiskLevel = (probability: number, severity: number) => {
  const score = probability * severity;
  if (score >= 15) return { level: "Critical", color: "bg-destructive text-destructive-foreground" };
  if (score >= 10) return { level: "High", color: "bg-warning text-warning-foreground" };
  if (score >= 5) return { level: "Medium", color: "bg-accent text-accent-foreground" };
  return { level: "Low", color: "bg-muted text-muted-foreground" };
};

interface MOCReviewStepProps {
  form: UseFormReturn<MOCFormData>;
}

export function MOCReviewStep({ form }: MOCReviewStepProps) {
  const values = form.getValues();
  const riskInfo = getRiskLevel(values.probability, values.severity);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Review & Submit</h3>
        <p className="text-sm text-muted-foreground">
          Review all information before submitting your MOC request.
        </p>
      </div>

      {/* Basic Info Section */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Basic Information</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Title</p>
            <p className="font-medium">{values.title || "Not specified"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Facility</p>
            <p className="font-medium">
              {FACILITIES_MAP[values.facility] || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Change Type</p>
            <p className="font-medium">
              {CHANGE_TYPES_MAP[values.changeType] || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Priority</p>
            <Badge
              className={cn(
                values.priority === "critical" && "bg-destructive/20 text-destructive",
                values.priority === "high" && "bg-warning/20 text-warning",
                values.priority === "medium" && "bg-accent/20 text-accent",
                values.priority === "low" && "bg-muted text-muted-foreground"
              )}
            >
              {values.priority?.charAt(0).toUpperCase() + values.priority?.slice(1) || "Not set"}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Description</p>
          <p className="text-sm mt-1">{values.description || "Not specified"}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Justification</p>
          <p className="text-sm mt-1">{values.justification || "Not specified"}</p>
        </div>
      </div>

      {/* Scope Section */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Scope</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Affected Systems</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {values.affectedSystems?.length > 0 ? (
                values.affectedSystems.map((system) => (
                  <Badge key={system} variant="outline" className="text-xs">
                    {system.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None selected</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Affected Areas</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {values.affectedAreas?.length > 0 ? (
                values.affectedAreas.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs">
                    {area.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None selected</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Estimated Duration</p>
            <p className="font-medium">{values.estimatedDuration || "Not specified"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Change Duration</p>
            <p className="font-medium capitalize">{values.temporaryOrPermanent}</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment Section */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Risk Assessment</h4>
          </div>
          <div className={cn("px-3 py-1 rounded-full text-sm font-semibold", riskInfo.color)}>
            {riskInfo.level} Risk (Score: {values.probability * values.severity})
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Risk Category</p>
            <p className="font-medium">
              {RISK_CATEGORIES_MAP[values.riskCategory] || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Probability</p>
            <p className="font-medium">{values.probability}/5</p>
          </div>
          <div>
            <p className="text-muted-foreground">Severity</p>
            <p className="font-medium">{values.severity}/5</p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Mitigation Measures</p>
          <p className="text-sm mt-1">{values.mitigationMeasures || "Not specified"}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle
              className={cn(
                "h-4 w-4",
                values.requiresHazop ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className={values.requiresHazop ? "" : "text-muted-foreground"}>
              {values.requiresHazop ? "Requires HAZOP" : "No HAZOP required"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle
              className={cn(
                "h-4 w-4",
                values.requiresMoc ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className={values.requiresMoc ? "" : "text-muted-foreground"}>
              {values.requiresMoc ? "Full MOC Process" : "Simplified process"}
            </span>
          </div>
        </div>
      </div>

      {/* Approvals Section */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Approvals & Timeline</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Required Approvers</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {values.requiredApprovers?.length > 0 ? (
                values.requiredApprovers.map((approver) => (
                  <Badge key={approver} variant="secondary" className="text-xs">
                    {APPROVERS_MAP[approver] || approver}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None selected</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Target Implementation:</span>
              <span className="font-medium">
                {values.targetImplementationDate
                  ? format(values.targetImplementationDate, "PPP")
                  : "Not set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Review Deadline:</span>
              <span className="font-medium">
                {values.reviewDeadline
                  ? format(values.reviewDeadline, "PPP")
                  : "Not set"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
        <p>
          By submitting this MOC request, you confirm that all information provided is accurate 
          and complete to the best of your knowledge. The request will be sent to the selected 
          approvers for review.
        </p>
      </div>
    </div>
  );
}
