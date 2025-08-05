-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'pastor', 'staff', 'member');

-- Create churches table
CREATE TABLE public.churches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    pastor_name VARCHAR(255),
    denomination VARCHAR(100),
    founded_date DATE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on churches
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Create church_settings table
CREATE TABLE public.church_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB,
    setting_type VARCHAR(50) DEFAULT 'general',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(church_id, setting_key)
);

-- Enable RLS on church_settings
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, church_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Update profiles table to include church context
ALTER TABLE public.profiles 
ADD COLUMN church_id UUID REFERENCES churches(id),
ADD COLUMN position VARCHAR(100),
ADD COLUMN department VARCHAR(100),
ADD COLUMN hire_date DATE,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _church_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND church_id = _church_id
      AND role = _role
  )
$$;

-- Create RLS policies for churches
CREATE POLICY "Church members can view their church"
ON public.churches
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND church_id = churches.id
  )
);

CREATE POLICY "Church admins can update their church"
ON public.churches
FOR UPDATE
USING (public.has_role(auth.uid(), id, 'admin'));

CREATE POLICY "Admins can insert churches"
ON public.churches
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), id, 'admin'));

-- Create RLS policies for church_settings
CREATE POLICY "Church members can view settings"
ON public.church_settings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND church_id = church_settings.church_id
  )
);

CREATE POLICY "Church admins can manage settings"
ON public.church_settings
FOR ALL
USING (public.has_role(auth.uid(), church_id, 'admin'));

-- Create RLS policies for user_roles
CREATE POLICY "Users can view roles in their church"
ON public.user_roles
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.has_role(auth.uid(), church_id, 'admin') OR
  public.has_role(auth.uid(), church_id, 'pastor')
);

CREATE POLICY "Admins and pastors can manage roles"
ON public.user_roles
FOR ALL
USING (
  public.has_role(auth.uid(), church_id, 'admin') OR
  public.has_role(auth.uid(), church_id, 'pastor')
);

-- Update profiles RLS policies to include church context
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Church staff can view member profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur1, public.user_roles ur2
    WHERE ur1.user_id = auth.uid()
    AND ur2.user_id = profiles.user_id
    AND ur1.church_id = ur2.church_id
    AND ur1.role IN ('admin', 'pastor', 'staff')
  )
);