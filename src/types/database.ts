export interface Church {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  email?: string;
  website?: string;
  pastor_name?: string;
  denomination?: string;
  founded_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  age?: number;
  weight?: number;
  height?: number;
  activity_level?: string;
  dietary_preferences?: string[];
  health_goals?: string[];
  church_id?: string;
  position?: string;
  department?: string;
  hire_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  church_id: string;
  role: 'admin' | 'pastor' | 'staff' | 'member';
  assigned_by?: string;
  assigned_at: string;
}

export interface ChurchSetting {
  id: string;
  church_id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description?: string;
  created_at: string;
  updated_at: string;
}