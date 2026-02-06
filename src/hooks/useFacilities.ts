import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Facility = Database["public"]["Tables"]["facilities"]["Row"];
type FacilityInsert = Database["public"]["Tables"]["facilities"]["Insert"];

export function useFacilities() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: facilities, isLoading, error } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createFacility = useMutation({
    mutationFn: async (data: FacilityInsert) => {
      const { data: result, error } = await supabase
        .from("facilities")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast({
        title: "Facility Created",
        description: "The facility has been successfully created.",
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
    facilities,
    isLoading,
    error,
    createFacility,
  };
}
