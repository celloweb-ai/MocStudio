DO $$
DECLARE
  v_user_id UUID;
  v_facility_id UUID;
  v_asset_id UUID;
  rec RECORD;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  ORDER BY created_at
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Skipping MOC/asset example seed: no users found in auth.users.';
    RETURN;
  END IF;


  IF EXISTS (
    SELECT 1
    FROM public.moc_requests
    WHERE title = 'Replace Reactor Feed Pump Seal Plan'
  ) THEN
    RAISE NOTICE 'Skipping MOC/asset example backfill: sample data already exists.';
    RETURN;
  END IF;

  INSERT INTO public.facilities (name, code, facility_type, location, manager_id, status)
  VALUES
    ('North Process Plant', 'FAC-NPP', 'Processing', 'North Industrial Zone', v_user_id, 'active'),
    ('Utilities & Power Block', 'FAC-UPB', 'Utilities', 'Central Utilities Yard', v_user_id, 'active'),
    ('Tank Farm East', 'FAC-TFE', 'Storage', 'Eastern Perimeter', v_user_id, 'active'),
    ('Packaging & Dispatch', 'FAC-PAD', 'Packaging', 'South Logistics Corridor', v_user_id, 'active')
  ON CONFLICT (code) DO NOTHING;

  FOR rec IN
    SELECT *
    FROM (
      VALUES
        ('FAC-NPP','Replace Reactor Feed Pump Seal Plan','Seal plan upgrade to API Plan 53B for improved reliability.','Frequent seal failures are causing unplanned downtime.','equipment_modification','high','submitted',false,'7 days',ARRAY['Reactor feed line','Seal support system'],ARRAY['Pump bay 2'],4,4,'high','Install dual seal cartridge and set alarm on seal pot pressure.',false,10,14,'Reactor Feed Pump P-201A'),
        ('FAC-NPP','Install Redundant Cooling Water Header','Add parallel cooling water header to maintain flow during maintenance.','Single header creates single point of failure for critical exchangers.','equipment_addition','critical','under_review',false,'21 days',ARRAY['Cooling water network','Heat exchanger bank'],ARRAY['Unit 100'],3,5,'high','Tie-in during planned shutdown and perform hydrotest before start-up.',true,30,21,'Cooling Water Header CW-2B'),
        ('FAC-UPB','Update Boiler Blowdown Procedure','Revise blowdown frequency and sampling checklist.','Current procedure does not address variable load operation.','procedure_change','medium','approved',false,'3 days',ARRAY['Boiler B-01','Water chemistry controls'],ARRAY['Boiler house'],2,3,'medium','Train operators and add DCS reminders for blowdown windows.',false,7,10,'Boiler Blowdown Skid BDS-01'),
        ('FAC-TFE','Replace Tank Level Transmitters with Radar','Swap legacy displacer transmitters with radar level devices.','Existing instruments drift and require frequent recalibration.','equipment_replacement','high','implemented',false,'14 days',ARRAY['Tank gauging','Inventory management'],ARRAY['Tank farm east'],3,4,'high','Install stilling wells and validate calibration against manual dip.',false,20,15,'Crude Tank Radar LT-401'),
        ('FAC-PAD','Deploy Barcode Verification in Filling Line','Enable inline barcode verification before palletizing.','Reduce mislabeling incidents and customer complaints.','software_change','medium','submitted',false,'10 days',ARRAY['Filling line PLC','MES interface'],ARRAY['Line 3'],2,3,'medium','Run pilot on one SKU before full rollout.',false,18,12,'Packaging Vision Station VS-03'),
        ('FAC-NPP','Temporary Bypass for Compressor Intercooler','Install temporary bypass spool for intercooler maintenance.','Required to keep production while tube bundle is repaired.','major_change','critical','approved',true,'5 days',ARRAY['Compressor train C-10','Intercooler IC-10'],ARRAY['Compression area'],4,5,'critical','Limit runtime to 72 hours and monitor discharge temperature hourly.',true,5,4,'Compressor Intercooler IC-10'),
        ('FAC-UPB','Upgrade UPS for DCS Cabinets','Increase UPS autonomy from 15 to 45 minutes.','Recent grid instability increased risk of process trips.','equipment_modification','high','under_review',false,'12 days',ARRAY['DCS cabinets','Power distribution'],ARRAY['Control room'],3,4,'high','Stage installation by cabinet group to avoid full outage.',false,25,16,'DCS UPS System UPS-DCS-01'),
        ('FAC-TFE','Add Overflow Alarm to Slop Tank','Add independent high-high level alarm and horn beacon.','Current single alarm does not meet updated site standard.','equipment_addition','high','draft',false,'6 days',ARRAY['Slop tank instrumentation'],ARRAY['Tank T-09'],3,4,'high','Use SIL-capable switch and test quarterly.',false,14,10,'Slop Tank High-High Alarm LAH-09'),
        ('FAC-PAD','Standardize Line Clearance Checklist','Create mandatory digital line clearance checklist.','Different shifts apply inconsistent startup checks.','procedure_change','low','approved',false,'2 days',ARRAY['Packaging SOP','Shift handover'],ARRAY['All packaging lines'],1,2,'low','Audit checklist completion weekly for first month.',false,6,7,'Line Clearance Terminal LCT-01'),
        ('FAC-NPP','Replace Obsolete VFD on Agitator Motor','Install new VFD model with spare parts availability.','Obsolete drive has repeated faults and no OEM support.','equipment_replacement','high','submitted',false,'9 days',ARRAY['Agitator M-302','MCC-3'],ARRAY['Reactor 3 platform'],3,4,'high','Pre-configure drive parameters offline before installation.',false,16,12,'Agitator VFD AVD-302'),
        ('FAC-UPB','Adjust Steam Trap Inspection Frequency','Move from quarterly to monthly inspections on critical loops.','Steam losses increased due to delayed trap failure detection.','procedure_change','medium','implemented',false,'1 day',ARRAY['Steam distribution'],ARRAY['Utilities loop A'],2,3,'medium','Use ultrasonic tester and update trap route records.',false,4,5,'Steam Trap Route STR-A'),
        ('FAC-TFE','Implement Tank Farm CCTV Analytics','Enable intrusion and spill detection analytics.','Manual monitoring has delayed incident detection.','software_change','medium','under_review',false,'15 days',ARRAY['CCTV network','Safety monitoring'],ARRAY['Tank farm perimeter'],2,4,'medium','Configure event thresholds and test with simulated scenarios.',false,22,18,'Tank Farm CCTV Node CAM-TFE-01'),
        ('FAC-PAD','Install Dust Extraction Booster Fan','Add booster fan at secondary bagging station.','Dust concentration exceeds comfort limits during peak runs.','equipment_addition','high','submitted',false,'8 days',ARRAY['Dust collection system'],ARRAY['Bagging station 2'],3,3,'medium','Balance airflow and verify noise compliance after startup.',false,12,9,'Dust Booster Fan DBF-02'),
        ('FAC-NPP','Revise Permit to Work Isolation Matrix','Expand isolation matrix with new process tie-ins.','Recent tie-ins are not covered in legacy matrix.','major_change','medium','approved',false,'4 days',ARRAY['PTW system','Isolation procedures'],ARRAY['Entire plant'],2,4,'medium','Conduct supervisor workshop before enforcement.',false,9,8,'Isolation Matrix Register IMR-2026'),
        ('FAC-UPB','Replace Emergency Diesel Transfer Logic','Rewrite auto-transfer logic for improved failover reliability.','Current sequence occasionally delays emergency bus energization.','software_change','critical','under_review',false,'11 days',ARRAY['Emergency power PLC','Diesel generator DG-01'],ARRAY['Power house'],4,5,'critical','Validate in simulation and perform staged live test.',true,19,14,'Emergency Transfer Controller ETC-01'),
        ('FAC-TFE','Upgrade Firewater Ring Main Isolation Valves','Replace manual valves with gear-operated valves.','Current valves cannot be reliably operated during emergencies.','equipment_replacement','critical','submitted',false,'20 days',ARRAY['Firewater network'],ARRAY['Ring main east'],3,5,'high','Keep temporary bypass and coordinate with fire team.',true,28,20,'Firewater Isolation Valve FWV-E12'),
        ('FAC-PAD','Add Auto-Reject Gate for Underweight Packs','Install actuator gate tied to checkweigher output.','Manual rejection creates operator bottleneck and misses defects.','equipment_modification','high','draft',false,'7 days',ARRAY['Checkweigher','Conveyor controls'],ARRAY['Line 2 discharge'],3,3,'medium','Implement fail-safe default closed logic and e-stop integration.',false,13,11,'Auto-Reject Gate ARG-02'),
        ('FAC-NPP','Temporary Nitrogen Purge Procedure for Turnaround','Define temporary purge sequence for catalyst changeout.','Need safe inerting method during turnaround window.','procedure_change','critical','approved',true,'3 days',ARRAY['Nitrogen header','Reactor turnaround'],ARRAY['Reactor 1'],4,5,'critical','Require gas testing at each purge stage with signoff.',true,3,3,'Nitrogen Purge Panel N2P-01'),
        ('FAC-UPB','Install Vibration Sensors on Cooling Tower Fans','Add online vibration monitoring to fan gearboxes.','Unexpected gearbox failures caused two recent outages.','equipment_addition','medium','implemented',false,'9 days',ARRAY['Cooling tower CT-1','Condition monitoring'],ARRAY['Fan deck'],2,4,'medium','Set alert thresholds based on baseline commissioning data.',false,11,9,'Cooling Tower Vibration Sensor VS-CT1'),
        ('FAC-TFE','Replace Tank Farm Lighting with LED Smart Controls','Upgrade fixtures and add dusk-based dimming controls.','Reduce energy use and improve nighttime visibility.','equipment_replacement','low','approved',false,'18 days',ARRAY['Area lighting','Electrical distribution'],ARRAY['Tank farm roads'],1,2,'low','Phase installation by feeder to maintain minimum lux level.',false,24,17,'Tank Farm LED Lighting Panel LP-TFE')
    ) AS t(
      facility_code,
      moc_title,
      moc_description,
      moc_justification,
      moc_change_type,
      moc_priority,
      moc_status,
      moc_is_temporary,
      moc_estimated_duration,
      moc_affected_systems,
      moc_affected_areas,
      moc_risk_probability,
      moc_risk_severity,
      moc_risk_category,
      moc_mitigation,
      moc_requires_hazop,
      moc_target_days,
      moc_review_days,
      asset_name
    )
  LOOP
    SELECT id INTO v_facility_id
    FROM public.facilities
    WHERE code = rec.facility_code
    LIMIT 1;

    IF v_facility_id IS NULL THEN
      CONTINUE;
    END IF;

    INSERT INTO public.assets (
      name,
      asset_type,
      facility_id,
      location,
      status,
      criticality,
      last_maintenance,
      description,
      created_by
    )
    VALUES (
      rec.asset_name,
      CASE rec.moc_change_type
        WHEN 'software_change' THEN 'Control System'
        WHEN 'procedure_change' THEN 'Procedure'
        WHEN 'major_change' THEN 'Process Safety'
        ELSE 'Mechanical'
      END,
      v_facility_id,
      rec.moc_affected_areas[1],
      'active',
      CASE rec.moc_priority
        WHEN 'critical' THEN 'critical'
        WHEN 'high' THEN 'high'
        ELSE 'medium'
      END,
      now()::date - ((random() * 180)::int || ' days')::interval,
      'Example asset created for demo MOC: ' || rec.moc_title,
      v_user_id
    )
    RETURNING id INTO v_asset_id;

    INSERT INTO public.moc_requests (
      title,
      description,
      justification,
      facility_id,
      change_type,
      priority,
      status,
      is_temporary,
      estimated_duration,
      affected_systems,
      affected_areas,
      risk_probability,
      risk_severity,
      risk_category,
      mitigation_measures,
      requires_hazop,
      target_implementation_date,
      review_deadline,
      created_by,
      submitted_at,
      completed_at
    )
    VALUES (
      rec.moc_title,
      rec.moc_description || ' Related asset ID: ' || v_asset_id::text,
      rec.moc_justification,
      v_facility_id,
      rec.moc_change_type::public.moc_change_type,
      rec.moc_priority::public.moc_priority,
      rec.moc_status::public.moc_status,
      rec.moc_is_temporary,
      rec.moc_estimated_duration,
      rec.moc_affected_systems,
      rec.moc_affected_areas,
      rec.moc_risk_probability,
      rec.moc_risk_severity,
      rec.moc_risk_category,
      rec.moc_mitigation,
      rec.moc_requires_hazop,
      now()::date + ((rec.moc_target_days::text || ' days')::interval),
      now()::date + ((rec.moc_review_days::text || ' days')::interval),
      v_user_id,
      CASE WHEN rec.moc_status IN ('submitted', 'under_review', 'approved', 'implemented') THEN now() - interval '2 days' ELSE NULL END,
      CASE WHEN rec.moc_status = 'implemented' THEN now() - interval '1 day' ELSE NULL END
    );
  END LOOP;
END;
$$;
