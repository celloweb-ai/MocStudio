import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type MOCRequest = Database["public"]["Tables"]["moc_requests"]["Row"];
type MOCRequestUpdate = Database["public"]["Tables"]["moc_requests"]["Update"];

// Custom insert type that excludes auto-generated fields
interface CreateMOCData {
  title: string;
  description?: string | null;
  justification?: string | null;
  facility_id?: string | null;
  change_type?: Database["public"]["Enums"]["moc_change_type"] | null;
  priority?: Database["public"]["Enums"]["moc_priority"] | null;
  is_temporary?: boolean | null;
  estimated_duration?: string | null;
  affected_systems?: string[] | null;
  affected_areas?: string[] | null;
  risk_probability?: number | null;
  risk_severity?: number | null;
  risk_category?: string | null;
  mitigation_measures?: string | null;
  requires_hazop?: boolean | null;
  target_implementation_date?: string | null;
  review_deadline?: string | null;
}

export function useMOCRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: mocRequests, isLoading, error } = useQuery({
    queryKey: ["moc-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_requests")
        .select(`
          *,
          facility:facilities(id, name, code)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch creator profiles separately
      const userIds = [...new Set(data.map(m => m.created_by))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data.map(moc => ({
        ...moc,
        creator: profileMap.get(moc.created_by) || null,
      }));
    },
    enabled: !!user,
  });

  const createMOC = useMutation({
    mutationFn: async (data: CreateMOCData) => {
      if (!user) throw new Error("User not authenticated");
      
      // The database trigger will auto-generate request_number
      const { data: result, error } = await supabase
        .from("moc_requests")
        .insert({
          title: data.title,
          description: data.description,
          justification: data.justification,
          facility_id: data.facility_id,
          change_type: data.change_type,
          priority: data.priority,
          is_temporary: data.is_temporary,
          estimated_duration: data.estimated_duration,
          affected_systems: data.affected_systems,
          affected_areas: data.affected_areas,
          risk_probability: data.risk_probability,
          risk_severity: data.risk_severity,
          risk_category: data.risk_category,
          mitigation_measures: data.mitigation_measures,
          requires_hazop: data.requires_hazop,
          target_implementation_date: data.target_implementation_date,
          review_deadline: data.review_deadline,
          created_by: user.id,
          request_number: "", // Will be overwritten by trigger
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-requests"] });
      toast({
        title: "MOC Request Created",
        description: "Your MOC request has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMOC = useMutation({
    mutationFn: async ({ id, ...data }: MOCRequestUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from("moc_requests")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-requests"] });
      toast({
        title: "MOC Request Updated",
        description: "Your MOC request has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMOC = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("moc_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-requests"] });
      toast({
        title: "MOC Request Deleted",
        description: "The MOC request has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitMOC = useMutation({
    mutationFn: async (id: string) => {
      const { data: result, error } = await supabase
        .from("moc_requests")
        .update({ 
          status: "submitted" as const,
          submitted_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-requests"] });
      toast({
        title: "MOC Request Submitted",
        description: "Your MOC request has been submitted for review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    mocRequests,
    isLoading,
    error,
    createMOC,
    updateMOC,
    deleteMOC,
    submitMOC,
  };
}

export function useMOCRequest(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["moc-request", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_requests")
        .select(`
          *,
          facility:facilities(id, name, code)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      // Fetch creator profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email, department")
        .eq("id", data.created_by)
        .maybeSingle();
      
      return {
        ...data,
        creator: profile,
      };
    },
    enabled: !!user && !!id,
  });
}

export type { CreateMOCData };
