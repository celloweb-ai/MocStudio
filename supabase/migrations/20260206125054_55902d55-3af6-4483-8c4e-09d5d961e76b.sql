-- Create app roles enum
CREATE TYPE public.app_role AS ENUM (
  'administrator',
  'facility_manager',
  'process_engineer',
  'maintenance_technician',
  'hse_coordinator',
  'approval_committee'
);

-- Create MOC status enum
CREATE TYPE public.moc_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'implemented'
);

-- Create MOC priority enum
CREATE TYPE public.moc_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Create MOC change type enum
CREATE TYPE public.moc_change_type AS ENUM (
  'equipment_modification',
  'equipment_replacement',
  'equipment_addition',
  'procedure_change',
  'software_change',
  'major_change'
);

-- Create approval status enum
CREATE TYPE public.approval_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'changes_requested'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create facilities table
CREATE TABLE public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  facility_type TEXT,
  location TEXT,
  manager_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create moc_requests table
CREATE TABLE public.moc_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  justification TEXT,
  facility_id UUID REFERENCES public.facilities(id),
  change_type public.moc_change_type,
  priority public.moc_priority DEFAULT 'medium',
  status public.moc_status DEFAULT 'draft',
  is_temporary BOOLEAN DEFAULT false,
  estimated_duration TEXT,
  affected_systems TEXT[],
  affected_areas TEXT[],
  risk_probability INTEGER CHECK (risk_probability >= 1 AND risk_probability <= 5),
  risk_severity INTEGER CHECK (risk_severity >= 1 AND risk_severity <= 5),
  risk_category TEXT,
  mitigation_measures TEXT,
  requires_hazop BOOLEAN DEFAULT false,
  target_implementation_date DATE,
  review_deadline DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create moc_approvers table (membership table for approval workflow)
CREATE TABLE public.moc_approvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moc_request_id UUID NOT NULL REFERENCES public.moc_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role_required public.app_role NOT NULL,
  status public.approval_status DEFAULT 'pending',
  comments TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(moc_request_id, user_id)
);

-- Create moc_comments table
CREATE TABLE public.moc_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moc_request_id UUID NOT NULL REFERENCES public.moc_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.moc_comments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create moc_attachments table (for file references)
CREATE TABLE public.moc_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moc_comment_id UUID REFERENCES public.moc_comments(id) ON DELETE CASCADE,
  moc_request_id UUID REFERENCES public.moc_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size TEXT,
  file_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create moc_history table (audit trail)
CREATE TABLE public.moc_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moc_request_id UUID NOT NULL REFERENCES public.moc_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create helper function: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'administrator')
$$;

-- Create helper function: is_moc_owner
CREATE OR REPLACE FUNCTION public.is_moc_owner(_moc_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.moc_requests
    WHERE id = _moc_id
      AND created_by = auth.uid()
  )
$$;

-- Create helper function: is_moc_approver
CREATE OR REPLACE FUNCTION public.is_moc_approver(_moc_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.moc_approvers
    WHERE moc_request_id = _moc_id
      AND user_id = auth.uid()
  )
$$;

-- Create helper function: can_access_moc
CREATE OR REPLACE FUNCTION public.can_access_moc(_moc_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin() 
    OR public.is_moc_owner(_moc_id) 
    OR public.is_moc_approver(_moc_id)
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_moc_requests_updated_at
  BEFORE UPDATE ON public.moc_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_moc_comments_updated_at
  BEFORE UPDATE ON public.moc_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-generate request numbers
CREATE OR REPLACE FUNCTION public.generate_moc_request_number()
RETURNS TRIGGER AS $$
DECLARE
  year_prefix TEXT;
  next_number INTEGER;
BEGIN
  year_prefix := to_char(NOW(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM 9) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.moc_requests
  WHERE request_number LIKE 'MOC-' || year_prefix || '-%';
  
  NEW.request_number := 'MOC-' || year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_moc_request_number_trigger
  BEFORE INSERT ON public.moc_requests
  FOR EACH ROW
  WHEN (NEW.request_number IS NULL)
  EXECUTE FUNCTION public.generate_moc_request_number();

-- Create function to log MOC history
CREATE OR REPLACE FUNCTION public.log_moc_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.moc_history (moc_request_id, user_id, action, details)
    VALUES (NEW.id, NEW.created_by, 'created', jsonb_build_object('title', NEW.title));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.moc_history (moc_request_id, user_id, action, details)
      VALUES (NEW.id, auth.uid(), 'status_changed', jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER log_moc_history_trigger
  AFTER INSERT OR UPDATE ON public.moc_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_moc_history();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moc_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moc_approvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moc_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moc_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moc_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- RLS Policies for user_roles (admin only for management, users can view their own)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin());

-- RLS Policies for facilities (all authenticated users can view)
CREATE POLICY "Authenticated users can view facilities"
  ON public.facilities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage facilities"
  ON public.facilities FOR ALL
  TO authenticated
  USING (public.is_admin());

-- RLS Policies for moc_requests
CREATE POLICY "Users can view accessible MOCs"
  ON public.moc_requests FOR SELECT
  TO authenticated
  USING (public.can_access_moc(id));

CREATE POLICY "Users can create MOCs"
  ON public.moc_requests FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Owners can update draft/submitted MOCs"
  ON public.moc_requests FOR UPDATE
  TO authenticated
  USING (
    public.is_admin() 
    OR (created_by = auth.uid() AND status IN ('draft', 'submitted'))
    OR public.is_moc_approver(id)
  );

CREATE POLICY "Owners can delete draft MOCs"
  ON public.moc_requests FOR DELETE
  TO authenticated
  USING (public.is_admin() OR (created_by = auth.uid() AND status = 'draft'));

-- RLS Policies for moc_approvers
CREATE POLICY "Users can view approvers for accessible MOCs"
  ON public.moc_approvers FOR SELECT
  TO authenticated
  USING (public.can_access_moc(moc_request_id));

CREATE POLICY "MOC owners and admins can add approvers"
  ON public.moc_approvers FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin() 
    OR public.is_moc_owner(moc_request_id)
  );

CREATE POLICY "Approvers can update their own approval"
  ON public.moc_approvers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can delete approvers"
  ON public.moc_approvers FOR DELETE
  TO authenticated
  USING (public.is_admin() OR public.is_moc_owner(moc_request_id));

-- RLS Policies for moc_comments
CREATE POLICY "Users can view comments on accessible MOCs"
  ON public.moc_comments FOR SELECT
  TO authenticated
  USING (public.can_access_moc(moc_request_id));

CREATE POLICY "Users can add comments to accessible MOCs"
  ON public.moc_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.can_access_moc(moc_request_id));

CREATE POLICY "Users can update own comments"
  ON public.moc_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON public.moc_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- RLS Policies for moc_attachments
CREATE POLICY "Users can view attachments on accessible MOCs"
  ON public.moc_attachments FOR SELECT
  TO authenticated
  USING (
    public.can_access_moc(moc_request_id) 
    OR (moc_comment_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.moc_comments c 
      WHERE c.id = moc_comment_id AND public.can_access_moc(c.moc_request_id)
    ))
  );

CREATE POLICY "Users can upload attachments"
  ON public.moc_attachments FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Uploaders can delete own attachments"
  ON public.moc_attachments FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid() OR public.is_admin());

-- RLS Policies for moc_history
CREATE POLICY "Users can view history for accessible MOCs"
  ON public.moc_history FOR SELECT
  TO authenticated
  USING (public.can_access_moc(moc_request_id));

-- Create indexes for performance
CREATE INDEX idx_moc_requests_created_by ON public.moc_requests(created_by);
CREATE INDEX idx_moc_requests_facility_id ON public.moc_requests(facility_id);
CREATE INDEX idx_moc_requests_status ON public.moc_requests(status);
CREATE INDEX idx_moc_approvers_moc_request_id ON public.moc_approvers(moc_request_id);
CREATE INDEX idx_moc_approvers_user_id ON public.moc_approvers(user_id);
CREATE INDEX idx_moc_comments_moc_request_id ON public.moc_comments(moc_request_id);
CREATE INDEX idx_moc_history_moc_request_id ON public.moc_history(moc_request_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);