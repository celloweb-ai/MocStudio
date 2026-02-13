# 🤖 Codex Prompt: Fix MOC Approvers Workflow

## 📋 Context

**Problem**: MOC Request form is returning the error message:
```
No eligible approvers found.
Assign an approval role in user_roles for at least one user to enable approvals.
```

**Root Cause**: 
- New MOC requests are created without approvers in the `moc_approvers` table
- No users have the `approval_committee` role assigned
- The approval workflow requires manual assignment of approvers

## 🎯 Solution Overview

Implement automatic approver assignment when a MOC is submitted, including:
1. Auto-grant `approval_committee` role to administrators
2. Create trigger to auto-assign approvers when MOC status changes to `submitted`
3. Backfill existing submitted MOCs with approvers
4. Add helper functions for approval permission checks

## 💻 Implementation Instructions for Codex

### Step 1: Apply the Migration File

A migration file has been created at:
```
supabase/migrations/20260213140000_setup_moc_approvers_workflow.sql
```

This migration needs to be applied to the Supabase database. Execute this SQL in the Supabase SQL Editor.

### Step 2: Verify Database Schema

The database already has these tables (from initial migration):

```sql
-- Users with approval permissions
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role public.app_role NOT NULL,  -- Can be 'approval_committee', 'facility_manager', etc.
  created_at TIMESTAMPTZ,
  UNIQUE(user_id, role)
);

-- Approvers assigned to each MOC
CREATE TABLE public.moc_approvers (
  id UUID PRIMARY KEY,
  moc_request_id UUID NOT NULL REFERENCES public.moc_requests(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role_required public.app_role NOT NULL,
  status public.approval_status DEFAULT 'pending',
  comments TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  UNIQUE(moc_request_id, user_id)
);
```

### Step 3: Understand the Auto-Assignment Logic

The migration creates a trigger function `auto_assign_moc_approvers()` that:

```sql
-- Triggered BEFORE UPDATE on moc_requests
-- When status changes from 'draft' to 'submitted'
-- Actions:
1. Find all users with role = 'approval_committee'
2. Exclude the MOC creator (created_by)
3. Insert records into moc_approvers with status='pending'
4. Also assign facility_manager if facility_id is set
5. Log assignment in moc_history table
```

### Step 4: Key Functions Created

**Function 1: Auto-assign approvers on submit**
```sql
CREATE FUNCTION public.auto_assign_moc_approvers()
RETURNS TRIGGER
-- Automatically assigns approvers when MOC status -> 'submitted'
```

**Function 2: Check if user can approve**
```sql
CREATE FUNCTION public.can_approve_mocs()
RETURNS BOOLEAN
-- Returns true if current user has approval_committee, facility_manager, or administrator role
```

### Step 5: Testing the Solution

**Test Script (run in Supabase SQL Editor):**

```sql
-- 1. Verify users with approval roles
SELECT 
  p.full_name,
  p.email,
  ur.role
FROM user_roles ur
JOIN profiles p ON p.id = ur.user_id
WHERE ur.role IN ('approval_committee', 'facility_manager', 'administrator')
ORDER BY p.full_name;

-- Expected: At least one user with 'approval_committee' role

-- 2. Create a test MOC (from app UI)
-- Title: "Test MOC - Approver Assignment"
-- Status: draft

-- 3. Submit the MOC (change status to 'submitted')
-- This should trigger auto_assign_moc_approvers()

-- 4. Verify approvers were assigned
SELECT 
  m.request_number,
  m.title,
  m.status,
  ma.user_id,
  p.full_name AS approver_name,
  p.email AS approver_email,
  ma.role_required,
  ma.status AS approval_status,
  ma.created_at
FROM moc_requests m
LEFT JOIN moc_approvers ma ON ma.moc_request_id = m.id
LEFT JOIN profiles p ON p.id = ma.user_id
WHERE m.request_number = 'MOC-2026-XXXX'  -- Replace with actual request number
ORDER BY ma.created_at;

-- Expected: One row per approver with status='pending'

-- 5. Check audit log
SELECT 
  h.action,
  h.details,
  h.created_at,
  p.full_name AS performed_by
FROM moc_history h
JOIN moc_requests m ON m.id = h.moc_request_id
JOIN profiles p ON p.id = h.user_id
WHERE m.request_number = 'MOC-2026-XXXX'
ORDER BY h.created_at DESC;

-- Expected: Entry with action='approvers_assigned'
```

### Step 6: Manual Approval Role Assignment (if needed)

If you need to manually grant approval_committee role to specific users:

```sql
-- Get user ID by email
SELECT id, email, full_name FROM profiles WHERE email = 'user@example.com';

-- Grant approval_committee role
INSERT INTO user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'approval_committee')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Step 7: Frontend Integration (Optional)

Update the MOC form to show feedback about approver assignment:

```typescript
// In MOC submission handler
const handleSubmit = async () => {
  try {
    // Update MOC status to 'submitted'
    const { error } = await supabase
      .from('moc_requests')
      .update({ status: 'submitted' })
      .eq('id', mocId);

    if (error) throw error;

    // Fetch assigned approvers
    const { data: approvers } = await supabase
      .from('moc_approvers')
      .select(`
        *,
        profiles:user_id(full_name, email)
      `)
      .eq('moc_request_id', mocId);

    // Show success message
    toast({
      title: 'MOC Submitted',
      description: `Assigned to ${approvers?.length || 0} approvers for review.`,
    });
  } catch (err) {
    console.error('Submission error:', err);
  }
};
```

## ✅ Success Criteria

After applying the migration, the following should be true:

- ✅ At least one user has `approval_committee` role in `user_roles` table
- ✅ When MOC status changes from `draft` to `submitted`, trigger fires
- ✅ Approvers are automatically inserted into `moc_approvers` table
- ✅ Approvers have `status = 'pending'`
- ✅ Assignment is logged in `moc_history` table
- ✅ Error "No eligible approvers found" no longer appears
- ✅ Existing submitted MOCs have approvers (via backfill)

## 🔧 Troubleshooting

**Issue: Migration fails with permission error**
- Solution: Ensure you're running as database owner or service_role
- Check: Run `SELECT current_user;` to verify user

**Issue: Trigger doesn't fire**
- Check: `SELECT * FROM pg_trigger WHERE tgname = 'auto_assign_approvers_on_submit';`
- Verify: Trigger is enabled and function exists

**Issue: No users have approval_committee role**
- Solution: Manually grant role to admin:
  ```sql
  INSERT INTO user_roles (user_id, role)
  SELECT id, 'approval_committee'
  FROM profiles
  WHERE email = 'admin@example.com'
  ON CONFLICT DO NOTHING;
  ```

**Issue: Approvers assigned but MOC still shows error**
- Check: Frontend query might be cached
- Solution: Refresh page or clear cache
- Verify: `SELECT * FROM moc_approvers WHERE moc_request_id = 'MOC_ID';`

## 📚 Related Files

- Migration file: `supabase/migrations/20260213140000_setup_moc_approvers_workflow.sql`
- Original schema: `supabase/migrations/20260206125054_55902d55-3af6-4483-8c4e-09d5d961e76b.sql`
- Frontend form: `src/pages/MOCRequest.tsx` (likely location)

## 🎯 Codex Action Items

1. **Apply the migration** in Supabase SQL Editor
2. **Verify** at least one user has `approval_committee` role
3. **Test** by creating and submitting a new MOC
4. **Confirm** approvers are auto-assigned
5. **Update** frontend (optional) to show approver count on submission

---

**Expected Outcome**: MOC submission workflow will automatically assign approvers, eliminating the "No eligible approvers found" error.

**Time to implement**: 5-10 minutes (migration application + verification)

**Complexity**: Low (database-only change, no code deployment needed)
