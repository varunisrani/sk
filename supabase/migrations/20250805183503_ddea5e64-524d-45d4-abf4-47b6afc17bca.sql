-- Create members table
CREATE TABLE public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    church_id UUID REFERENCES churches(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(20),
    birthday DATE,
    address TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    
    -- Spiritual Information
    discipleship_stage VARCHAR(20) CHECK (discipleship_stage IN ('New Believer', 'Growing', 'Mature', 'Leader', 'Seeker')),
    spiritual_gifts TEXT[],
    baptized BOOLEAN DEFAULT FALSE,
    baptism_date DATE,
    saved_status BOOLEAN DEFAULT FALSE,
    salvation_date DATE,
    biblical_understanding VARCHAR(20) CHECK (biblical_understanding IN ('Beginner', 'Basic', 'Intermediate', 'Advanced')),
    
    -- Engagement Tracking  
    last_service_attendance TIMESTAMP WITH TIME ZONE,
    last_communication_response TIMESTAMP WITH TIME ZONE,
    last_activity_log TIMESTAMP WITH TIME ZONE,
    engagement_score DECIMAL(3,2),
    
    -- Communication Preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    language_preference VARCHAR(10) DEFAULT 'en',
    
    -- System Fields
    member_number VARCHAR(50) UNIQUE,
    photo_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Create member_history table
CREATE TABLE public.member_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    reason TEXT,
    changed_by UUID REFERENCES profiles(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create member_activities table
CREATE TABLE public.member_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_title VARCHAR(255) NOT NULL,
    activity_description TEXT,
    activity_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    location VARCHAR(255),
    notes TEXT,
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create member_notes table
CREATE TABLE public.member_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE NOT NULL,
    note_type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_confidential BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) DEFAULT 'staff_only',
    follow_up_needed BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    tags TEXT[],
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all member tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for members table
CREATE POLICY "Church members can view members"
ON public.members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND church_id = members.church_id
  )
);

CREATE POLICY "Church staff can create members"
ON public.members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND church_id = members.church_id
    AND role IN ('admin', 'pastor', 'staff')
  )
);

CREATE POLICY "Church staff can update members"
ON public.members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND church_id = members.church_id
    AND role IN ('admin', 'pastor', 'staff')
  )
);

CREATE POLICY "Church admins can delete members"
ON public.members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND church_id = members.church_id
    AND role IN ('admin')
  )
);

-- Create RLS policies for member_history table
CREATE POLICY "Church staff can view member history"
ON public.member_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_history.member_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'pastor', 'staff')
  )
);

CREATE POLICY "System can insert member history"
ON public.member_history
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_history.member_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'pastor', 'staff')
  )
);

-- Create RLS policies for member_activities table
CREATE POLICY "Church members can view activities"
ON public.member_activities
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_activities.member_id
    AND ur.user_id = auth.uid()
  )
);

CREATE POLICY "Church staff can create activities"
ON public.member_activities
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_activities.member_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'pastor', 'staff')
  )
);

CREATE POLICY "Church staff can update activities"
ON public.member_activities
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_activities.member_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'pastor', 'staff')
  )
);

CREATE POLICY "Church staff can delete activities"
ON public.member_activities
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_activities.member_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'pastor', 'staff')
  )
);

-- Create RLS policies for member_notes table
CREATE POLICY "Church staff can view appropriate notes"
ON public.member_notes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_notes.member_id
    AND ur.user_id = auth.uid()
    AND (
      (ur.role = 'admin') OR
      (ur.role = 'pastor') OR
      (ur.role = 'staff' AND visibility IN ('staff_only', 'public')) OR
      (visibility = 'public')
    )
  )
);

CREATE POLICY "Church staff can create notes"
ON public.member_notes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_notes.member_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'pastor', 'staff')
  )
);

CREATE POLICY "Note creators can update their notes"
ON public.member_notes
FOR UPDATE
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_notes.member_id
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'pastor')
  )
);

CREATE POLICY "Note creators and admins can delete notes"
ON public.member_notes
FOR DELETE
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.user_roles ur ON ur.church_id = m.church_id
    WHERE m.id = member_notes.member_id
    AND ur.user_id = auth.uid()
    AND ur.role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX idx_members_church_id ON public.members(church_id);
CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_member_number ON public.members(member_number);
CREATE INDEX idx_members_discipleship_stage ON public.members(discipleship_stage);
CREATE INDEX idx_members_active ON public.members(active);

CREATE INDEX idx_member_history_member_id ON public.member_history(member_id);
CREATE INDEX idx_member_history_changed_at ON public.member_history(changed_at);

CREATE INDEX idx_member_activities_member_id ON public.member_activities(member_id);
CREATE INDEX idx_member_activities_activity_date ON public.member_activities(activity_date);
CREATE INDEX idx_member_activities_activity_type ON public.member_activities(activity_type);

CREATE INDEX idx_member_notes_member_id ON public.member_notes(member_id);
CREATE INDEX idx_member_notes_created_by ON public.member_notes(created_by);
CREATE INDEX idx_member_notes_visibility ON public.member_notes(visibility);
CREATE INDEX idx_member_notes_follow_up_needed ON public.member_notes(follow_up_needed);

-- Create trigger for updated_at on members table
CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on member_notes table
CREATE TRIGGER update_member_notes_updated_at
    BEFORE UPDATE ON public.member_notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();