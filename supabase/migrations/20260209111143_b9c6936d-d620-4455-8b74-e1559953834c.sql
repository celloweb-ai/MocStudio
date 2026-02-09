
-- Create work_orders table
CREATE TABLE public.work_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  work_type TEXT NOT NULL DEFAULT 'Corrective',
  status TEXT NOT NULL DEFAULT 'Scheduled',
  priority TEXT NOT NULL DEFAULT 'Medium',
  facility_id UUID REFERENCES public.facilities(id),
  moc_request_id UUID REFERENCES public.moc_requests(id),
  assignee TEXT,
  due_date DATE,
  progress INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view work orders"
ON public.work_orders FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create work orders"
ON public.work_orders FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Owners and admins can update work orders"
ON public.work_orders FOR UPDATE USING (created_by = auth.uid() OR is_admin());

CREATE POLICY "Owners and admins can delete work orders"
ON public.work_orders FOR DELETE USING (created_by = auth.uid() OR is_admin());

CREATE TRIGGER update_work_orders_updated_at
BEFORE UPDATE ON public.work_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION public.generate_work_order_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.work_orders
  WHERE order_number LIKE 'WO-%';
  
  NEW.order_number := 'WO-' || LPAD(next_number::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_work_order_number_trigger
BEFORE INSERT ON public.work_orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION public.generate_work_order_number();
