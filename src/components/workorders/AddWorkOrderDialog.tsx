import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useFacilities } from "@/hooks/useFacilities";
import { useMOCRequests } from "@/hooks/useMOCRequests";
import { useWorkOrders, type WorkOrderInsert } from "@/hooks/useWorkOrders";
import { useLanguage } from "@/contexts/LanguageContext";

const WORK_TYPES = ["Corrective", "Preventive", "Installation", "Modification", "Inspection"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  work_type: z.string().min(1, "Type is required"),
  priority: z.string().default("Medium"),
  status: z.string().default("Scheduled"),
  facility_id: z.string().optional(),
  moc_request_id: z.string().optional(),
  assignee: z.string().optional(),
  due_date: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddWorkOrderDialog() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const { facilities } = useFacilities();
  const { mocRequests } = useMOCRequests();
  const { createWorkOrder } = useWorkOrders();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", work_type: "", priority: "Medium", status: "Scheduled",
      facility_id: "", moc_request_id: "", assignee: "", due_date: "", description: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const data: WorkOrderInsert = {
      title: values.title,
      work_type: values.work_type,
      priority: values.priority,
      status: values.status,
      facility_id: values.facility_id || null,
      moc_request_id: values.moc_request_id || null,
      assignee: values.assignee || null,
      due_date: values.due_date || null,
      description: values.description || null,
    };
    createWorkOrder.mutate(data, {
      onSuccess: () => { setOpen(false); form.reset(); },
    });
  };

  const priorityLabel: Record<string, string> = {
    Critical: language === "pt" ? "Crítica" : "Critical",
    High: language === "pt" ? "Alta" : "High",
    Medium: language === "pt" ? "Média" : "Medium",
    Low: language === "pt" ? "Baixa" : "Low",
  };

  const workTypeLabel: Record<string, string> = {
    Corrective: language === "pt" ? "Corretiva" : "Corrective",
    Preventive: language === "pt" ? "Preventiva" : "Preventive",
    Installation: language === "pt" ? "Instalação" : "Installation",
    Modification: language === "pt" ? "Modificação" : "Modification",
    Inspection: language === "pt" ? "Inspeção" : "Inspection",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          {language === "pt" ? "Criar Ordem de Serviço" : "Create Work Order"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === "pt" ? "Criar Ordem de Serviço" : "Create Work Order"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>{language === "pt" ? "Título *" : "Title *"}</FormLabel>
                <FormControl><Input placeholder={language === "pt" ? "ex.: Troca de válvula - V-105" : "e.g., Valve Replacement - V-105"} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="work_type" render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "pt" ? "Tipo *" : "Type *"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={language === "pt" ? "Selecione o tipo" : "Select type"} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {WORK_TYPES.map((t) => <SelectItem key={t} value={t}>{workTypeLabel[t]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "pt" ? "Prioridade" : "Priority"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{priorityLabel[p]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="facility_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "pt" ? "Instalação" : "Facility"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={language === "pt" ? "Selecione a instalação" : "Select facility"} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {facilities?.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="moc_request_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "pt" ? "MOC relacionado" : "Related MOC"}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={language === "pt" ? "Selecione o MOC (opcional)" : "Select MOC (optional)"} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {mocRequests?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.request_number} - {m.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="assignee" render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "pt" ? "Responsável" : "Assignee"}</FormLabel>
                  <FormControl><Input placeholder={language === "pt" ? "ex.: Equipe Alfa" : "e.g., Team Alpha"} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="due_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === "pt" ? "Prazo" : "Due Date"}</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>{language === "pt" ? "Descrição" : "Description"}</FormLabel>
                <FormControl><Textarea placeholder={language === "pt" ? "Descrição opcional..." : "Optional description..."} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>{language === "pt" ? "Cancelar" : "Cancel"}</Button>
              <Button type="submit" disabled={createWorkOrder.isPending}>
                {createWorkOrder.isPending
                  ? (language === "pt" ? "Criando..." : "Creating...")
                  : (language === "pt" ? "Criar Ordem de Serviço" : "Create Work Order")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
