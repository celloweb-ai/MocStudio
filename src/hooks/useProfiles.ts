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
      // Get all users with their roles who can be approvers
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role
        `);

      if (rolesError) throw rolesError;

      // Get unique user IDs that have approval-eligible roles
      const approverRoles = [
        "administrator",
        "facility_manager", 
        "process_engineer",
        "hse_coordinator",
        "approval_committee"
      ];
      
      const eligibleUserIds = [...new Set(
        userRoles
          .filter(ur => approverRoles.includes(ur.role))
          .map(ur => ur.user_id)
      )];

      if (eligibleUserIds.length === 0) {
        return [];
      }

      // Fetch profiles for eligible users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, department")
        .in("id", eligibleUserIds)
        .order("full_name", { ascending: true });

      if (profilesError) throw profilesError;

      // Create role map for each user
      const userRolesMap = new Map<string, string[]>();
      userRoles.forEach(ur => {
        const existing = userRolesMap.get(ur.user_id) || [];
        userRolesMap.set(ur.user_id, [...existing, ur.role]);
      });

      return profiles.map(profile => ({
        ...profile,
        roles: userRolesMap.get(profile.id) || [],
      }));
    },
    enabled: !!user,
  });
}
