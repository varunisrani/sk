export interface MemberNote {
  id: string;
  member_id: string;
  note_type: string;
  title: string;
  content: string;
  is_confidential: boolean;
  visibility: NoteVisibility;
  follow_up_needed: boolean;
  follow_up_date?: string;
  tags?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type NoteVisibility = 'public' | 'staff_only' | 'pastor_only' | 'confidential';

export interface NoteFormData {
  note_type: string;
  title: string;
  content: string;
  is_confidential: boolean;
  visibility: NoteVisibility;
  follow_up_needed: boolean;
  follow_up_date?: Date;
  tags?: string[];
}

export const NOTE_TYPES = [
  'General',
  'Prayer Request',
  'Counseling',
  'Follow-up',
  'Pastoral Care',
  'Medical',
  'Family',
  'Ministry',
  'Discipleship',
  'Concern',
  'Celebration',
  'Other'
] as const;