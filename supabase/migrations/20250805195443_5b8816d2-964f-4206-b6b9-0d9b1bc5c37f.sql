-- Create ENUMs for pastoral alerts system
CREATE TYPE public.alert_type AS ENUM ('disengagement', 'spiritual_gap', 'unanswered_question', 'milestone', 'pastoral_care', 'crisis', 'custom');
CREATE TYPE public.alert_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.alert_status AS ENUM ('open', 'in_progress', 'resolved', 'closed', 'escalated');
CREATE TYPE public.resolution_type AS ENUM ('pastoral_visit', 'phone_call', 'email', 'referral', 'prayer', 'other');
CREATE TYPE public.comment_type AS ENUM ('update', 'question', 'resolution', 'escalation');

-- Create pastoral_alerts table
CREATE TABLE public.pastoral_alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    church_id UUID NOT NULL,
    member_id UUID NOT NULL,
    alert_type alert_type NOT NULL,
    alert_subtype VARCHAR,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    priority alert_priority NOT NULL,
    
    -- Risk Assessment
    risk_score DECIMAL(5,2),
    risk_factors TEXT[],
    confidence_level DECIMAL(3,2),
    
    -- AI Analysis
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_assessment JSONB,
    ai_recommendations TEXT[],
    evidence TEXT,
    
    -- Assignment & Follow-up
    assigned_to UUID,
    follow_up_timeline VARCHAR,
    follow_up_date DATE,
    estimated_resolution_time INTERVAL,
    
    -- Status & Resolution
    status alert_status DEFAULT 'open',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID,
    resolution_notes TEXT,
    resolution_type resolution_type,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    
    -- Communication
    pastor_email VARCHAR,
    notification_sent BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    requires_immediate_action BOOLEAN DEFAULT FALSE,
    escalation_level INTEGER DEFAULT 0,
    
    -- System Fields
    language VARCHAR DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alert_comments table
CREATE TABLE public.alert_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_id UUID NOT NULL,
    commenter_id UUID NOT NULL,
    comment_text TEXT NOT NULL,
    comment_type comment_type NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE public.pastoral_alerts 
    ADD CONSTRAINT fk_pastoral_alerts_church_id FOREIGN KEY (church_id) REFERENCES public.churches(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_pastoral_alerts_member_id FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_pastoral_alerts_assigned_to FOREIGN KEY (assigned_to) REFERENCES public.profiles(id),
    ADD CONSTRAINT fk_pastoral_alerts_resolved_by FOREIGN KEY (resolved_by) REFERENCES public.profiles(id);

ALTER TABLE public.alert_comments
    ADD CONSTRAINT fk_alert_comments_alert_id FOREIGN KEY (alert_id) REFERENCES public.pastoral_alerts(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_alert_comments_commenter_id FOREIGN KEY (commenter_id) REFERENCES public.profiles(id);

-- Enable Row Level Security
ALTER TABLE public.pastoral_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pastoral_alerts
CREATE POLICY "Church staff can view pastoral alerts" 
ON public.pastoral_alerts 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.church_id = pastoral_alerts.church_id 
    AND ur.role = ANY(ARRAY['admin'::app_role, 'pastor'::app_role, 'staff'::app_role])
));

CREATE POLICY "Church staff can create pastoral alerts" 
ON public.pastoral_alerts 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.church_id = pastoral_alerts.church_id 
    AND ur.role = ANY(ARRAY['admin'::app_role, 'pastor'::app_role, 'staff'::app_role])
));

CREATE POLICY "Church staff can update pastoral alerts" 
ON public.pastoral_alerts 
FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.church_id = pastoral_alerts.church_id 
    AND ur.role = ANY(ARRAY['admin'::app_role, 'pastor'::app_role, 'staff'::app_role])
));

CREATE POLICY "Church admins can delete pastoral alerts" 
ON public.pastoral_alerts 
FOR DELETE 
USING (EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.church_id = pastoral_alerts.church_id 
    AND ur.role = 'admin'::app_role
));

-- Create RLS policies for alert_comments
CREATE POLICY "Church staff can view alert comments" 
ON public.alert_comments 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM pastoral_alerts pa
    JOIN user_roles ur ON ur.church_id = pa.church_id
    WHERE pa.id = alert_comments.alert_id 
    AND ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['admin'::app_role, 'pastor'::app_role, 'staff'::app_role])
));

CREATE POLICY "Church staff can create alert comments" 
ON public.alert_comments 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM pastoral_alerts pa
    JOIN user_roles ur ON ur.church_id = pa.church_id
    JOIN profiles p ON p.user_id = ur.user_id
    WHERE pa.id = alert_comments.alert_id 
    AND ur.user_id = auth.uid() 
    AND ur.role = ANY(ARRAY['admin'::app_role, 'pastor'::app_role, 'staff'::app_role])
    AND p.id = alert_comments.commenter_id
));

CREATE POLICY "Comment creators can update their comments" 
ON public.alert_comments 
FOR UPDATE 
USING (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.id = alert_comments.commenter_id
));

CREATE POLICY "Church admins can delete any alert comments" 
ON public.alert_comments 
FOR DELETE 
USING (EXISTS (
    SELECT 1 FROM pastoral_alerts pa
    JOIN user_roles ur ON ur.church_id = pa.church_id
    WHERE pa.id = alert_comments.alert_id 
    AND ur.user_id = auth.uid() 
    AND ur.role = 'admin'::app_role
));

-- Add updated_at trigger for pastoral_alerts
CREATE TRIGGER update_pastoral_alerts_updated_at
    BEFORE UPDATE ON public.pastoral_alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_pastoral_alerts_church_id ON public.pastoral_alerts(church_id);
CREATE INDEX idx_pastoral_alerts_member_id ON public.pastoral_alerts(member_id);
CREATE INDEX idx_pastoral_alerts_status ON public.pastoral_alerts(status);
CREATE INDEX idx_pastoral_alerts_priority ON public.pastoral_alerts(priority);
CREATE INDEX idx_pastoral_alerts_assigned_to ON public.pastoral_alerts(assigned_to);
CREATE INDEX idx_pastoral_alerts_created_at ON public.pastoral_alerts(created_at);
CREATE INDEX idx_alert_comments_alert_id ON public.alert_comments(alert_id);
CREATE INDEX idx_alert_comments_commenter_id ON public.alert_comments(commenter_id);