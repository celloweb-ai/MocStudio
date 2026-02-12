-- Migration: Seed 27 MOC Examples
-- Description: Creates 27 realistic Management of Change examples for offshore oil & gas platforms
-- Date: 2026-02-12

-- First, ensure we have example facilities
INSERT INTO public.facilities (id, name, code, facility_type, location, status)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'FPSO Marlin Alpha', 'FPSO-MA-01', 'FPSO', 'Campos Basin', 'active'),
  ('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Platform Papa Terra', 'PLT-PT-02', 'Fixed Platform', 'Campos Basin', 'active'),
  ('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'FPSO Cidade de Paraty', 'FPSO-CP-03', 'FPSO', 'Santos Basin', 'active')
ON CONFLICT (id) DO NOTHING;

-- Create 27 comprehensive MOC examples
DO $$
DECLARE
  v_facility_1 UUID := 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
  v_facility_2 UUID := 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e';
  v_facility_3 UUID := 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f';
  v_admin_user UUID;
BEGIN
  -- Get or create an admin user for MOC creation
  SELECT id INTO v_admin_user FROM auth.users LIMIT 1;
  
  IF v_admin_user IS NULL THEN
    -- If no users exist, create a system user
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
    VALUES (
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      'system@mocstudio.example',
      crypt('system_password', gen_salt('bf')),
      now(),
      '{"full_name": "System Administrator"}'
    )
    ON CONFLICT (id) DO NOTHING;
    v_admin_user := 'ffffffff-ffff-ffff-ffff-ffffffffffff';
  END IF;

  -- Insert 27 MOC examples
  INSERT INTO public.moc_requests (
    request_number, title, description, justification, facility_id, change_type, 
    priority, status, is_temporary, estimated_duration, affected_systems, affected_areas,
    risk_probability, risk_severity, risk_category, mitigation_measures, requires_hazop,
    target_implementation_date, created_by, created_at, submitted_at
  )
  VALUES
    -- MOC 1: Critical Safety System
    ('MOC-2026-0001', 'Upgrade Fire & Gas Detection System Firmware', 
     'Update firmware of the Honeywell Fire & Gas detection system from version 4.2 to 5.1 to address security vulnerabilities and improve detection algorithms.',
     'Current firmware version has known security vulnerabilities (CVE-2025-1234) and improved algorithms will reduce false positive alarms by 30%.',
     v_facility_1, 'software_change', 'high', 'approved',
     false, '4 hours', ARRAY['Fire & Gas System', 'ESD System', 'DCS'], ARRAY['Process Area', 'Living Quarters'],
     2, 4, 'Medium Risk', 'Backup system active during update, staged rollout, rollback plan prepared, parallel testing in simulator',
     true, '2026-03-15', v_admin_user, now() - interval '25 days', now() - interval '23 days'),

    -- MOC 2: Equipment Addition
    ('MOC-2026-0002', 'Install Additional HP Compressor Unit',
     'Installation of a new high-pressure compressor (Atlas Copco GA315) to increase gas processing capacity from 450 MMscfd to 550 MMscfd.',
     'Current production is limited by compressor capacity. New well completions will bring additional 120 MMscfd online by Q3 2026.',
     v_facility_1, 'equipment_addition', 'medium', 'under_review',
     false, '3 weeks', ARRAY['Gas Compression', 'Gas Treatment', 'Power Generation'], ARRAY['Compressor Module', 'Utility Area'],
     3, 4, 'High Risk', 'Full HAZOP study scheduled, temporary shutdown required, load analysis completed, foundation integrity verified',
     true, '2026-04-01', v_admin_user, now() - interval '18 days', now() - interval '16 days'),

    -- MOC 3: Procedure Change
    ('MOC-2026-0003', 'Update Emergency Shutdown Testing Procedure',
     'Revise ESD testing procedure to include new loop testing requirements per API RP 14C 8th edition and incorporate lessons learned from recent incident.',
     'New API standard requires more comprehensive loop testing. Recent incident (INC-2025-089) identified gaps in current testing methodology.',
     v_facility_2, 'procedure_change', 'high', 'approved',
     false, '2 weeks', ARRAY['ESD System', 'Safety Systems'], ARRAY['All Areas'],
     2, 3, 'Medium Risk', 'Training program developed, competency assessment required, procedure validation with operations team',
     false, '2026-02-28', v_admin_user, now() - interval '30 days', now() - interval '28 days'),

    -- MOC 4: Equipment Replacement
    ('MOC-2026-0004', 'Replace Seawater Lift Pumps (P-2201 A/B)',
     'Replace existing Sulzer seawater lift pumps with equivalent Flowserve pumps due to obsolescence and spare parts unavailability.',
     'Current pumps (installed 2015) are obsolete. OEM no longer supports parts. Recent bearing failure (WO-2025-2341) took 3 weeks to repair.',
     v_facility_2, 'equipment_replacement', 'medium', 'submitted',
     false, '2 weeks', ARRAY['Cooling Water System', 'Seawater System'], ARRAY['Utility Area'],
     2, 3, 'Medium Risk', 'New pumps meet same specifications, installation during planned shutdown, temporary cooling measures identified',
     false, '2026-05-10', v_admin_user, now() - interval '12 days', now() - interval '11 days'),

    -- MOC 5: Temporary Modification
    ('MOC-2026-0005', 'Temporary Bypass of Crude Oil Heater H-1203',
     'Install temporary bypass around crude oil heater H-1203 while permanent repairs are completed. Heater tube inspection revealed corrosion requiring replacement.',
     'Heater tube bundle replacement requires 8-week lead time. Temporary bypass allows continued operation at reduced rate (70% capacity).',
     v_facility_1, 'equipment_modification', 'critical', 'approved',
     true, '8 weeks', ARRAY['Crude Oil Processing', 'Heating System'], ARRAY['Process Area'],
     3, 3, 'Medium Risk', 'Flow calculations verified, pressure safety review completed, production rate limited to 70%, daily monitoring required',
     true, '2026-02-20', v_admin_user, now() - interval '8 days', now() - interval '7 days'),

    -- MOC 6: Software Change
    ('MOC-2026-0006', 'Upgrade DCS System to Yokogawa CENTUM VP R6.09',
     'Upgrade Distributed Control System from CENTUM VP R6.05 to R6.09 to enable advanced process control features and improve cybersecurity.',
     'Current version approaching end of life (Dec 2026). New version includes Model Predictive Control capabilities and enhanced security features.',
     v_facility_3, 'software_change', 'high', 'under_review',
     false, '1 week', ARRAY['DCS', 'Process Control', 'All Control Loops'], ARRAY['Control Room', 'All Process Areas'],
     3, 5, 'High Risk', 'Full factory acceptance testing completed, staged rollout plan, 48-hour parallel operation, vendor support on-site',
     true, '2026-06-01', v_admin_user, now() - interval '20 days', now() - interval '18 days'),

    -- MOC 7: Major Change
    ('MOC-2026-0007', 'Install Produced Water Treatment System',
     'Install new electrocoagulation system for produced water treatment to meet new discharge limits (Oil in water <15 ppm). System includes pumps, treatment skid, and monitoring equipment.',
     'New environmental regulations (ANP Resolution 123/2025) require oil in water discharge below 15 ppm by July 2026. Current system achieves 25-30 ppm.',
     v_facility_1, 'major_change', 'critical', 'under_review',
     false, '6 months', ARRAY['Produced Water System', 'Discharge System', 'Electrical System', 'Chemical Injection'], ARRAY['Process Area', 'Utility Area'],
     4, 4, 'High Risk', 'Full Environmental Impact Assessment completed, pilot testing successful, phased commissioning plan, regulatory approval obtained',
     true, '2026-06-30', v_admin_user, now() - interval '45 days', now() - interval '42 days'),

    -- MOC 8: Equipment Modification
    ('MOC-2026-0008', 'Modify HP Separator Pressure Relief Valve Setpoint',
     'Increase HP separator (V-1101) PSV-1101 setpoint from 850 psig to 950 psig to accommodate higher upstream pressure from new wells.',
     'New well completions have higher reservoir pressure (1200 psig vs 1000 psig). Current separator pressure limiting production rate.',
     v_facility_1, 'equipment_modification', 'high', 'approved',
     false, '1 week', ARRAY['Oil Separation', 'Pressure Safety System'], ARRAY['Process Area'],
     2, 4, 'Medium Risk', 'Vessel design pressure verified (1200 psig MAWP), relief calculations updated, downstream equipment rated for new pressure, PSV recertified',
     true, '2026-03-10', v_admin_user, now() - interval '15 days', now() - interval '13 days'),

    -- MOC 9: Procedure Change
    ('MOC-2026-0009', 'Implement New Confined Space Entry Procedure',
     'Update confined space entry procedure to incorporate IOGP Report 579 recommendations and include gas detector calibration verification.',
     'Gap analysis against IOGP 579 identified 8 improvements. Recent near-miss (NM-2025-456) highlighted need for enhanced gas detector verification.',
     v_facility_2, 'procedure_change', 'high', 'submitted',
     false, '3 weeks', ARRAY['HSE Management'], ARRAY['All Areas'],
     2, 4, 'Medium Risk', 'Training matrix developed, rescue team certification updated, equipment audit completed, procedure pilot tested',
     false, '2026-03-01', v_admin_user, now() - interval '10 days', now() - interval '9 days'),

    -- MOC 10: Equipment Addition
    ('MOC-2026-0010', 'Install Backup UPS System for Critical Control',
     'Install redundant UPS system (Emerson Liebert PSI 100kVA) for critical control systems to eliminate single point of failure.',
     'Current UPS system (installed 2012) has no backup. Failure would result in uncontrolled shutdown. Risk assessment identified as critical vulnerability.',
     v_facility_3, 'equipment_addition', 'critical', 'approved',
     false, '2 weeks', ARRAY['Electrical System', 'UPS System', 'DCS', 'Safety Systems'], ARRAY['Control Room', 'UPS Room'],
     2, 5, 'High Risk', 'Load calculations verified, automatic transfer switch tested, no-break installation procedure, commissioning plan with redundancy testing',
     false, '2026-02-25', v_admin_user, now() - interval '5 days', now() - interval '4 days'),

    -- MOC 11: Software Change
    ('MOC-2026-0011', 'Update Flow Computer Firmware and Measurement Algorithms',
     'Update Emerson ROC809 flow computer firmware to version 4.30 and implement new AGA-8 detailed characterization method for gas measurement.',
     'Current measurement uncertainty ±1.2%. New algorithms reduce uncertainty to ±0.8%, improving fiscal measurement accuracy by $2.5M annually.',
     v_facility_1, 'software_change', 'medium', 'under_review',
     false, '3 days', ARRAY['Flow Measurement', 'Fiscal Metering', 'Export System'], ARRAY['Metering Area'],
     2, 3, 'Medium Risk', 'Measurement validation protocol prepared, parallel operation for 30 days, custody transfer impact assessed, metrology review completed',
     false, '2026-03-20', v_admin_user, now() - interval '14 days', now() - interval '12 days'),

    -- MOC 12: Equipment Replacement
    ('MOC-2026-0012', 'Replace Gas Turbine Generator GT-1A',
     'Replace aging GE LM2500 gas turbine (GT-1A) with new Siemens SGT-400 unit to improve reliability and fuel efficiency.',
     'GT-1A has exceeded design life (180,000 operating hours vs 150,000 design). Availability dropped to 85%. New unit provides 15% better fuel efficiency.',
     v_facility_2, 'equipment_replacement', 'high', 'submitted',
     false, '4 months', ARRAY['Power Generation', 'Electrical Distribution', 'Fuel Gas System'], ARRAY['Generator Module'],
     3, 4, 'High Risk', 'Full electrical load study completed, foundation modifications designed, commissioning procedure prepared, parallel operation plan',
     true, '2026-08-01', v_admin_user, now() - interval '22 days', now() - interval '20 days'),

    -- MOC 13: Equipment Modification
    ('MOC-2026-0013', 'Install Vortex Breaker in Glycol Contactor Tower',
     'Install internal vortex breaker in glycol contactor tower (T-2301) to eliminate gas entrainment issues causing rich glycol carryover.',
     'Persistent foam carryover issues identified by glycol analysis. Vortex flow pattern confirmed by CFD study. Solution implemented successfully on sister platform.',
     v_facility_3, 'equipment_modification', 'medium', 'approved',
     false, '1 week', ARRAY['Gas Dehydration', 'Glycol System'], ARRAY['Gas Processing Area'],
     2, 2, 'Low Risk', 'CFD analysis completed, design verified, installation during planned shutdown, no process parameter changes required',
     false, '2026-04-05', v_admin_user, now() - interval '17 days', now() - interval '15 days'),

    -- MOC 14: Major Change
    ('MOC-2026-0014', 'Install Wellhead Monitoring and Control System',
     'Install automated wellhead monitoring system with 12 subsea sensors, topside SCADA integration, and automatic well shutdown capability.',
     'Manual monitoring insufficient for 8 subsea wells. New system enables real-time production optimization and early detection of well integrity issues.',
     v_facility_1, 'major_change', 'high', 'under_review',
     false, '5 months', ARRAY['Wellhead Control', 'Production Control', 'SCADA', 'Safety Systems'], ARRAY['Wellhead Area', 'Control Room'],
     3, 4, 'High Risk', 'Full subsea engineering study completed, ROV intervention procedures prepared, integration testing with existing ESD, cybersecurity review',
     true, '2026-07-15', v_admin_user, now() - interval '35 days', now() - interval '32 days'),

    -- MOC 15: Procedure Change
    ('MOC-2026-0015', 'Update Simultaneous Operations (SIMOPS) Matrix',
     'Revise SIMOPS matrix to include new drilling activities and update risk assessment for crane operations during helicopter operations.',
     'New drilling campaign planned for Q2 2026. Current SIMOPS matrix does not adequately address simultaneous drilling and production operations.',
     v_facility_2, 'procedure_change', 'high', 'approved',
     false, '2 weeks', ARRAY['HSE Management', 'Operations Management'], ARRAY['All Areas'],
     3, 4, 'High Risk', 'Multi-discipline workshops completed, dropped object study updated, rescue and evacuation plan revised, regulatory consultation completed',
     false, '2026-03-05', v_admin_user, now() - interval '7 days', now() - interval '6 days'),

    -- MOC 16: Equipment Addition
    ('MOC-2026-0016', 'Install Online Gas Chromatograph for Export Gas Quality',
     'Install Siemens Maxum II gas chromatograph for continuous monitoring of export gas composition (C1-C6+, CO2, N2).',
     'Manual sampling (4 samples/day) insufficient for contractual obligations. Continuous monitoring required by gas sales agreement amendment.',
     v_facility_1, 'equipment_addition', 'medium', 'submitted',
     false, '6 weeks', ARRAY['Gas Quality Control', 'Export System', 'Laboratory'], ARRAY['Analyzer Shelter'],
     2, 2, 'Low Risk', 'Sample conditioning system designed, calibration gas supply arranged, data integration with LIMS, training plan prepared',
     false, '2026-04-20', v_admin_user, now() - interval '11 days', now() - interval '10 days'),

    -- MOC 17: Software Change
    ('MOC-2026-0017', 'Implement Advanced Process Control for Crude Stabilization',
     'Implement model predictive control (MPC) strategy for crude stabilization column (C-1401) to optimize vapor recovery and reduce flaring.',
     'Current manual control results in 15% excess flaring. MPC implementation on similar facility reduced flaring by 60% and increased production by 2%.',
     v_facility_3, 'software_change', 'medium', 'under_review',
     false, '8 weeks', ARRAY['DCS', 'Crude Oil Processing', 'Flare System'], ARRAY['Process Area', 'Control Room'],
     2, 2, 'Low Risk', 'Process modeling completed, controller tuning in simulation, operator training program, gradual transition from manual to APC',
     true, '2026-05-01', v_admin_user, now() - interval '19 days', now() - interval '17 days'),

    -- MOC 18: Equipment Modification
    ('MOC-2026-0018', 'Upgrade Firewater Pump Discharge Pressure',
     'Modify firewater pump (P-5101) impeller to increase discharge pressure from 150 psig to 175 psig to meet new deluge system requirements.',
     'New deluge system installation (MOC-2026-0045) requires 175 psig at farthest nozzle. Current system pressure insufficient.',
     v_facility_1, 'equipment_modification', 'high', 'approved',
     false, '1 week', ARRAY['Firewater System', 'Fire Protection'], ARRAY['Utility Area'],
     2, 4, 'Medium Risk', 'Pump curves verified, motor capacity confirmed, piping stress analysis completed, system testing procedure prepared',
     false, '2026-02-28', v_admin_user, now() - interval '4 days', now() - interval '3 days'),

    -- MOC 19: Equipment Replacement
    ('MOC-2026-0019', 'Replace Obsolete Programmable Logic Controllers',
     'Replace 8 obsolete Allen Bradley PLC-5 controllers with modern ControlLogix L83E controllers including network infrastructure upgrade.',
     'PLC-5 platform discontinued by manufacturer (2021). Spare parts depleted. Recent controller failure (alarm system) took 1 week to resolve.',
     v_facility_2, 'equipment_replacement', 'critical', 'under_review',
     false, '3 months', ARRAY['PLC Systems', 'Safety Systems', 'Alarm System', 'Network'], ARRAY['All Areas'],
     3, 5, 'High Risk', 'Full migration testing completed, parallel operation plan, staged implementation, vendor commissioning support, detailed rollback procedure',
     true, '2026-06-15', v_admin_user, now() - interval '28 days', now() - interval '25 days'),

    -- MOC 20: Equipment Addition
    ('MOC-2026-0020', 'Install Hydrogen Sulfide Scavenger Injection System',
     'Install chemical injection system for triazine-based H2S scavenger to reduce H2S levels in crude oil from 150 ppm to <10 ppm.',
     'H2S levels increasing due to new well production. Corrosion monitoring shows accelerated rates. Export specification requires <10 ppm H2S.',
     v_facility_3, 'equipment_addition', 'high', 'submitted',
     false, '4 weeks', ARRAY['Chemical Injection', 'Crude Oil Processing', 'Safety Systems'], ARRAY['Process Area', 'Chemical Storage'],
     3, 4, 'High Risk', 'Materials compatibility verified, dosing calculations completed, toxic gas monitoring enhanced, emergency response procedures updated',
     true, '2026-04-10', v_admin_user, now() - interval '13 days', now() - interval '12 days'),

    -- MOC 21: Procedure Change
    ('MOC-2026-0021', 'Revise Cargo Tank Inspection and Cleaning Procedure',
     'Update cargo tank inspection procedure to incorporate drone inspection technology and reduce confined space entry requirements.',
     'Drone inspection can eliminate 70% of confined space entries. Technology proven on 5 FPSOs. Significant HSE benefit and time savings.',
     v_facility_1, 'procedure_change', 'medium', 'approved',
     false, '4 weeks', ARRAY['HSE Management', 'Cargo Operations'], ARRAY['Cargo Tanks'],
     2, 3, 'Medium Risk', 'Drone system qualified for hazardous areas, pilot program completed, inspection criteria validated, competency requirements defined',
     false, '2026-03-15', v_admin_user, now() - interval '9 days', now() - interval '8 days'),

    -- MOC 22: Software Change
    ('MOC-2026-0022', 'Upgrade CCTV and Access Control System',
     'Replace analog CCTV system with IP-based system (Genetec Security Center) including facial recognition and integrated access control.',
     'Current system (installed 2010) has poor image quality and no integration. New system improves security, enables remote monitoring, provides analytics.',
     v_facility_2, 'software_change', 'medium', 'under_review',
     false, '6 weeks', ARRAY['Security System', 'Network', 'Access Control'], ARRAY['All Areas'],
     2, 3, 'Medium Risk', 'Cybersecurity assessment completed, network bandwidth verified, phased installation during operations, data privacy review',
     false, '2026-05-05', v_admin_user, now() - interval '16 days', now() - interval '14 days'),

    -- MOC 23: Equipment Modification
    ('MOC-2026-0023', 'Modify Flare Tip for Smokeless Operation',
     'Replace existing flare tip with multi-point ground flare (John Zink) to achieve smokeless flaring and reduce noise levels.',
     'Current elevated flare produces visible smoke during high flow events. Environmental compliance requires smokeless operation. Noise complaints from nearby facility.',
     v_facility_3, 'equipment_modification', 'high', 'approved',
     false, '5 weeks', ARRAY['Flare System', 'Waste Gas System'], ARRAY['Flare Area'],
     2, 3, 'Medium Risk', 'Hydraulic analysis completed, structural integrity verified, dispersion modeling updated, noise study confirms compliance',
     true, '2026-04-25', v_admin_user, now() - interval '21 days', now() - interval '19 days'),

    -- MOC 24: Major Change
    ('MOC-2026-0024', 'Install Vapor Recovery Unit for Crude Storage Tanks',
     'Install vapor recovery unit (VRU) to capture and compress tank vapors (250 scf/min) for return to fuel gas system, eliminating venting.',
     'Current venting results in 2,500 tons CO2e annually. VRU achieves 95% VOC reduction, improves environmental performance, recovers $800K/year gas value.',
     v_facility_1, 'major_change', 'medium', 'under_review',
     false, '7 months', ARRAY['Crude Oil Storage', 'Vapor Recovery', 'Fuel Gas System', 'Electrical System'], ARRAY['Storage Tank Area', 'Utility Area'],
     3, 3, 'Medium Risk', 'Full process safety analysis completed, equipment specifications finalized, tie-in procedures prepared, commissioning plan with performance testing',
     true, '2026-09-01', v_admin_user, now() - interval '40 days', now() - interval '37 days'),

    -- MOC 25: Equipment Addition
    ('MOC-2026-0025', 'Install Subsea Chemical Injection Umbilical',
     'Install 3km subsea umbilical for methanol and corrosion inhibitor injection to 4 subsea wells, replacing batch treatment via wireline.',
     'Batch treatment via wireline costly ($250K per intervention) and weather-dependent. Continuous injection provides better flow assurance and corrosion control.',
     v_facility_2, 'equipment_addition', 'critical', 'submitted',
     false, '4 months', ARRAY['Chemical Injection', 'Subsea Systems', 'Flow Assurance'], ARRAY['Subsea Field', 'Chemical Storage'],
     3, 4, 'High Risk', 'Subsea engineering study completed, umbilical route survey performed, ROV installation procedures prepared, chemical compatibility verified',
     true, '2026-07-01', v_admin_user, now() - interval '26 days', now() - interval '24 days'),

    -- MOC 26: Equipment Replacement
    ('MOC-2026-0026', 'Replace Crude Oil Export Pumps with Higher Efficiency Units',
     'Replace 3 crude oil export pumps (Sulzer) with new high-efficiency pumps (ITT Goulds) reducing energy consumption by 18%.',
     'Current pumps (2008) operate at 65% efficiency vs 83% for modern equivalents. Energy savings: 2.8 GWh/year ($420K). ROI: 2.1 years.',
     v_facility_3, 'equipment_replacement', 'medium', 'approved',
     false, '8 weeks', ARRAY['Crude Oil Export', 'Electrical System'], ARRAY['Export Pump Area'],
     2, 2, 'Low Risk', 'Hydraulic analysis completed, electrical load study updated, installation during planned maintenance, performance testing protocol',
     false, '2026-05-20', v_admin_user, now() - interval '6 days', now() - interval '5 days'),

    -- MOC 27: Procedure Change
    ('MOC-2026-0027', 'Implement Risk-Based Inspection (RBI) Program',
     'Replace time-based inspection program with API 580/581 risk-based inspection methodology for pressure vessels and piping systems.',
     'Current time-based inspections inefficient. RBI enables optimization: high-risk items inspected more frequently, low-risk less. Industry best practice.',
     v_facility_1, 'procedure_change', 'medium', 'under_review',
     false, '12 weeks', ARRAY['Integrity Management', 'Inspection Program'], ARRAY['All Process Areas'],
     2, 3, 'Medium Risk', 'RBI software implemented (DNV Synergi), equipment inventory completed, consequence analysis performed, inspector training program developed',
     true, '2026-06-01', v_admin_user, now() - interval '24 days', now() - interval '22 days');

END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_moc_requests_request_number ON public.moc_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_moc_requests_change_type ON public.moc_requests(change_type);
CREATE INDEX IF NOT EXISTS idx_moc_requests_priority ON public.moc_requests(priority);
CREATE INDEX IF NOT EXISTS idx_moc_requests_target_date ON public.moc_requests(target_implementation_date);

-- Grant access to authenticated users
GRANT SELECT ON public.moc_requests TO authenticated;
GRANT SELECT ON public.facilities TO authenticated;
