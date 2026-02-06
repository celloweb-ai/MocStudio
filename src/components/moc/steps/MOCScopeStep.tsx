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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { MOCFormData } from "../MOCFormWizard";

const SYSTEMS = [
  { id: "process", label: "Process Systems" },
  { id: "electrical", label: "Electrical Systems" },
  { id: "instrumentation", label: "Instrumentation & Control" },
  { id: "mechanical", label: "Mechanical Equipment" },
  { id: "structural", label: "Structural Components" },
  { id: "fire-gas", label: "Fire & Gas Detection" },
  { id: "safety", label: "Safety Systems (ESD/PSV)" },
  { id: "hvac", label: "HVAC Systems" },
];

const AREAS = [
  { id: "production", label: "Production" },
  { id: "utilities", label: "Utilities" },
  { id: "living-quarters", label: "Living Quarters" },
  { id: "helideck", label: "Helideck" },
  { id: "drilling", label: "Drilling" },
  { id: "wellhead", label: "Wellhead" },
  { id: "storage", label: "Storage" },
  { id: "export", label: "Export Systems" },
];

const ASSETS = [
  { id: "comp-001", label: "COMP-001 - Main Gas Compressor" },
  { id: "pump-003", label: "PUMP-003 - Seawater Lift Pump" },
  { id: "val-027", label: "VAL-027 - Emergency Shutdown Valve" },
  { id: "gen-002", label: "GEN-002 - Emergency Generator" },
  { id: "sep-001", label: "SEP-001 - Production Separator" },
];

interface MOCScopeStepProps {
  form: UseFormReturn<MOCFormData>;
}

export function MOCScopeStep({ form }: MOCScopeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Scope Definition</h3>
        <p className="text-sm text-muted-foreground">
          Define the scope and impact areas of this change.
        </p>
      </div>

      <FormField
        control={form.control}
        name="affectedSystems"
        render={() => (
          <FormItem>
            <FormLabel>Affected Systems</FormLabel>
            <FormDescription>
              Select all systems that will be impacted by this change.
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {SYSTEMS.map((system) => (
                <FormField
                  key={system.id}
                  control={form.control}
                  name="affectedSystems"
                  render={({ field }) => (
                    <FormItem
                      key={system.id}
                      className="flex items-center space-x-2 space-y-0 rounded-md border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(system.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, system.id])
                              : field.onChange(
                                  field.value?.filter((value) => value !== system.id)
                                );
                          }}
                        />
                      </FormControl>
                      <Label className="text-sm font-normal cursor-pointer">
                        {system.label}
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

      <FormField
        control={form.control}
        name="affectedAreas"
        render={() => (
          <FormItem>
            <FormLabel>Affected Areas</FormLabel>
            <FormDescription>
              Select all physical areas that will be impacted.
            </FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {AREAS.map((area) => (
                <FormField
                  key={area.id}
                  control={form.control}
                  name="affectedAreas"
                  render={({ field }) => (
                    <FormItem
                      key={area.id}
                      className="flex items-center space-x-2 space-y-0 rounded-md border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(area.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, area.id])
                              : field.onChange(
                                  field.value?.filter((value) => value !== area.id)
                                );
                          }}
                        />
                      </FormControl>
                      <Label className="text-sm font-normal cursor-pointer">
                        {area.label}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2 weeks, 3 days" {...field} />
              </FormControl>
              <FormDescription>
                How long will implementation take?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temporaryOrPermanent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Duration</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="permanent" id="permanent" />
                    <Label htmlFor="permanent" className="font-normal cursor-pointer">
                      Permanent
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="temporary" id="temporary" />
                    <Label htmlFor="temporary" className="font-normal cursor-pointer">
                      Temporary
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="relatedAssets"
        render={() => (
          <FormItem>
            <FormLabel>Related Assets (Optional)</FormLabel>
            <FormDescription>
              Select specific assets that will be modified or affected.
            </FormDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {ASSETS.map((asset) => (
                <FormField
                  key={asset.id}
                  control={form.control}
                  name="relatedAssets"
                  render={({ field }) => (
                    <FormItem
                      key={asset.id}
                      className="flex items-center space-x-2 space-y-0 rounded-md border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(asset.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), asset.id])
                              : field.onChange(
                                  field.value?.filter((value) => value !== asset.id)
                                );
                          }}
                        />
                      </FormControl>
                      <Label className="text-sm font-normal cursor-pointer font-mono">
                        {asset.label}
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
