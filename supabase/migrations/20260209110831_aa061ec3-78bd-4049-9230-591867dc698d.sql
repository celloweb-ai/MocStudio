
-- Create assets table
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  facility_id UUID REFERENCES public.facilities(id),
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  criticality TEXT NOT NULL DEFAULT 'medium',
  last_maintenance DATE,
  asset_code TEXT,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view all assets
CREATE POLICY "Authenticated users can view assets"
ON public.assets FOR SELECT
USING (true);

-- Authenticated users can create assets
CREATE POLICY "Authenticated users can create assets"
ON public.assets FOR INSERT
WITH CHECK (created_by = auth.uid());

-- Admins and creators can update assets
CREATE POLICY "Owners and admins can update assets"
ON public.assets FOR UPDATE
USING (created_by = auth.uid() OR is_admin());

-- Admins and creators can delete assets
CREATE POLICY "Owners and admins can delete assets"
ON public.assets FOR DELETE
USING (created_by = auth.uid() OR is_admin());

-- Auto-update updated_at
CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Generate asset codes
CREATE OR REPLACE FUNCTION public.generate_asset_code()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(asset_code FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.assets
  WHERE asset_code LIKE 'AST-%';
  
  NEW.asset_code := 'AST-' || LPAD(next_number::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_asset_code_trigger
BEFORE INSERT ON public.assets
FOR EACH ROW
WHEN (NEW.asset_code IS NULL)
EXECUTE FUNCTION public.generate_asset_code();
