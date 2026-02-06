import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useMOCHistory(mocId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["moc-history", mocId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_history")
        .select("*")
        .eq("moc_request_id", mocId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles
      const userIds = [...new Set(data.map(h => h.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data.map(history => ({
        ...history,
        user: profileMap.get(history.user_id) || null,
      }));
    },
    enabled: !!user && !!mocId,
  });
}
