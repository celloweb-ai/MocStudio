-- Migration: Setup MOC Approvers Workflow
-- This migration ensures that MOCs can be approved by setting up approval roles and auto-assignment

-- Step 1: Ensure at least one user has approval roles
-- Add approval committee role to the first admin user (if exists)
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find first administrator
  SELECT user_id INTO admin_user_id
  FROM public.user_roles
  WHERE role = 'administrator'
  LIMIT 1;

  -- If an admin exists, grant them approval_committee role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'approval_committee')
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Granted approval_committee role to admin user: %', admin_user_id;
  END IF;
END $$;

-- Step 2: Create function to auto-assign approvers when MOC is submitted
CREATE OR REPLACE FUNCTION public.auto_assign_moc_approvers()
RETURNS TRIGGER AS $$
DECLARE
  approver_record RECORD;
  assigned_count INTEGER := 0;
BEGIN
  -- Only auto-assign when status changes to 'submitted' from 'draft'
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status = 'draft') THEN
    
    -- Clear any existing approvers first
    DELETE FROM public.moc_approvers WHERE moc_request_id = NEW.id;
    
    -- Assign users with approval_committee role
    FOR approver_record IN 
      SELECT DISTINCT ur.user_id
      FROM public.user_roles ur
      WHERE ur.role = 'approval_committee'
        AND ur.user_id != NEW.created_by  -- Don't assign creator as approver
    LOOP
      INSERT INTO public.moc_approvers (moc_request_id, user_id, role_required, status)
      VALUES (NEW.id, approver_record.user_id, 'approval_committee', 'pending')
      ON CONFLICT (moc_request_id, user_id) DO NOTHING;
      
      assigned_count := assigned_count + 1;
    END LOOP;

    -- Also assign facility manager if different from creator
    IF NEW.facility_id IS NOT NULL THEN
      INSERT INTO public.moc_approvers (moc_request_id, user_id, role_required, status)
      SELECT NEW.id, f.manager_id, 'facility_manager', 'pending'
      FROM public.facilities f
      WHERE f.id = NEW.facility_id 
        AND f.manager_id IS NOT NULL
        AND f.manager_id != NEW.created_by
      ON CONFLICT (moc_request_id, user_id) DO NOTHING;
    END IF;

    -- Log the auto-assignment
    IF assigned_count > 0 THEN
      INSERT INTO public.moc_history (moc_request_id, user_id, action, details)
      VALUES (
        NEW.id, 
        NEW.created_by, 
        'approvers_assigned', 
        jsonb_build_object(
          'count', assigned_count,
          'auto_assigned', true,
          'timestamp', NOW()
        )
      );
      
      RAISE NOTICE 'Auto-assigned % approvers to MOC %', assigned_count, NEW.request_number;
    ELSE
      RAISE WARNING 'No approvers found for MOC %. Please ensure users have approval_committee role.', NEW.request_number;
    END IF;
    
    -- Update submitted_at timestamp
    NEW.submitted_at := NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_assign_approvers_on_submit ON public.moc_requests;

-- Create trigger for auto-assignment
CREATE TRIGGER auto_assign_approvers_on_submit
  BEFORE UPDATE ON public.moc_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_moc_approvers();

-- Step 3: Backfill approvers for any existing submitted MOCs without approvers
DO $$
DECLARE
  moc_record RECORD;
  approver_record RECORD;
  assigned_count INTEGER;
BEGIN
  FOR moc_record IN 
    SELECT m.id, m.request_number, m.created_by, m.facility_id
    FROM public.moc_requests m
    WHERE m.status IN ('submitted', 'under_review')
      AND NOT EXISTS (
        SELECT 1 FROM public.moc_approvers ma WHERE ma.moc_request_id = m.id
      )
  LOOP
    assigned_count := 0;
    
    -- Assign approval committee members
    FOR approver_record IN
      SELECT DISTINCT ur.user_id
      FROM public.user_roles ur
      WHERE ur.role = 'approval_committee'
        AND ur.user_id != moc_record.created_by
    LOOP
      INSERT INTO public.moc_approvers (moc_request_id, user_id, role_required, status)
      VALUES (moc_record.id, approver_record.user_id, 'approval_committee', 'pending')
      ON CONFLICT (moc_request_id, user_id) DO NOTHING;
      
      assigned_count := assigned_count + 1;
    END LOOP;

    -- Assign facility manager
    IF moc_record.facility_id IS NOT NULL THEN
      INSERT INTO public.moc_approvers (moc_request_id, user_id, role_required, status)
      SELECT moc_record.id, f.manager_id, 'facility_manager', 'pending'
      FROM public.facilities f
      WHERE f.id = moc_record.facility_id 
        AND f.manager_id IS NOT NULL
        AND f.manager_id != moc_record.created_by
      ON CONFLICT (moc_request_id, user_id) DO NOTHING;
    END IF;

    IF assigned_count > 0 THEN
      RAISE NOTICE 'Backfilled % approvers for MOC %', assigned_count, moc_record.request_number;
    END IF;
  END LOOP;
END $$;

-- Step 4: Create helper function to check if user can approve MOCs
CREATE OR REPLACE FUNCTION public.can_approve_mocs()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('approval_committee', 'facility_manager', 'administrator')
  )
$$;

-- Step 5: Add comments for documentation
COMMENT ON FUNCTION public.auto_assign_moc_approvers() IS 'Automatically assigns approvers to MOC when status changes to submitted';
COMMENT ON FUNCTION public.can_approve_mocs() IS 'Checks if current user has permission to approve MOCs';
COMMENT ON TABLE public.moc_approvers IS 'Tracks approval workflow for MOC requests. Approvers are auto-assigned when MOC is submitted.';
