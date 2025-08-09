export type AnnouncementCategory = 'general' | 'urgent' | 'event';

export interface Announcement {
  id: string;
  church_id: string;
  title: string;
  body_html: string;
  category: AnnouncementCategory;
  publish_date: string | null; // YYYY-MM-DD
  active: boolean;
  view_count: number;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementFormData {
  title: string;
  body_html: string;
  category: AnnouncementCategory;
  publish_date: Date | null;
  active: boolean;
}