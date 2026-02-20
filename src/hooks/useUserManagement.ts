import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface ManagedUser {
  id: string;
  full_name: string | null;
  email: string;
  department: string | null;
  status: string;
  facility_id: string | null;
  facility_name: string | null;
  roles: AppRole[];
  created_at: string;
  updated_at: string;
}

export function useUserManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["managed-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          department,
          status,
          facility_id,
          created_at,
          updated_at,
          facility:facilities(name)
        `)
        .order("full_name", { ascending: true });

      if (profilesError) throw profilesError;

      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const rolesMap = new Map<string, AppRole[]>();
      allRoles?.forEach((ur) => {
        const existing = rolesMap.get(ur.user_id) || [];
        rolesMap.set(ur.user_id, [...existing, ur.role]);
      });

      return (profiles ?? []).map((p): ManagedUser => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        department: p.department,
        status: (p as any).status ?? "active",
        facility_id: (p as any).facility_id,
        facility_name: (p.facility as any)?.name ?? null,
        roles: rolesMap.get(p.id) || [],
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (params: {
      userId: string;
      full_name?: string;
      email?: string;
      status?: string;
      facility_id?: string | null;
    }) => {
      const { userId, ...updates } = params;
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({ title: "User Updated", description: "Profile updated successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateRole = useMutation({
    mutationFn: async (params: { userId: string; newRole: AppRole }) => {
      // Remove existing roles
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", params.userId);
      if (deleteError) throw deleteError;

      // Insert new role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: params.userId, role: params.newRole });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({ title: "Role Updated", description: "User role updated successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async (params: { userId: string; currentStatus: string }) => {
      const newStatus = params.currentStatus === "active" ? "inactive" : "active";
      const { error } = await supabase
        .from("profiles")
        .update({ status: newStatus })
        .eq("id", params.userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({ title: "Status Updated", description: "User status changed." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("delete-user", {
        body: { userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({ title: "User Deleted", description: "The user has been permanently deleted." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return {
    users,
    isLoading,
    updateProfile,
    updateRole,
    toggleStatus,
    deleteUser,
  };
}
