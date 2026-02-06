import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MOCFormData } from "../MOCFormWizard";

const FACILITIES = [
  { value: "platform-alpha", label: "Platform Alpha" },
  { value: "platform-beta", label: "Platform Beta" },
  { value: "platform-delta", label: "Platform Delta" },
  { value: "fpso-gamma", label: "FPSO Gamma" },
];

const CHANGE_TYPES = [
  { value: "equipment-modification", label: "Equipment Modification" },
  { value: "equipment-replacement", label: "Equipment Replacement" },
  { value: "equipment-addition", label: "Equipment Addition" },
  { value: "procedure-change", label: "Procedure Change" },
  { value: "software-change", label: "Software/Control Logic Change" },
  { value: "major-change", label: "Major Change" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

interface MOCBasicInfoStepProps {
  form: UseFormReturn<MOCFormData>;
}

export function MOCBasicInfoStep({ form }: MOCBasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
        <p className="text-sm text-muted-foreground">
          Provide the essential details about this change request.
        </p>
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Request Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Fire Detection System Upgrade"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A clear, concise title describing the change.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="facility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facility</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FACILITIES.map((facility) => (
                    <SelectItem key={facility.value} value={facility.value}>
                      {facility.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="changeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CHANGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a detailed description of the proposed change..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Describe what will be changed and how it will be implemented.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="justification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Justification</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Explain why this change is necessary..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Explain the business or safety reason for this change.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
