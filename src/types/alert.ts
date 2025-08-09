export type AlertType = 'disengagement' | 'spiritual_gap' | 'unanswered_question' | 'milestone' | 'pastoral_care' | 'crisis' | 'custom';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
export type ResolutionType = 'pastoral_visit' | 'phone_call' | 'email' | 'referral' | 'prayer' | 'other';

export interface PastoralAlert {
  id: string;
  church_id: string;
  member_id: string;
  alert_type: AlertType;
  alert_subtype?: string;
  title: string;
  description: string;
  priority?: AlertPriority;
  risk_score?: number;
  risk_factors?: string[];
  confidence_level?: number;
  ai_generated?: boolean;
  ai_assessment?: any;
  ai_recommendations?: string[];
  evidence?: string;
  assigned_to?: string | null;
  follow_up_timeline?: string | null;
  follow_up_date?: string | null; // date
  estimated_resolution_time?: string | null; // interval as string
  status?: AlertStatus;
  resolved?: boolean;
  resolved_at?: string | null;
  resolved_by?: string | null;
  resolution_notes?: string | null;
  resolution_type?: ResolutionType | null;
  satisfaction_rating?: number | null;
  pastor_email?: string | null;
  notification_sent?: boolean;
  notification_sent_at?: string | null;
  requires_immediate_action?: boolean;
  escalation_level?: number;
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AlertComment {
  id: string;
  alert_id: string;
  commenter_id?: string;
  comment_text: string;
  comment_type: 'update' | 'question' | 'resolution' | 'escalation';
  is_internal?: boolean;
  attachments?: string[];
  created_at?: string;
}
