export interface Member {
  id: string;
  church_id: string;
  name: string;
  email?: string;
  phone_number?: string;
  birthday?: string;
  address?: string;
  country?: string;
  city?: string;
  
  // Spiritual Information
  discipleship_stage?: DiscipleshipStage;
  spiritual_gifts?: string[];
  baptized: boolean;
  baptism_date?: string;
  saved_status: boolean;
  salvation_date?: string;
  biblical_understanding?: BiblicalUnderstanding;
  
  // Engagement Tracking
  last_service_attendance?: string;
  last_communication_response?: string;
  last_activity_log?: string;
  engagement_score?: number;
  
  // Communication Preferences
  email_notifications: boolean;
  sms_notifications: boolean;
  language_preference: string;
  
  // System Fields
  member_number?: string;
  photo_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export type DiscipleshipStage = 'New Believer' | 'Growing' | 'Mature' | 'Leader' | 'Seeker';

export type BiblicalUnderstanding = 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced';

export interface MemberFormData {
  name: string;
  email?: string;
  phone_number?: string;
  birthday?: Date;
  address?: string;
  country?: string;
  city?: string;
  discipleship_stage?: DiscipleshipStage;
  spiritual_gifts?: string[];
  baptized: boolean;
  baptism_date?: Date;
  saved_status: boolean;
  salvation_date?: Date;
  biblical_understanding?: BiblicalUnderstanding;
  email_notifications: boolean;
  sms_notifications: boolean;
  language_preference: string;
  photo_url?: string;
}

export interface MemberFilters {
  search?: string;
  discipleship_stage?: DiscipleshipStage;
  baptism_status?: 'all' | 'baptized' | 'not_baptized';
  engagement_level?: 'all' | 'high' | 'medium' | 'low' | 'inactive';
  date_range?: {
    start?: Date;
    end?: Date;
    type: 'last_activity' | 'join_date';
  };
}

export interface MemberStats {
  total: number;
  by_stage: Record<DiscipleshipStage, number>;
  engagement: {
    high: number;
    medium: number;
    low: number;
    inactive: number;
  };
  recent_activity: number;
}

export const SPIRITUAL_GIFTS = [
  'Teaching',
  'Leadership',
  'Evangelism',
  'Pastoring',
  'Administration',
  'Mercy',
  'Helps',
  'Giving',
  'Faith',
  'Discernment',
  'Prophecy',
  'Healing',
  'Miracles',
  'Tongues',
  'Interpretation',
  'Hospitality',
  'Music',
  'Craftsmanship'
] as const;