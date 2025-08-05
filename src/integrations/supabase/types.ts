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
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          created_at: string
          dietary_preferences: string[] | null
          display_name: string | null
          health_goals: string[] | null
          height: number | null
          id: string
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          dietary_preferences?: string[] | null
          display_name?: string | null
          health_goals?: string[] | null
          height?: number | null
          id?: string
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          created_at?: string
          dietary_preferences?: string[] | null
          display_name?: string | null
          health_goals?: string[] | null
          height?: number | null
          id?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
