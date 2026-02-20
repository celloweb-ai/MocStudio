# ⚡ Quick Fix: MOC Approvers Issue

## 🐛 Problem
```
No eligible approvers found.
Assign an approval role in user_roles for at least one user to enable approvals.
```

## ✅ Solution (3 Steps)

### Step 1: Apply Migration

1. Open Supabase Dashboard > SQL Editor
2. Copy content from: `supabase/migrations/20260213140000_setup_moc_approvers_workflow.sql`
3. Paste and click **RUN**

### Step 2: Verify Setup

Run this SQL to check if you have approvers:

```sql
SELECT 
  p.full_name,
  p.email,
  ur.role
FROM user_roles ur
JOIN profiles p ON p.id = ur.user_id
WHERE ur.role IN ('approval_committee', 'facility_manager', 'administrator');
```

**Expected**: At least 1 user with `approval_committee` role.

### Step 3: Test

1. Create a new MOC (status: draft)
2. Submit it (status changes to submitted)
3. Check approvers:

```sql
SELECT 
  m.request_number,
  COUNT(ma.id) as approver_count
FROM moc_requests m
LEFT JOIN moc_approvers ma ON ma.moc_request_id = m.id
WHERE m.request_number = 'MOC-2026-XXXX'  -- Replace with your MOC number
GROUP BY m.request_number;
```

**Expected**: `approver_count` > 0

## 🔧 If Still Not Working

### Manually Grant Approval Role

```sql
-- Find your user ID
SELECT id, email FROM profiles WHERE email = 'your-email@example.com';

-- Grant approval role (replace USER_ID_HERE)
INSERT INTO user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'approval_committee')
ON CONFLICT DO NOTHING;
```

## 🎯 What This Does

- ✅ Auto-grants `approval_committee` role to first admin
- ✅ Creates trigger to auto-assign approvers when MOC is submitted
- ✅ Backfills existing MOCs with approvers
- ✅ Adds `can_approve_mocs()` helper function

## 📝 Files

- Migration: `supabase/migrations/20260213140000_setup_moc_approvers_workflow.sql`
- Full guide: `CODEX_PROMPT_FIX_MOC_APPROVERS.md`

---

**Time to fix**: 2-3 minutes  
**Complexity**: Low (SQL only, no code deployment)
