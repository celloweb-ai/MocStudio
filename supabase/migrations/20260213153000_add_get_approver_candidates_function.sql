-- Return all users eligible to approve MOCs without relying on client-side access to user_roles.
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
    ARRAY_AGG(DISTINCT ur.role ORDER BY ur.role) AS roles
  FROM public.profiles p
  JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE ur.role IN (
    'administrator',
    'facility_manager',
    'process_engineer',
    'maintenance_technician',
    'hse_coordinator',
    'approval_committee'
  )
  GROUP BY p.id, p.full_name, p.email, p.department
  ORDER BY COALESCE(p.full_name, p.email);
$$;

GRANT EXECUTE ON FUNCTION public.get_approver_candidates() TO authenticated;

COMMENT ON FUNCTION public.get_approver_candidates() IS
  'Lists MOC approver candidates with their approval-eligible roles. Uses SECURITY DEFINER to avoid client RLS blind spots on user_roles.';
