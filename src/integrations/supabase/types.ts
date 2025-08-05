export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      church_settings: {
        Row: {
          church_id: string
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          church_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          church_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_settings_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          denomination: string | null
          email: string | null
          founded_date: string | null
          id: string
          name: string
          pastor_name: string | null
          phone_number: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          denomination?: string | null
          email?: string | null
          founded_date?: string | null
          id?: string
          name: string
          pastor_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          denomination?: string | null
          email?: string | null
          founded_date?: string | null
          id?: string
          name?: string
          pastor_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      elimination_logs: {
        Row: {
          id: string
          logged_at: string
          notes: string | null
          occurred_at: string
          quality: string | null
          user_id: string
        }
        Insert: {
          id?: string
          logged_at?: string
          notes?: string | null
          occurred_at?: string
          quality?: string | null
          user_id: string
        }
        Update: {
          id?: string
          logged_at?: string
          notes?: string | null
          occurred_at?: string
          quality?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          allergens: string[] | null
          calories_per_100g: number
          carbs_per_100g: number | null
          category: string
          common_serving_size: number | null
          created_at: string
          cuisine_type: string | null
          description: string | null
          fat_per_100g: number | null
          fiber_per_100g: number | null
          id: string
          ingredients: string[] | null
          is_pg_menu: boolean | null
          name: string
          protein_per_100g: number | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          calories_per_100g: number
          carbs_per_100g?: number | null
          category: string
          common_serving_size?: number | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          ingredients?: string[] | null
          is_pg_menu?: boolean | null
          name: string
          protein_per_100g?: number | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          calories_per_100g?: number
          carbs_per_100g?: number | null
          category?: string
          common_serving_size?: number | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          fat_per_100g?: number | null
          fiber_per_100g?: number | null
          id?: string
          ingredients?: string[] | null
          is_pg_menu?: boolean | null
          name?: string
          protein_per_100g?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          calories_consumed: number | null
          consumed_at: string
          food_item_id: string
          id: string
          logged_at: string
          meal_type: string
          notes: string | null
          serving_size: number
          user_id: string
        }
        Insert: {
          calories_consumed?: number | null
          consumed_at?: string
          food_item_id: string
          id?: string
          logged_at?: string
          meal_type: string
          notes?: string | null
          serving_size?: number
          user_id: string
        }
        Update: {
          calories_consumed?: number | null
          consumed_at?: string
          food_item_id?: string
          id?: string
          logged_at?: string
          meal_type?: string
          notes?: string | null
          serving_size?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_logs_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      member_activities: {
        Row: {
          activity_date: string
          activity_description: string | null
          activity_title: string
          activity_type: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          location: string | null
          member_id: string
          notes: string | null
          recorded_by: string | null
        }
        Insert: {
          activity_date: string
          activity_description?: string | null
          activity_title: string
          activity_type: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          member_id: string
          notes?: string | null
          recorded_by?: string | null
        }
        Update: {
          activity_date?: string
          activity_description?: string | null
          activity_title?: string
          activity_type?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          member_id?: string
          notes?: string | null
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_activities_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_activities_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_history: {
        Row: {
          change_type: string
          changed_at: string | null
          changed_by: string | null
          id: string
          member_id: string
          new_values: Json | null
          old_values: Json | null
          reason: string | null
        }
        Insert: {
          change_type: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          member_id: string
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
        }
        Update: {
          change_type?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          member_id?: string
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_history_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          follow_up_date: string | null
          follow_up_needed: boolean | null
          id: string
          is_confidential: boolean | null
          member_id: string
          note_type: string
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          id?: string
          is_confidential?: boolean | null
          member_id: string
          note_type: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          id?: string
          is_confidential?: boolean | null
          member_id?: string
          note_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_notes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          active: boolean | null
          address: string | null
          baptism_date: string | null
          baptized: boolean | null
          biblical_understanding: string | null
          birthday: string | null
          church_id: string
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          discipleship_stage: string | null
          email: string | null
          email_notifications: boolean | null
          engagement_score: number | null
          id: string
          language_preference: string | null
          last_activity_log: string | null
          last_communication_response: string | null
          last_service_attendance: string | null
          member_number: string | null
          name: string
          phone_number: string | null
          photo_url: string | null
          salvation_date: string | null
          saved_status: boolean | null
          sms_notifications: boolean | null
          spiritual_gifts: string[] | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          baptism_date?: string | null
          baptized?: boolean | null
          biblical_understanding?: string | null
          birthday?: string | null
          church_id: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          discipleship_stage?: string | null
          email?: string | null
          email_notifications?: boolean | null
          engagement_score?: number | null
          id?: string
          language_preference?: string | null
          last_activity_log?: string | null
          last_communication_response?: string | null
          last_service_attendance?: string | null
          member_number?: string | null
          name: string
          phone_number?: string | null
          photo_url?: string | null
          salvation_date?: string | null
          saved_status?: boolean | null
          sms_notifications?: boolean | null
          spiritual_gifts?: string[] | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          baptism_date?: string | null
          baptized?: boolean | null
          biblical_understanding?: string | null
          birthday?: string | null
          church_id?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          discipleship_stage?: string | null
          email?: string | null
          email_notifications?: boolean | null
          engagement_score?: number | null
          id?: string
          language_preference?: string | null
          last_activity_log?: string | null
          last_communication_response?: string | null
          last_service_attendance?: string | null
          member_number?: string | null
          name?: string
          phone_number?: string | null
          photo_url?: string | null
          salvation_date?: string | null
          saved_status?: boolean | null
          sms_notifications?: boolean | null
          spiritual_gifts?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          church_id: string | null
          created_at: string
          department: string | null
          dietary_preferences: string[] | null
          display_name: string | null
          health_goals: string[] | null
          height: number | null
          hire_date: string | null
          id: string
          is_active: boolean | null
          position: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          church_id?: string | null
          created_at?: string
          department?: string | null
          dietary_preferences?: string[] | null
          display_name?: string | null
          health_goals?: string[] | null
          height?: number | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          position?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          church_id?: string | null
          created_at?: string
          department?: string | null
          dietary_preferences?: string[] | null
          display_name?: string | null
          health_goals?: string[] | null
          height?: number | null
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          position?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          goal_type: string
          id: string
          is_active: boolean | null
          target_calories_daily: number | null
          target_date: string | null
          target_protein_daily: number | null
          target_weight: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_type: string
          id?: string
          is_active?: boolean | null
          target_calories_daily?: number | null
          target_date?: string | null
          target_protein_daily?: number | null
          target_weight?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_type?: string
          id?: string
          is_active?: boolean | null
          target_calories_daily?: number | null
          target_date?: string | null
          target_protein_daily?: number | null
          target_weight?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          church_id: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          church_id: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          church_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      weight_logs: {
        Row: {
          body_fat_percentage: number | null
          id: string
          logged_at: string
          measured_at: string
          muscle_mass: number | null
          notes: string | null
          user_id: string
          weight: number
        }
        Insert: {
          body_fat_percentage?: number | null
          id?: string
          logged_at?: string
          measured_at?: string
          muscle_mass?: number | null
          notes?: string | null
          user_id: string
          weight: number
        }
        Update: {
          body_fat_percentage?: number | null
          id?: string
          logged_at?: string
          measured_at?: string
          muscle_mass?: number | null
          notes?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _church_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "pastor" | "staff" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "pastor", "staff", "member"],
    },
  },
} as const
