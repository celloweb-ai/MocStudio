import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ApprovalStatus = Database["public"]["Enums"]["approval_status"];
type AppRole = Database["public"]["Enums"]["app_role"];

export function useMOCApprovers(mocId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: approvers, isLoading, error } = useQuery({
    queryKey: ["moc-approvers", mocId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_approvers")
        .select("*")
        .eq("moc_request_id", mocId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch approver profiles
      const userIds = [...new Set(data.map(a => a.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, department")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data.map(approver => ({
        ...approver,
        approver: profileMap.get(approver.user_id) || null,
      }));
    },
    enabled: !!user && !!mocId,
  });

  const addApprover = useMutation({
    mutationFn: async (data: { userId: string; roleRequired: AppRole }) => {
      const { data: result, error } = await supabase
        .from("moc_approvers")
        .insert({
          moc_request_id: mocId,
          user_id: data.userId,
          role_required: data.roleRequired,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-approvers", mocId] });
      toast({
        title: "Approver Added",
        description: "The approver has been added to this MOC request.",
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

  const respondToApproval = useMutation({
    mutationFn: async ({ 
      approverId, 
      status, 
      comments 
    }: { 
      approverId: string; 
      status: ApprovalStatus; 
      comments?: string 
    }) => {
      const { data: result, error } = await supabase
        .from("moc_approvers")
        .update({
          status,
          comments,
          responded_at: new Date().toISOString(),
        })
        .eq("id", approverId)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["moc-approvers", mocId] });
      queryClient.invalidateQueries({ queryKey: ["moc-request", mocId] });
      toast({
        title: variables.status === "approved" ? "Approved" : "Response Submitted",
        description: `Your response has been recorded.`,
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

  const removeApprover = useMutation({
    mutationFn: async (approverId: string) => {
      const { error } = await supabase
        .from("moc_approvers")
        .delete()
        .eq("id", approverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-approvers", mocId] });
      toast({
        title: "Approver Removed",
        description: "The approver has been removed.",
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
    approvers,
    isLoading,
    error,
    addApprover,
    respondToApproval,
    removeApprover,
  };
}
