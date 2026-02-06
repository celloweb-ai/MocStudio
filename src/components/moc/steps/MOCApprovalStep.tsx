import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { MOCFormData } from "../MOCFormWizard";

const APPROVERS = [
  { id: "facility-manager", label: "Facility Manager", role: "Required for all changes" },
  { id: "process-engineer", label: "Process Engineer", role: "Technical review" },
  { id: "hse-coordinator", label: "HSE Coordinator", role: "Safety assessment" },
  { id: "maintenance-lead", label: "Maintenance Lead", role: "Implementation planning" },
  { id: "operations-manager", label: "Operations Manager", role: "Operational impact" },
  { id: "approval-committee", label: "Approval Committee", role: "Major changes only" },
];

const STAKEHOLDERS = [
  { id: "production-team", label: "Production Team" },
  { id: "maintenance-team", label: "Maintenance Team" },
  { id: "safety-team", label: "Safety Team" },
  { id: "drilling-team", label: "Drilling Team" },
  { id: "marine-team", label: "Marine Team" },
  { id: "logistics-team", label: "Logistics Team" },
];

interface MOCApprovalStepProps {
  form: UseFormReturn<MOCFormData>;
}

export function MOCApprovalStep({ form }: MOCApprovalStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Approvals & Timeline</h3>
        <p className="text-sm text-muted-foreground">
          Define the approval workflow and implementation schedule.
        </p>
      </div>

      <FormField
        control={form.control}
        name="requiredApprovers"
        render={() => (
          <FormItem>
            <FormLabel>Required Approvers</FormLabel>
            <FormDescription>
              Select all personnel who must approve this change request.
            </FormDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {APPROVERS.map((approver) => (
                <FormField
                  key={approver.id}
                  control={form.control}
                  name="requiredApprovers"
                  render={({ field }) => (
                    <FormItem
                      key={approver.id}
                      className={cn(
                        "flex items-start space-x-3 space-y-0 rounded-md border p-4 transition-colors",
                        field.value?.includes(approver.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(approver.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, approver.id])
                              : field.onChange(
                                  field.value?.filter((value) => value !== approver.id)
                                );
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <Label className="text-sm font-medium cursor-pointer">
                          {approver.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {approver.role}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="targetImplementationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Target Implementation Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When should this change be implemented?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reviewDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Review Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                By when should all reviews be completed?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="notifyStakeholders"
        render={() => (
          <FormItem>
            <FormLabel>Notify Stakeholders (Optional)</FormLabel>
            <FormDescription>
              Select teams that should be notified about this change.
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {STAKEHOLDERS.map((stakeholder) => (
                <FormField
                  key={stakeholder.id}
                  control={form.control}
                  name="notifyStakeholders"
                  render={({ field }) => (
                    <FormItem
                      key={stakeholder.id}
                      className="flex items-center space-x-2 space-y-0 rounded-md border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(stakeholder.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), stakeholder.id])
                              : field.onChange(
                                  field.value?.filter((value) => value !== stakeholder.id)
                                );
                          }}
                        />
                      </FormControl>
                      <Label className="text-sm font-normal cursor-pointer">
                        {stakeholder.label}
                      </Label>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
