import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface WorkOrder {
  id: string;
  order_number: string | null;
  title: string;
  description: string | null;
  work_type: string;
  status: string;
  priority: string;
  facility_id: string | null;
  moc_request_id: string | null;
  assignee: string | null;
  due_date: string | null;
  progress: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  facilities?: { name: string } | null;
  moc_requests?: { request_number: string; title: string } | null;
}

export interface WorkOrderInsert {
  title: string;
  description?: string | null;
  work_type: string;
  status?: string;
  priority?: string;
  facility_id?: string | null;
  moc_request_id?: string | null;
  assignee?: string | null;
  due_date?: string | null;
}

export function useWorkOrders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workOrders, isLoading, error } = useQuery({
    queryKey: ["work_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_orders")
        .select("*, facilities(name), moc_requests(request_number, title)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WorkOrder[];
    },
    enabled: !!user,
  });

  const createWorkOrder = useMutation({
    mutationFn: async (data: WorkOrderInsert) => {
      const { data: result, error } = await supabase
        .from("work_orders")
        .insert({ ...data, created_by: user!.id })
        .select("*, facilities(name), moc_requests(request_number, title)")
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work_orders"] });
      toast({ title: "Work Order Created", description: "The work order has been successfully created." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return { workOrders, isLoading, error, createWorkOrder };
}
