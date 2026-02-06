import { useState } from "react";
import { AlertTriangle, Shield, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const riskMatrix = [
  // Row 5 (Catastrophic)
  [
    { probability: 1, severity: 5, level: "Medium", count: 0 },
    { probability: 2, severity: 5, level: "High", count: 1 },
    { probability: 3, severity: 5, level: "Critical", count: 0 },
    { probability: 4, severity: 5, level: "Critical", count: 2 },
    { probability: 5, severity: 5, level: "Critical", count: 0 },
  ],
  // Row 4 (Major)
  [
    { probability: 1, severity: 4, level: "Low", count: 1 },
    { probability: 2, severity: 4, level: "Medium", count: 2 },
    { probability: 3, severity: 4, level: "High", count: 3 },
    { probability: 4, severity: 4, level: "Critical", count: 1 },
    { probability: 5, severity: 4, level: "Critical", count: 0 },
  ],
  // Row 3 (Moderate)
  [
    { probability: 1, severity: 3, level: "Low", count: 3 },
    { probability: 2, severity: 3, level: "Low", count: 4 },
    { probability: 3, severity: 3, level: "Medium", count: 5 },
    { probability: 4, severity: 3, level: "High", count: 2 },
    { probability: 5, severity: 3, level: "High", count: 1 },
  ],
  // Row 2 (Minor)
  [
    { probability: 1, severity: 2, level: "Low", count: 2 },
    { probability: 2, severity: 2, level: "Low", count: 6 },
    { probability: 3, severity: 2, level: "Low", count: 3 },
    { probability: 4, severity: 2, level: "Medium", count: 2 },
    { probability: 5, severity: 2, level: "Medium", count: 1 },
  ],
  // Row 1 (Negligible)
  [
    { probability: 1, severity: 1, level: "Low", count: 5 },
    { probability: 2, severity: 1, level: "Low", count: 4 },
    { probability: 3, severity: 1, level: "Low", count: 2 },
    { probability: 4, severity: 1, level: "Low", count: 1 },
    { probability: 5, severity: 1, level: "Medium", count: 0 },
  ],
];

const severityLabels = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];
const probabilityLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];

const recentAssessments = [
  {
    id: "RA-2024-018",
    moc: "MOC-2024-045",
    title: "Fire Detection System Upgrade",
    initialRisk: "High",
    residualRisk: "Low",
    status: "Complete",
  },
  {
    id: "RA-2024-017",
    moc: "MOC-2024-044",
    title: "Process Control Logic Change",
    initialRisk: "Medium",
    residualRisk: "Low",
    status: "In Progress",
  },
  {
    id: "RA-2024-016",
    moc: "MOC-2024-043",
    title: "Wellhead Platform Integration",
    initialRisk: "Critical",
    residualRisk: "Medium",
    status: "Pending Review",
  },
];

export default function RiskAnalysis() {
  const [selectedCell, setSelectedCell] = useState<{ prob: number; sev: number } | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-destructive/80 hover:bg-destructive";
      case "High":
        return "bg-warning/80 hover:bg-warning";
      case "Medium":
        return "bg-primary/80 hover:bg-primary";
      case "Low":
        return "bg-success/80 hover:bg-success";
      default:
        return "bg-muted";
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-destructive/20 text-destructive";
      case "High":
        return "bg-warning/20 text-warning";
      case "Medium":
        return "bg-primary/20 text-primary";
      case "Low":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Analysis</h1>
          <p className="text-muted-foreground">
            Risk matrix and assessment management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Matrix */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Risk Matrix</h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Click on any cell to see detailed risk assessments for that
                probability/severity combination.
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex">
            {/* Y-axis label */}
            <div className="flex flex-col items-center justify-center pr-4">
              <span
                className="text-sm font-medium text-muted-foreground writing-vertical-lr rotate-180"
                style={{ writingMode: "vertical-lr" }}
              >
                SEVERITY →
              </span>
            </div>

            <div className="flex-1">
              {/* Y-axis labels */}
              <div className="flex">
                <div className="w-24 flex flex-col-reverse gap-1 pr-2">
                  {severityLabels.map((label) => (
                    <div
                      key={label}
                      className="h-16 flex items-center justify-end text-xs text-muted-foreground"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Matrix Grid */}
                <div className="flex-1">
                  <div className="grid gap-1">
                    {riskMatrix.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1">
                        {row.map((cell) => (
                          <Tooltip key={`${cell.probability}-${cell.severity}`}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() =>
                                  setSelectedCell({
                                    prob: cell.probability,
                                    sev: cell.severity,
                                  })
                                }
                                className={cn(
                                  "flex-1 h-16 rounded-md flex flex-col items-center justify-center transition-all",
                                  "border border-transparent hover:border-foreground/20",
                                  getRiskColor(cell.level),
                                  selectedCell?.prob === cell.probability &&
                                    selectedCell?.sev === cell.severity &&
                                    "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                                )}
                              >
                                <span className="text-lg font-bold text-white">
                                  {cell.count}
                                </span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p className="font-medium">
                                  {cell.level} Risk
                                </p>
                                <p className="text-muted-foreground">
                                  {cell.count} assessments
                                </p>
                                <p className="text-xs mt-1">
                                  {probabilityLabels[cell.probability - 1]} ×{" "}
                                  {severityLabels[cell.severity - 1]}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* X-axis labels */}
                  <div className="flex gap-1 mt-2">
                    {probabilityLabels.map((label) => (
                      <div
                        key={label}
                        className="flex-1 text-center text-xs text-muted-foreground"
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-2 text-sm font-medium text-muted-foreground">
                    PROBABILITY →
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
            {["Low", "Medium", "High", "Critical"].map((level) => (
              <div key={level} className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded", getRiskColor(level))} />
                <span className="text-sm text-muted-foreground">{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Risk Summary</h3>
            </div>
            <div className="space-y-4">
              {[
                { level: "Critical", count: 3, change: "-2" },
                { level: "High", count: 7, change: "+1" },
                { level: "Medium", count: 12, change: "-3" },
                { level: "Low", count: 29, change: "+4" },
              ].map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        getRiskColor(item.level)
                      )}
                    />
                    <span className="font-medium text-foreground">{item.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      {item.count}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        item.change.startsWith("-")
                          ? "text-success"
                          : "text-destructive"
                      )}
                    >
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="glass-card rounded-xl p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recent Risk Assessments
        </h3>
        <div className="space-y-3">
          {recentAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{assessment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {assessment.id} • {assessment.moc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">
                    Initial → Residual
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        getRiskBadgeColor(assessment.initialRisk)
                      )}
                    >
                      {assessment.initialRisk}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        getRiskBadgeColor(assessment.residualRisk)
                      )}
                    >
                      {assessment.residualRisk}
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    assessment.status === "Complete"
                      ? "bg-success/20 text-success"
                      : assessment.status === "In Progress"
                      ? "bg-accent/20 text-accent"
                      : "bg-warning/20 text-warning"
                  )}
                >
                  {assessment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
