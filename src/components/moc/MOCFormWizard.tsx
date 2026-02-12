import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronLeft, ChevronRight, FileText, AlertTriangle, Users, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { MOCBasicInfoStep } from "./steps/MOCBasicInfoStep";
import { MOCScopeStep } from "./steps/MOCScopeStep";
import { MOCRiskAssessmentStep } from "./steps/MOCRiskAssessmentStep";
import { MOCApprovalStep } from "./steps/MOCApprovalStep";
import { MOCReviewStep } from "./steps/MOCReviewStep";
import { toast } from "@/hooks/use-toast";

const mocFormSchema = z.object({
  // Basic Info
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  facility: z.string().min(1, "Please select a facility"),
  changeType: z.string().min(1, "Please select a change type"),
  priority: z.string().min(1, "Please select a priority"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  justification: z.string().min(10, "Justification must be at least 10 characters").max(500),
  
  // Scope
  affectedSystems: z.array(z.string()).min(1, "Select at least one affected system"),
  affectedAreas: z.array(z.string()).min(1, "Select at least one affected area"),
  estimatedDuration: z.string().min(1, "Please specify estimated duration"),
  temporaryOrPermanent: z.enum(["temporary", "permanent"]),
  relatedAssets: z.array(z.string()).optional(),
  
  // Risk Assessment
  probability: z.number().min(1).max(5),
  severity: z.number().min(1).max(5),
  riskCategory: z.string().min(1, "Please select a risk category"),
  mitigationMeasures: z.string().min(10, "Please describe mitigation measures").max(1000),
  requiresHazop: z.boolean(),
  requiresMoc: z.boolean(),
  
  // Approvals
  requiredApprovers: z.array(z.string()).min(1, "Select at least one approver"),
  targetImplementationDate: z.date(),
  reviewDeadline: z.date(),
  notifyStakeholders: z.array(z.string()).optional(),
});

export type MOCFormData = z.infer<typeof mocFormSchema>;

const STEPS = [
  { id: 1, title: "Basic Info", icon: FileText },
  { id: 2, title: "Scope", icon: ClipboardCheck },
  { id: 3, title: "Risk Assessment", icon: AlertTriangle },
  { id: 4, title: "Approvals", icon: Users },
  { id: 5, title: "Review", icon: Check },
];

const stepValidationSchemas = {
  1: mocFormSchema.pick({
    title: true,
    facility: true,
    changeType: true,
    priority: true,
    description: true,
    justification: true,
  }),
  2: mocFormSchema.pick({
    affectedSystems: true,
    affectedAreas: true,
    estimatedDuration: true,
    temporaryOrPermanent: true,
  }),
  3: mocFormSchema.pick({
    probability: true,
    severity: true,
    riskCategory: true,
    mitigationMeasures: true,
  }),
  4: mocFormSchema.pick({
    requiredApprovers: true,
    targetImplementationDate: true,
    reviewDeadline: true,
  }),
} as const;

interface MOCFormWizardProps {
  onClose: () => void;
  onSubmit: (data: MOCFormData) => void;
}

export function MOCFormWizard({ onClose, onSubmit }: MOCFormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<MOCFormData>({
    resolver: zodResolver(mocFormSchema),
    defaultValues: {
      title: "",
      facility: "",
      changeType: "",
      priority: "",
      description: "",
      justification: "",
      affectedSystems: [],
      affectedAreas: [],
      estimatedDuration: "",
      temporaryOrPermanent: "permanent",
      relatedAssets: [],
      probability: 1,
      severity: 1,
      riskCategory: "",
      mitigationMeasures: "",
      requiresHazop: false,
      requiresMoc: true,
      requiredApprovers: [],
      targetImplementationDate: new Date(),
      reviewDeadline: new Date(),
      notifyStakeholders: [],
    },
  });

  const validateCurrentStep = async () => {
    const schema = stepValidationSchemas[currentStep as keyof typeof stepValidationSchemas];

    if (!schema) {
      return true;
    }

    const validationResult = schema.safeParse(form.getValues());
    if (validationResult.success) {
      return true;
    }

    form.clearErrors();
    validationResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as keyof MOCFormData;
      form.setError(fieldName, { message: issue.message });
    });

    return false;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: MOCFormData) => {
    onSubmit(data);
    toast({
      title: "MOC Request Created",
      description: `Request "${data.title}" has been submitted successfully.`,
    });
    onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Step Indicator */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted && "bg-primary/20 text-primary",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1 font-medium",
                      isActive && "text-primary",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-12 mx-2 mt-[-20px]",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {currentStep === 1 && <MOCBasicInfoStep form={form} />}
            {currentStep === 2 && <MOCScopeStep form={form} />}
            {currentStep === 3 && <MOCRiskAssessmentStep form={form} />}
            {currentStep === 4 && <MOCApprovalStep form={form} />}
            {currentStep === 5 && <MOCReviewStep form={form} />}
          </form>
        </Form>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 1 ? onClose : handlePrevious}
        >
          {currentStep === 1 ? (
            "Cancel"
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </>
          )}
        </Button>
        
        {currentStep < 5 ? (
          <Button type="button" onClick={handleNext} className="gradient-primary">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            className="gradient-primary"
          >
            Submit MOC Request
          </Button>
        )}
      </div>
    </div>
  );
}
