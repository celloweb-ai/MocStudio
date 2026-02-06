import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { MOCFormData } from "../MOCFormWizard";

const RISK_CATEGORIES = [
  { value: "safety", label: "Safety" },
  { value: "environmental", label: "Environmental" },
  { value: "operational", label: "Operational" },
  { value: "financial", label: "Financial" },
  { value: "regulatory", label: "Regulatory Compliance" },
  { value: "reputation", label: "Reputation" },
];

const PROBABILITY_LEVELS = [
  { value: 1, label: "Rare", description: "Almost never happens" },
  { value: 2, label: "Unlikely", description: "Could happen, but not expected" },
  { value: 3, label: "Possible", description: "Might happen occasionally" },
  { value: 4, label: "Likely", description: "Will probably happen" },
  { value: 5, label: "Almost Certain", description: "Expected to happen" },
];

const SEVERITY_LEVELS = [
  { value: 1, label: "Negligible", description: "Minimal impact" },
  { value: 2, label: "Minor", description: "Small impact, easily recoverable" },
  { value: 3, label: "Moderate", description: "Significant impact, recoverable" },
  { value: 4, label: "Major", description: "Serious impact, difficult to recover" },
  { value: 5, label: "Catastrophic", description: "Extreme impact, may be unrecoverable" },
];

const getRiskLevel = (probability: number, severity: number) => {
  const score = probability * severity;
  if (score >= 15) return { level: "Critical", color: "bg-destructive text-destructive-foreground" };
  if (score >= 10) return { level: "High", color: "bg-warning text-warning-foreground" };
  if (score >= 5) return { level: "Medium", color: "bg-accent text-accent-foreground" };
  return { level: "Low", color: "bg-muted text-muted-foreground" };
};

interface MOCRiskAssessmentStepProps {
  form: UseFormReturn<MOCFormData>;
}

export function MOCRiskAssessmentStep({ form }: MOCRiskAssessmentStepProps) {
  const probability = form.watch("probability");
  const severity = form.watch("severity");
  const riskInfo = getRiskLevel(probability, severity);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Risk Assessment</h3>
        <p className="text-sm text-muted-foreground">
          Evaluate the potential risks associated with this change.
        </p>
      </div>

      <FormField
        control={form.control}
        name="riskCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Risk Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {RISK_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="probability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Probability</FormLabel>
              <FormDescription>
                How likely is the risk to occur?
              </FormDescription>
              <div className="space-y-2 mt-2">
                {PROBABILITY_LEVELS.map((level) => (
                  <div
                    key={level.value}
                    onClick={() => field.onChange(level.value)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all",
                      field.value === level.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <p className="font-medium text-sm">{level.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {level.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        field.value === level.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {level.value}
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <FormDescription>
                What is the potential impact if the risk occurs?
              </FormDescription>
              <div className="space-y-2 mt-2">
                {SEVERITY_LEVELS.map((level) => (
                  <div
                    key={level.value}
                    onClick={() => field.onChange(level.value)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all",
                      field.value === level.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <p className="font-medium text-sm">{level.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {level.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        field.value === level.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {level.value}
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Risk Score Display */}
      <div className="p-4 rounded-lg border border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Calculated Risk Score
            </p>
            <p className="text-2xl font-bold text-foreground">
              {probability * severity}
            </p>
          </div>
          <div
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold",
              riskInfo.color
            )}
          >
            {riskInfo.level} Risk
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="mitigationMeasures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mitigation Measures</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the measures that will be taken to mitigate or reduce the identified risks..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Detail the controls and safeguards to be implemented.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>Additional Requirements</FormLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="requiresHazop"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label className="cursor-pointer">Requires HAZOP Study</Label>
                  <p className="text-xs text-muted-foreground">
                    This change requires a Hazard and Operability study.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiresMoc"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <Label className="cursor-pointer">Full MOC Process</Label>
                  <p className="text-xs text-muted-foreground">
                    This change requires the full MOC approval workflow.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
