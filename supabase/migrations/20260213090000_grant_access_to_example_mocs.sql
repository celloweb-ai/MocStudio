DO $$
DECLARE
  v_moc_id UUID;
  v_user_id UUID;
BEGIN
  FOR v_moc_id IN
    SELECT id
    FROM public.moc_requests
    WHERE title IN (
      'Replace Reactor Feed Pump Seal Plan',
      'Install Redundant Cooling Water Header',
      'Update Boiler Blowdown Procedure',
      'Replace Tank Level Transmitters with Radar',
      'Deploy Barcode Verification in Filling Line',
      'Temporary Bypass for Compressor Intercooler',
      'Upgrade UPS for DCS Cabinets',
      'Add Overflow Alarm to Slop Tank',
      'Standardize Line Clearance Checklist',
      'Replace Obsolete VFD on Agitator Motor',
      'Adjust Steam Trap Inspection Frequency',
      'Implement Tank Farm CCTV Analytics',
      'Install Dust Extraction Booster on Packaging Line',
      'Revise Permit to Work Isolation Matrix',
      'Replace Emergency Diesel Transfer Logic',
      'Upgrade Firewater Ring Main Isolation Valves',
      'Add Auto-Reject Gate for Underweight Packs',
      'Temporary Nitrogen Purge Procedure for Turnaround',
      'Install Vibration Sensors on Cooling Tower Fans',
      'Replace Tank Farm Lighting with LED Smart Controls'
    )
  LOOP
    FOR v_user_id IN SELECT id FROM auth.users LOOP
      INSERT INTO public.moc_approvers (moc_request_id, user_id, role_required, approval_order)
      VALUES (v_moc_id, v_user_id, 'process_engineer', 1)
      ON CONFLICT (moc_request_id, user_id, role_required) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;
