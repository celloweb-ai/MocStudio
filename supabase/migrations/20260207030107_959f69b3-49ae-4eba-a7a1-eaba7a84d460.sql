-- Create moc_tasks table for follow-up action items
CREATE TABLE public.moc_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  moc_request_id UUID NOT NULL REFERENCES public.moc_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table for in-app and email notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  category TEXT NOT NULL DEFAULT 'system' CHECK (category IN ('system', 'moc_status', 'moc_approval', 'task_assigned', 'task_due', 'comment')),
  reference_type TEXT, -- 'moc_request', 'moc_task', etc.
  reference_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.moc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for moc_tasks
CREATE POLICY "Users can view tasks for accessible MOCs"
ON public.moc_tasks
FOR SELECT
USING (can_access_moc(moc_request_id));

CREATE POLICY "Users can create tasks for accessible MOCs"
ON public.moc_tasks
FOR INSERT
WITH CHECK (can_access_moc(moc_request_id) AND created_by = auth.uid());

CREATE POLICY "Task owners and assignees can update tasks"
ON public.moc_tasks
FOR UPDATE
USING (created_by = auth.uid() OR assigned_to = auth.uid() OR is_admin());

CREATE POLICY "Task owners and admins can delete tasks"
ON public.moc_tasks
FOR DELETE
USING (created_by = auth.uid() OR is_admin());

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications (mark as read)"
ON public.notifications
FOR UPDATE
USING (user_id = auth.uid());

-- Trigger to update updated_at on moc_tasks
CREATE TRIGGER update_moc_tasks_updated_at
BEFORE UPDATE ON public.moc_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create notification when MOC status changes
CREATE OR REPLACE FUNCTION public.notify_moc_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify the MOC owner when status changes (if not done by owner)
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.created_by != auth.uid() THEN
    INSERT INTO public.notifications (user_id, title, message, type, category, reference_type, reference_id)
    VALUES (
      NEW.created_by,
      'MOC Status Updated',
      'MOC "' || NEW.title || '" status changed to ' || NEW.status,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        WHEN NEW.status = 'rejected' THEN 'error'
        ELSE 'info'
      END,
      'moc_status',
      'moc_request',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for MOC status change notifications
CREATE TRIGGER trigger_moc_status_notification
AFTER UPDATE ON public.moc_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_moc_status_change();

-- Function to create notification when task is assigned
CREATE OR REPLACE FUNCTION public.notify_task_assigned()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  moc_title TEXT;
BEGIN
  -- Get MOC title
  SELECT title INTO moc_title FROM public.moc_requests WHERE id = NEW.moc_request_id;
  
  -- Notify assignee when task is created or assignment changes
  IF NEW.assigned_to IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    INSERT INTO public.notifications (user_id, title, message, type, category, reference_type, reference_id)
    VALUES (
      NEW.assigned_to,
      'New Task Assigned',
      'You have been assigned a task: "' || NEW.title || '" for MOC "' || moc_title || '"',
      'info',
      'task_assigned',
      'moc_task',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for task assignment notifications
CREATE TRIGGER trigger_task_assignment_notification
AFTER INSERT OR UPDATE ON public.moc_tasks
FOR EACH ROW
EXECUTE FUNCTION public.notify_task_assigned();