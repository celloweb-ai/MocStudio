DO $$
DECLARE
  v_user_id UUID;
  v_facility_id UUID;
  rec RECORD;
  v_inserted_count INTEGER := 0;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  ORDER BY created_at
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Skipping MOC example top-up: no users found in auth.users.';
    RETURN;
  END IF;

  FOR rec IN
    SELECT *
    FROM (
      VALUES
        ('FAC-NPP','Implementar monitoramento online de corrosão em linhas de amina','Instalar cupons eletrônicos e transmissão para historiador nas linhas críticas de amina rica e pobre.','Taxa de corrosão média aumentou 18% no último trimestre e inspeções manuais não capturam variações operacionais.','equipment_addition','high','under_review',false,'12 days',ARRAY['Sistema de amina','Historiador de processo'],ARRAY['Unidade de tratamento de gás'],3,4,'high','Definir limites de alarme, validar leituras com ultrassom e revisar plano de integridade trimestralmente.',true,20,14),
        ('FAC-UPB','Revisar lógica de shedding de carga elétrica','Atualizar matriz de shedding para priorização dinâmica de cargas essenciais durante afundamentos de tensão.','Eventos recentes de subtensão provocaram desligamentos desnecessários em utilidades não críticas.','software_change','critical','approved',false,'8 days',ARRAY['Distribuição elétrica','PLC de utilidades','DCS'],ARRAY['Subestação principal','Sala elétrica'],4,5,'critical','Testes FAT/SAT com cenários de falha, janela controlada de comissionamento e plano de rollback validado.',true,9,7),
        ('FAC-TFE','Padronizar procedimento de drenagem de fundo de tanques','Criar procedimento operacional com checklist digital, bloqueios e critérios de descarte para drenagem de fundo.','Auditoria interna identificou variabilidade entre turnos e risco de contaminação no manuseio de borras.','procedure_change','medium','submitted',false,'4 days',ARRAY['SOP de operação','Gestão ambiental'],ARRAY['Tank farm east'],2,3,'medium','Treinamento por turno, inspeção HSE nas 2 primeiras semanas e revisão de conformidade mensal.',false,11,10),
        ('FAC-LAB','Substituir estufa analítica por modelo com rastreabilidade digital','Trocar estufa de secagem por equipamento com registro automático de curva térmica e integração ao LIMS.','Equipamento atual não possui trilha eletrônica de dados, dificultando investigações de desvios de qualidade.','equipment_replacement','medium','draft',false,'7 days',ARRAY['Laboratório QA','LIMS'],ARRAY['Laboratory & QA Center'],2,2,'low','Qualificação IQ/OQ/PQ, calibração rastreável RBC e execução paralela por 5 dias úteis.',false,15,12)
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
      moc_review_days
    )
  LOOP
    IF EXISTS (
      SELECT 1
      FROM public.moc_requests
      WHERE title = rec.moc_title
    ) THEN
      CONTINUE;
    END IF;

    SELECT id INTO v_facility_id
    FROM public.facilities
    WHERE code = rec.facility_code
    LIMIT 1;

    IF v_facility_id IS NULL THEN
      CONTINUE;
    END IF;

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
      rec.moc_description,
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

    v_inserted_count := v_inserted_count + 1;
  END LOOP;

  RAISE NOTICE 'MOC example catalog expanded to 27 itens. Inseridos % novos registros.', v_inserted_count;
END;
$$;
