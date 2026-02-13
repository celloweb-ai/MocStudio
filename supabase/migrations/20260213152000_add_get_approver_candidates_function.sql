-- Provide a stable, policy-independent source for approver discovery in the MOC wizard.
CREATE OR REPLACE FUNCTION public.get_approver_candidates()
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  department TEXT,
  roles public.app_role[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.full_name,
    p.email,
    p.department,
    ARRAY_AGG(DISTINCT ur.role ORDER BY ur.role)::public.app_role[] AS roles
  FROM public.user_roles ur
  JOIN public.profiles p ON p.id = ur.user_id
  WHERE ur.role = ANY (
    ARRAY[
      'administrator'::public.app_role,
      'facility_manager'::public.app_role,
      'process_engineer'::public.app_role,
      'maintenance_technician'::public.app_role,
      'hse_coordinator'::public.app_role,
      'approval_committee'::public.app_role
    ]
  )
  GROUP BY p.id, p.full_name, p.email, p.department
  ORDER BY p.full_name NULLS LAST, p.email;
$$;

GRANT EXECUTE ON FUNCTION public.get_approver_candidates() TO authenticated;
