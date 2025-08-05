export interface MemberActivity {
  id: string;
  member_id: string;
  activity_type: string;
  activity_title: string;
  activity_description?: string;
  activity_date: string;
  duration_minutes?: number;
  location?: string;
  notes?: string;
  recorded_by?: string;
  created_at: string;
}

export interface ActivityFormData {
  activity_type: string;
  activity_title: string;
  activity_description?: string;
  activity_date: Date;
  duration_minutes?: number;
  location?: string;
  notes?: string;
}

export const ACTIVITY_TYPES = [
  'Service Attendance',
  'Small Group',
  'Prayer Meeting',
  'Bible Study',
  'Counseling Session',
  'Volunteer Work',
  'Outreach Event',
  'Training/Workshop',
  'Fellowship Event',
  'Ministry Meeting',
  'Personal Meeting',
  'Phone Call',
  'Email/Message',
  'Other'
] as const;