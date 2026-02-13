-- Migration: Setup MOC Approvers Workflow
-- This migration ensures that MOCs can be approved by setting up approval roles and auto-assignment

-- Step 1: Ensure at least one user has approval roles
-- Add approval committee role to all administrator users (if any)
DO $$
DECLARE
  granted_count INTEGER := 0;
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  SELECT ur.user_id, 'approval_committee'
  FROM public.user_roles ur
  WHERE ur.role = 'administrator'
  ON CONFLICT (user_id, role) DO NOTHING;

  GET DIAGNOSTICS granted_count = ROW_COUNT;

  IF granted_count > 0 THEN
    RAISE NOTICE 'Granted approval_committee role to % administrator user(s).', granted_count;
  ELSE
    RAISE NOTICE 'No new approval_committee grants were needed for administrator users.';
  END IF;

  -- Safety net: if there are still no approval committee members, warn operators.
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'approval_committee'
  ) THEN
    RAISE WARNING 'No approval_committee users found after setup. Assign at least one user manually to enable approvals.';
  END IF;
END $$;

-- Step 2: Create function to auto-assign approvers when MOC is submitted
CREATE OR REPLACE FUNCTION public.auto_assign_moc_approvers()
RETURNS TRIGGER AS $$
DECLARE
  approver_record RECORD;
  committee_assigned_count INTEGER := 0;
  facility_manager_assigned_count INTEGER := 0;
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
      
      committee_assigned_count := committee_assigned_count + 1;
    END LOOP;

    -- Also assign facility manager if different from creator
    IF NEW.facility_id IS NOT NULL THEN
      WITH inserted AS (
        INSERT INTO public.moc_approvers (moc_request_id, user_id, role_required, status)
        SELECT NEW.id, f.manager_id, 'facility_manager', 'pending'
        FROM public.facilities f
        WHERE f.id = NEW.facility_id 
          AND f.manager_id IS NOT NULL
          AND f.manager_id != NEW.created_by
        ON CONFLICT (moc_request_id, user_id) DO NOTHING
        RETURNING 1
      )
      SELECT COUNT(*) INTO facility_manager_assigned_count FROM inserted;
    END IF;

    -- Log the auto-assignment
    IF (committee_assigned_count + facility_manager_assigned_count) > 0 THEN
      INSERT INTO public.moc_history (moc_request_id, user_id, action, details)
      VALUES (
        NEW.id, 
        NEW.created_by, 
        'approvers_assigned', 
        jsonb_build_object(
          'count', committee_assigned_count + facility_manager_assigned_count,
          'approval_committee_count', committee_assigned_count,
          'facility_manager_count', facility_manager_assigned_count,
          'auto_assigned', true,
          'timestamp', NOW()
        )
      );
      
      RAISE NOTICE 'Auto-assigned % approvers to MOC %', committee_assigned_count + facility_manager_assigned_count, NEW.request_number;
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
  committee_assigned_count INTEGER;
  facility_manager_assigned_count INTEGER;
BEGIN
  FOR moc_record IN 
    SELECT m.id, m.request_number, m.created_by, m.facility_id
    FROM public.moc_requests m
    WHERE m.status IN ('submitted', 'under_review')
      AND NOT EXISTS (
        SELECT 1 FROM public.moc_approvers ma WHERE ma.moc_request_id = m.id
      )
  LOOP
    committee_assigned_count := 0;
    facility_manager_assigned_count := 0;
    
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
      
      committee_assigned_count := committee_assigned_count + 1;
    END LOOP;

    -- Assign facility manager
    IF moc_record.facility_id IS NOT NULL THEN
      WITH inserted AS (
        INSERT INTO public.moc_approvers (moc_request_id, user_id, role_required, status)
        SELECT moc_record.id, f.manager_id, 'facility_manager', 'pending'
        FROM public.facilities f
        WHERE f.id = moc_record.facility_id 
          AND f.manager_id IS NOT NULL
          AND f.manager_id != moc_record.created_by
        ON CONFLICT (moc_request_id, user_id) DO NOTHING
        RETURNING 1
      )
      SELECT COUNT(*) INTO facility_manager_assigned_count FROM inserted;
    END IF;

    IF (committee_assigned_count + facility_manager_assigned_count) > 0 THEN
      INSERT INTO public.moc_history (moc_request_id, user_id, action, details)
      VALUES (
        moc_record.id,
        moc_record.created_by,
        'approvers_backfilled',
        jsonb_build_object(
          'count', committee_assigned_count + facility_manager_assigned_count,
          'approval_committee_count', committee_assigned_count,
          'facility_manager_count', facility_manager_assigned_count,
          'auto_assigned', true,
          'backfilled', true,
          'timestamp', NOW()
        )
      );

      RAISE NOTICE 'Backfilled % approvers for MOC %', committee_assigned_count + facility_manager_assigned_count, moc_record.request_number;
    ELSE
      RAISE WARNING 'No approvers available to backfill MOC %', moc_record.request_number;
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
