import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useProfiles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          roles:user_roles(role)
        `)
        .order("full_name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useApproverCandidates() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["approver-candidates"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_approver_candidates");

      if (error) {
        throw new Error(`Unable to load approver candidates: ${error.message}`);
      }

      return data ?? [];
    },
    enabled: !!user,
  });
}
