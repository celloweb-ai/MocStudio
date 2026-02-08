-- Create a function to send email notifications via edge function
CREATE OR REPLACE FUNCTION public.send_notification_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
  user_name TEXT;
  email_subject TEXT;
  notification_type TEXT;
  moc_record RECORD;
  task_record RECORD;
  email_data JSONB;
BEGIN
  -- Get user email and name
  SELECT email, full_name INTO user_email, user_name
  FROM public.profiles
  WHERE id = NEW.user_id;

  IF user_email IS NULL THEN
    RETURN NEW;
  END IF;

  notification_type := NEW.category;
  email_data := '{}'::JSONB;

  -- Build email data based on notification type
  IF NEW.reference_type = 'moc_request' AND NEW.reference_id IS NOT NULL THEN
    SELECT id, title, request_number, status 
    INTO moc_record
    FROM public.moc_requests
    WHERE id = NEW.reference_id::uuid;

    IF moc_record IS NOT NULL THEN
      email_data := email_data || jsonb_build_object(
        'moc_id', moc_record.id,
        'moc_title', moc_record.title,
        'moc_number', moc_record.request_number,
        'action_url', 'https://mocstudio.lovable.app/moc/' || moc_record.id
      );
    END IF;
  END IF;

  IF NEW.reference_type = 'moc_task' AND NEW.reference_id IS NOT NULL THEN
    SELECT t.id, t.title, t.due_date, t.moc_request_id, m.title as moc_title, m.request_number
    INTO task_record
    FROM public.moc_tasks t
    LEFT JOIN public.moc_requests m ON t.moc_request_id = m.id
    WHERE t.id = NEW.reference_id::uuid;

    IF task_record IS NOT NULL THEN
      email_data := email_data || jsonb_build_object(
        'task_id', task_record.id,
        'task_title', task_record.title,
        'due_date', task_record.due_date,
        'moc_title', task_record.moc_title,
        'moc_number', task_record.request_number,
        'action_url', 'https://mocstudio.lovable.app/moc/' || task_record.moc_request_id
      );
    END IF;
  END IF;

  -- Set email subject based on category
  CASE NEW.category
    WHEN 'moc_status' THEN
      email_subject := 'MOC Status Update: ' || COALESCE((email_data->>'moc_number')::text, 'N/A');
    WHEN 'moc_approval' THEN
      email_subject := 'MOC Approval Required: ' || COALESCE((email_data->>'moc_number')::text, 'N/A');
    WHEN 'task_assigned' THEN
      email_subject := 'New Task Assigned: ' || COALESCE((email_data->>'task_title')::text, NEW.title);
    WHEN 'task_due' THEN
      email_subject := 'Task Due Reminder: ' || COALESCE((email_data->>'task_title')::text, NEW.title);
    WHEN 'comment' THEN
      email_subject := 'New Comment on MOC: ' || COALESCE((email_data->>'moc_number')::text, 'N/A');
    ELSE
      email_subject := NEW.title;
  END CASE;

  -- Call the edge function to send email (async via pg_net if available, otherwise skip)
  -- This uses a simple HTTP call approach
  PERFORM net.http_post(
    url := 'https://puhfsowwojtkrchkdpci.supabase.co/functions/v1/send-notification-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'notification_id', NEW.id,
      'to_email', user_email,
      'to_name', user_name,
      'subject', email_subject,
      'notification_type', notification_type,
      'data', email_data
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Failed to send notification email: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Create trigger to send emails when notifications are created
DROP TRIGGER IF EXISTS trigger_send_notification_email ON public.notifications;
CREATE TRIGGER trigger_send_notification_email
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.send_notification_email();

-- Also create a function to manually trigger approval request notifications
CREATE OR REPLACE FUNCTION public.notify_moc_approval_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  moc_title TEXT;
  moc_number TEXT;
BEGIN
  -- Get MOC details
  SELECT title, request_number INTO moc_title, moc_number
  FROM public.moc_requests
  WHERE id = NEW.moc_request_id;

  -- Create notification for the approver
  INSERT INTO public.notifications (user_id, title, message, type, category, reference_type, reference_id)
  VALUES (
    NEW.user_id,
    'MOC Approval Required',
    'You have been requested to review MOC "' || moc_number || ' - ' || moc_title || '"',
    'warning',
    'moc_approval',
    'moc_request',
    NEW.moc_request_id::text
  );

  RETURN NEW;
END;
$function$;

-- Create trigger for approval requests
DROP TRIGGER IF EXISTS trigger_notify_moc_approval_request ON public.moc_approvers;
CREATE TRIGGER trigger_notify_moc_approval_request
  AFTER INSERT ON public.moc_approvers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_moc_approval_request();