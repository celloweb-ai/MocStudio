import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Asset {
  id: string;
  name: string;
  asset_type: string;
  facility_id: string | null;
  location: string | null;
  status: string;
  criticality: string;
  last_maintenance: string | null;
  asset_code: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  facilities?: { name: string } | null;
}

export interface AssetInsert {
  name: string;
  asset_type: string;
  facility_id?: string | null;
  location?: string | null;
  status?: string;
  criticality?: string;
  last_maintenance?: string | null;
  description?: string | null;
}

export function useAssets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*, facilities(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Asset[];
    },
    enabled: !!user,
  });

  const createAsset = useMutation({
    mutationFn: async (data: AssetInsert) => {
      const { data: result, error } = await supabase
        .from("assets")
        .insert({ ...data, created_by: user!.id })
        .select("*, facilities(name)")
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Asset Created", description: "The asset has been successfully created." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return { assets, isLoading, error, createAsset };
}
