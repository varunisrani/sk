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
      ai_decisions: {
        Row: {
          action_details: string | null
          action_taken: boolean | null
          ai_response: Json
          church_id: string
          confidence_score: number | null
          created_at: string | null
          decision_type:
            | Database["public"]["Enums"]["ai_decision_type_enum"]
            | null
          evidence_factors: string[] | null
          human_override: boolean | null
          id: string
          member_id: string
          model_used: string | null
          model_version: string | null
          outcome_rating: number | null
          override_reason: string | null
          processing_time_ms: number | null
          prompt_version: string | null
          reasoning: string | null
          recommended_actions: string[] | null
          requires_human_review: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          action_details?: string | null
          action_taken?: boolean | null
          ai_response: Json
          church_id: string
          confidence_score?: number | null
          created_at?: string | null
          decision_type?:
            | Database["public"]["Enums"]["ai_decision_type_enum"]
            | null
          evidence_factors?: string[] | null
          human_override?: boolean | null
          id?: string
          member_id: string
          model_used?: string | null
          model_version?: string | null
          outcome_rating?: number | null
          override_reason?: string | null
          processing_time_ms?: number | null
          prompt_version?: string | null
          reasoning?: string | null
          recommended_actions?: string[] | null
          requires_human_review?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          action_details?: string | null
          action_taken?: boolean | null
          ai_response?: Json
          church_id?: string
          confidence_score?: number | null
          created_at?: string | null
          decision_type?:
            | Database["public"]["Enums"]["ai_decision_type_enum"]
            | null
          evidence_factors?: string[] | null
          human_override?: boolean | null
          id?: string
          member_id?: string
          model_used?: string | null
          model_version?: string | null
          outcome_rating?: number | null
          override_reason?: string | null
          processing_time_ms?: number | null
          prompt_version?: string | null
          reasoning?: string | null
          recommended_actions?: string[] | null
          requires_human_review?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_decisions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_decisions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_decisions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_comments: {
        Row: {
          alert_id: string
          attachments: string[] | null
          comment_text: string
          comment_type: Database["public"]["Enums"]["comment_type"]
          commenter_id: string | null
          created_at: string | null
          id: string
          is_internal: boolean | null
        }
        Insert: {
          alert_id: string
          attachments?: string[] | null
          comment_text: string
          comment_type: Database["public"]["Enums"]["comment_type"]
          commenter_id?: string | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
        }
        Update: {
          alert_id?: string
          attachments?: string[] | null
          comment_text?: string
          comment_type?: Database["public"]["Enums"]["comment_type"]
          commenter_id?: string | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_alert_comments_alert_id"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "pastoral_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_alert_comments_commenter_id"
            columns: ["commenter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          active: boolean
          body_html: string
          category: Database["public"]["Enums"]["announcement_category"]
          church_id: string
          created_at: string
          created_by: string | null
          id: string
          publish_date: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          active?: boolean
          body_html: string
          category?: Database["public"]["Enums"]["announcement_category"]
          church_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          publish_date?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          active?: boolean
          body_html?: string
          category?: Database["public"]["Enums"]["announcement_category"]
          church_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          publish_date?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "announcements_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      communication_templates: {
        Row: {
          category: Database["public"]["Enums"]["template_category_enum"] | null
          church_id: string
          content: string
          created_at: string | null
          created_by: string
          html_content: string | null
          id: string
          is_active: boolean | null
          language: string | null
          last_used: string | null
          name: string
          personalization_fields: string[] | null
          subject: string | null
          template_type:
            | Database["public"]["Enums"]["template_type_enum"]
            | null
          updated_at: string | null
          updated_by: string | null
          usage_count: number | null
        }
        Insert: {
          category?:
            | Database["public"]["Enums"]["template_category_enum"]
            | null
          church_id: string
          content: string
          created_at?: string | null
          created_by: string
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_used?: string | null
          name: string
          personalization_fields?: string[] | null
          subject?: string | null
          template_type?:
            | Database["public"]["Enums"]["template_type_enum"]
            | null
          updated_at?: string | null
          updated_by?: string | null
          usage_count?: number | null
        }
        Update: {
          category?:
            | Database["public"]["Enums"]["template_category_enum"]
            | null
          church_id?: string
          content?: string
          created_at?: string | null
          created_by?: string
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_used?: string | null
          name?: string
          personalization_fields?: string[] | null
          subject?: string | null
          template_type?:
            | Database["public"]["Enums"]["template_type_enum"]
            | null
          updated_at?: string | null
          updated_by?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_templates_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_analytics: {
        Row: {
          activity_metrics: Json | null
          alert_metrics: Json
          church_id: string
          communication_metrics: Json
          created_at: string | null
          date: string
          id: string
          member_metrics: Json
          system_metrics: Json | null
          updated_at: string | null
        }
        Insert: {
          activity_metrics?: Json | null
          alert_metrics: Json
          church_id: string
          communication_metrics: Json
          created_at?: string | null
          date: string
          id?: string
          member_metrics: Json
          system_metrics?: Json | null
          updated_at?: string | null
        }
        Update: {
          activity_metrics?: Json | null
          alert_metrics?: Json
          church_id?: string
          communication_metrics?: Json
          created_at?: string | null
          date?: string
          id?: string
          member_metrics?: Json
          system_metrics?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_analytics_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      devotionals: {
        Row: {
          ai_generated: boolean | null
          bookmarked: boolean | null
          church_id: string
          difficulty_level:
            | Database["public"]["Enums"]["devotional_difficulty_enum"]
            | null
          engagement_score: number | null
          estimated_reading_time: number | null
          expires_at: string | null
          generated_at: string | null
          generation_confidence: number | null
          generation_prompt: string | null
          id: string
          language: string | null
          member_id: string
          member_stage_at_generation: string | null
          personalization_factors: Json | null
          practical_step: string | null
          prayer: string | null
          read_at: string | null
          read_status: boolean | null
          reading_time_seconds: number | null
          reflection: string
          shared_with_others: boolean | null
          tags: string[] | null
          theme: string | null
          title: string
          trigger_type:
            | Database["public"]["Enums"]["devotional_trigger_type_enum"]
            | null
          user_feedback: string | null
          user_rating: number | null
          verse_reference: string | null
          verse_text: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          bookmarked?: boolean | null
          church_id: string
          difficulty_level?:
            | Database["public"]["Enums"]["devotional_difficulty_enum"]
            | null
          engagement_score?: number | null
          estimated_reading_time?: number | null
          expires_at?: string | null
          generated_at?: string | null
          generation_confidence?: number | null
          generation_prompt?: string | null
          id?: string
          language?: string | null
          member_id: string
          member_stage_at_generation?: string | null
          personalization_factors?: Json | null
          practical_step?: string | null
          prayer?: string | null
          read_at?: string | null
          read_status?: boolean | null
          reading_time_seconds?: number | null
          reflection: string
          shared_with_others?: boolean | null
          tags?: string[] | null
          theme?: string | null
          title: string
          trigger_type?:
            | Database["public"]["Enums"]["devotional_trigger_type_enum"]
            | null
          user_feedback?: string | null
          user_rating?: number | null
          verse_reference?: string | null
          verse_text?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          bookmarked?: boolean | null
          church_id?: string
          difficulty_level?:
            | Database["public"]["Enums"]["devotional_difficulty_enum"]
            | null
          engagement_score?: number | null
          estimated_reading_time?: number | null
          expires_at?: string | null
          generated_at?: string | null
          generation_confidence?: number | null
          generation_prompt?: string | null
          id?: string
          language?: string | null
          member_id?: string
          member_stage_at_generation?: string | null
          personalization_factors?: Json | null
          practical_step?: string | null
          prayer?: string | null
          read_at?: string | null
          read_status?: boolean | null
          reading_time_seconds?: number | null
          reflection?: string
          shared_with_others?: boolean | null
          tags?: string[] | null
          theme?: string | null
          title?: string
          trigger_type?:
            | Database["public"]["Enums"]["devotional_trigger_type_enum"]
            | null
          user_feedback?: string | null
          user_rating?: number | null
          verse_reference?: string | null
          verse_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devotionals_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devotionals_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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
      email_campaigns: {
        Row: {
          bounce_rate: number | null
          bounced_count: number | null
          campaign_name: string
          church_id: string
          click_rate: number | null
          clicked_count: number | null
          content: string
          created_at: string | null
          created_by: string
          delivered_count: number | null
          html_content: string | null
          id: string
          open_rate: number | null
          opened_count: number | null
          recipient_count: number | null
          recipient_list: string[] | null
          scheduled_send_time: string | null
          send_immediately: boolean | null
          sender_email: string | null
          sender_name: string | null
          sent_at: string | null
          sent_count: number | null
          status:
            | Database["public"]["Enums"]["email_campaign_status_enum"]
            | null
          subject: string
          target_criteria: Json | null
          template_id: string | null
          timezone: string | null
          unsubscribe_count: number | null
        }
        Insert: {
          bounce_rate?: number | null
          bounced_count?: number | null
          campaign_name: string
          church_id: string
          click_rate?: number | null
          clicked_count?: number | null
          content: string
          created_at?: string | null
          created_by: string
          delivered_count?: number | null
          html_content?: string | null
          id?: string
          open_rate?: number | null
          opened_count?: number | null
          recipient_count?: number | null
          recipient_list?: string[] | null
          scheduled_send_time?: string | null
          send_immediately?: boolean | null
          sender_email?: string | null
          sender_name?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?:
            | Database["public"]["Enums"]["email_campaign_status_enum"]
            | null
          subject: string
          target_criteria?: Json | null
          template_id?: string | null
          timezone?: string | null
          unsubscribe_count?: number | null
        }
        Update: {
          bounce_rate?: number | null
          bounced_count?: number | null
          campaign_name?: string
          church_id?: string
          click_rate?: number | null
          clicked_count?: number | null
          content?: string
          created_at?: string | null
          created_by?: string
          delivered_count?: number | null
          html_content?: string | null
          id?: string
          open_rate?: number | null
          opened_count?: number | null
          recipient_count?: number | null
          recipient_list?: string[] | null
          scheduled_send_time?: string | null
          send_immediately?: boolean | null
          sender_email?: string | null
          sender_name?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?:
            | Database["public"]["Enums"]["email_campaign_status_enum"]
            | null
          subject?: string
          target_criteria?: Json | null
          template_id?: string | null
          timezone?: string | null
          unsubscribe_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          bounce_reason: string | null
          bounced_at: string | null
          campaign_id: string | null
          church_id: string
          click_count: number | null
          clicked_at: string | null
          content: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_attempts: number | null
          error_message: string | null
          external_message_id: string | null
          first_opened_at: string | null
          id: string
          ip_address: unknown | null
          open_count: number | null
          opened_at: string | null
          recipient_email: string
          recipient_id: string | null
          sender_email: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["email_log_status_enum"] | null
          subject: string
          unsubscribed_at: string | null
          user_agent: string | null
        }
        Insert: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          church_id: string
          click_count?: number | null
          clicked_at?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          error_message?: string | null
          external_message_id?: string | null
          first_opened_at?: string | null
          id?: string
          ip_address?: unknown | null
          open_count?: number | null
          opened_at?: string | null
          recipient_email: string
          recipient_id?: string | null
          sender_email?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_log_status_enum"] | null
          subject: string
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Update: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          church_id?: string
          click_count?: number | null
          clicked_at?: string | null
          content?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          error_message?: string | null
          external_message_id?: string | null
          first_opened_at?: string | null
          id?: string
          ip_address?: unknown | null
          open_count?: number | null
          opened_at?: string | null
          recipient_email?: string
          recipient_id?: string | null
          sender_email?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_log_status_enum"] | null
          subject?: string
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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
      monthly_analytics: {
        Row: {
          areas_of_concern: string[] | null
          celebration_points: string[] | null
          church_id: string
          communication_effectiveness: Json | null
          created_at: string | null
          discipleship_progression_metrics: Json | null
          engagement_trends: Json | null
          giving_metrics: Json | null
          goal_achievement_rate: number | null
          id: string
          key_insights: string[] | null
          member_growth_metrics: Json | null
          month: number | null
          month_over_month_changes: Json | null
          monthly_goals_achieved: Json | null
          monthly_goals_set: Json | null
          pastoral_care_metrics: Json | null
          prayer_ministry_metrics: Json | null
          recommendations: string[] | null
          year: number | null
          year_over_year_changes: Json | null
        }
        Insert: {
          areas_of_concern?: string[] | null
          celebration_points?: string[] | null
          church_id: string
          communication_effectiveness?: Json | null
          created_at?: string | null
          discipleship_progression_metrics?: Json | null
          engagement_trends?: Json | null
          giving_metrics?: Json | null
          goal_achievement_rate?: number | null
          id?: string
          key_insights?: string[] | null
          member_growth_metrics?: Json | null
          month?: number | null
          month_over_month_changes?: Json | null
          monthly_goals_achieved?: Json | null
          monthly_goals_set?: Json | null
          pastoral_care_metrics?: Json | null
          prayer_ministry_metrics?: Json | null
          recommendations?: string[] | null
          year?: number | null
          year_over_year_changes?: Json | null
        }
        Update: {
          areas_of_concern?: string[] | null
          celebration_points?: string[] | null
          church_id?: string
          communication_effectiveness?: Json | null
          created_at?: string | null
          discipleship_progression_metrics?: Json | null
          engagement_trends?: Json | null
          giving_metrics?: Json | null
          goal_achievement_rate?: number | null
          id?: string
          key_insights?: string[] | null
          member_growth_metrics?: Json | null
          month?: number | null
          month_over_month_changes?: Json | null
          monthly_goals_achieved?: Json | null
          monthly_goals_set?: Json | null
          pastoral_care_metrics?: Json | null
          prayer_ministry_metrics?: Json | null
          recommendations?: string[] | null
          year?: number | null
          year_over_year_changes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_analytics_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletters: {
        Row: {
          archive_after_days: number | null
          attachments: string[] | null
          church_id: string
          click_count: number | null
          content: string
          created_at: string | null
          created_by: string
          featured_image_url: string | null
          html_content: string | null
          id: string
          meta_description: string | null
          open_count: number | null
          publish_date: string | null
          published_at: string | null
          scheduled_send_time: string | null
          sections: Json | null
          sent_count: number | null
          slug: string | null
          status: Database["public"]["Enums"]["newsletter_status_enum"] | null
          subscriber_count: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
          web_viewable: boolean | null
        }
        Insert: {
          archive_after_days?: number | null
          attachments?: string[] | null
          church_id: string
          click_count?: number | null
          content: string
          created_at?: string | null
          created_by: string
          featured_image_url?: string | null
          html_content?: string | null
          id?: string
          meta_description?: string | null
          open_count?: number | null
          publish_date?: string | null
          published_at?: string | null
          scheduled_send_time?: string | null
          sections?: Json | null
          sent_count?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["newsletter_status_enum"] | null
          subscriber_count?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          web_viewable?: boolean | null
        }
        Update: {
          archive_after_days?: number | null
          attachments?: string[] | null
          church_id?: string
          click_count?: number | null
          content?: string
          created_at?: string | null
          created_by?: string
          featured_image_url?: string | null
          html_content?: string | null
          id?: string
          meta_description?: string | null
          open_count?: number | null
          publish_date?: string | null
          published_at?: string | null
          scheduled_send_time?: string | null
          sections?: Json | null
          sent_count?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["newsletter_status_enum"] | null
          subscriber_count?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          web_viewable?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletters_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pastoral_alerts: {
        Row: {
          ai_assessment: Json | null
          ai_generated: boolean | null
          ai_recommendations: string[] | null
          alert_subtype: string | null
          alert_type: Database["public"]["Enums"]["alert_type"]
          assigned_to: string | null
          church_id: string
          confidence_level: number | null
          created_at: string | null
          description: string
          escalation_level: number | null
          estimated_resolution_time: unknown | null
          evidence: string | null
          follow_up_date: string | null
          follow_up_timeline: string | null
          id: string
          language: string | null
          member_id: string
          notification_sent: boolean | null
          notification_sent_at: string | null
          pastor_email: string | null
          priority: Database["public"]["Enums"]["alert_priority"]
          requires_immediate_action: boolean | null
          resolution_notes: string | null
          resolution_type: Database["public"]["Enums"]["resolution_type"] | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          risk_factors: string[] | null
          risk_score: number | null
          satisfaction_rating: number | null
          status: Database["public"]["Enums"]["alert_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_assessment?: Json | null
          ai_generated?: boolean | null
          ai_recommendations?: string[] | null
          alert_subtype?: string | null
          alert_type: Database["public"]["Enums"]["alert_type"]
          assigned_to?: string | null
          church_id: string
          confidence_level?: number | null
          created_at?: string | null
          description: string
          escalation_level?: number | null
          estimated_resolution_time?: unknown | null
          evidence?: string | null
          follow_up_date?: string | null
          follow_up_timeline?: string | null
          id?: string
          language?: string | null
          member_id: string
          notification_sent?: boolean | null
          notification_sent_at?: string | null
          pastor_email?: string | null
          priority: Database["public"]["Enums"]["alert_priority"]
          requires_immediate_action?: boolean | null
          resolution_notes?: string | null
          resolution_type?:
            | Database["public"]["Enums"]["resolution_type"]
            | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_factors?: string[] | null
          risk_score?: number | null
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["alert_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_assessment?: Json | null
          ai_generated?: boolean | null
          ai_recommendations?: string[] | null
          alert_subtype?: string | null
          alert_type?: Database["public"]["Enums"]["alert_type"]
          assigned_to?: string | null
          church_id?: string
          confidence_level?: number | null
          created_at?: string | null
          description?: string
          escalation_level?: number | null
          estimated_resolution_time?: unknown | null
          evidence?: string | null
          follow_up_date?: string | null
          follow_up_timeline?: string | null
          id?: string
          language?: string | null
          member_id?: string
          notification_sent?: boolean | null
          notification_sent_at?: string | null
          pastor_email?: string | null
          priority?: Database["public"]["Enums"]["alert_priority"]
          requires_immediate_action?: boolean | null
          resolution_notes?: string | null
          resolution_type?:
            | Database["public"]["Enums"]["resolution_type"]
            | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          risk_factors?: string[] | null
          risk_score?: number | null
          satisfaction_rating?: number | null
          status?: Database["public"]["Enums"]["alert_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pastoral_alerts_assigned_to"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pastoral_alerts_church_id"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pastoral_alerts_member_id"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pastoral_alerts_resolved_by"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          ai_analysis: Json | null
          ai_analyzed: boolean | null
          anonymous_request: boolean | null
          answer_description: string | null
          answered_date: string | null
          category: Database["public"]["Enums"]["prayer_category_enum"] | null
          church_id: string
          created_at: string | null
          crisis_indicators: string[] | null
          follow_up_date: string | null
          follow_up_frequency:
            | Database["public"]["Enums"]["prayer_followup_frequency_enum"]
            | null
          follow_up_needed: boolean | null
          id: string
          language: string | null
          pastoral_care_needed: boolean | null
          pastoral_contact_date: string | null
          pastoral_contact_made: boolean | null
          pastoral_notes: string | null
          praise_report: string | null
          prayed_by: string[] | null
          prayer_count: number | null
          prayer_updates: Json | null
          privacy_level:
            | Database["public"]["Enums"]["prayer_privacy_level_enum"]
            | null
          recommended_actions: string[] | null
          request_text: string
          request_title: string | null
          request_type:
            | Database["public"]["Enums"]["prayer_request_type_enum"]
            | null
          requester_id: string
          requester_name: string
          share_with_prayer_team: boolean | null
          status: Database["public"]["Enums"]["prayer_status_enum"] | null
          updated_at: string | null
          urgency: Database["public"]["Enums"]["prayer_urgency_enum"] | null
        }
        Insert: {
          ai_analysis?: Json | null
          ai_analyzed?: boolean | null
          anonymous_request?: boolean | null
          answer_description?: string | null
          answered_date?: string | null
          category?: Database["public"]["Enums"]["prayer_category_enum"] | null
          church_id: string
          created_at?: string | null
          crisis_indicators?: string[] | null
          follow_up_date?: string | null
          follow_up_frequency?:
            | Database["public"]["Enums"]["prayer_followup_frequency_enum"]
            | null
          follow_up_needed?: boolean | null
          id?: string
          language?: string | null
          pastoral_care_needed?: boolean | null
          pastoral_contact_date?: string | null
          pastoral_contact_made?: boolean | null
          pastoral_notes?: string | null
          praise_report?: string | null
          prayed_by?: string[] | null
          prayer_count?: number | null
          prayer_updates?: Json | null
          privacy_level?:
            | Database["public"]["Enums"]["prayer_privacy_level_enum"]
            | null
          recommended_actions?: string[] | null
          request_text: string
          request_title?: string | null
          request_type?:
            | Database["public"]["Enums"]["prayer_request_type_enum"]
            | null
          requester_id: string
          requester_name: string
          share_with_prayer_team?: boolean | null
          status?: Database["public"]["Enums"]["prayer_status_enum"] | null
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["prayer_urgency_enum"] | null
        }
        Update: {
          ai_analysis?: Json | null
          ai_analyzed?: boolean | null
          anonymous_request?: boolean | null
          answer_description?: string | null
          answered_date?: string | null
          category?: Database["public"]["Enums"]["prayer_category_enum"] | null
          church_id?: string
          created_at?: string | null
          crisis_indicators?: string[] | null
          follow_up_date?: string | null
          follow_up_frequency?:
            | Database["public"]["Enums"]["prayer_followup_frequency_enum"]
            | null
          follow_up_needed?: boolean | null
          id?: string
          language?: string | null
          pastoral_care_needed?: boolean | null
          pastoral_contact_date?: string | null
          pastoral_contact_made?: boolean | null
          pastoral_notes?: string | null
          praise_report?: string | null
          prayed_by?: string[] | null
          prayer_count?: number | null
          prayer_updates?: Json | null
          privacy_level?:
            | Database["public"]["Enums"]["prayer_privacy_level_enum"]
            | null
          recommended_actions?: string[] | null
          request_text?: string
          request_title?: string | null
          request_type?:
            | Database["public"]["Enums"]["prayer_request_type_enum"]
            | null
          requester_id?: string
          requester_name?: string
          share_with_prayer_team?: boolean | null
          status?: Database["public"]["Enums"]["prayer_status_enum"] | null
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["prayer_urgency_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_updates: {
        Row: {
          created_at: string | null
          id: string
          is_praise_report: boolean | null
          prayer_request_id: string
          update_text: string
          update_type:
            | Database["public"]["Enums"]["prayer_update_type_enum"]
            | null
          updated_by: string
          visibility:
            | Database["public"]["Enums"]["prayer_update_visibility_enum"]
            | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_praise_report?: boolean | null
          prayer_request_id: string
          update_text: string
          update_type?:
            | Database["public"]["Enums"]["prayer_update_type_enum"]
            | null
          updated_by: string
          visibility?:
            | Database["public"]["Enums"]["prayer_update_visibility_enum"]
            | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_praise_report?: boolean | null
          prayer_request_id?: string
          update_text?: string
          update_type?:
            | Database["public"]["Enums"]["prayer_update_type_enum"]
            | null
          updated_by?: string
          visibility?:
            | Database["public"]["Enums"]["prayer_update_visibility_enum"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_updates_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_updates_updated_by_fkey"
            columns: ["updated_by"]
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
      sermon_aids: {
        Row: {
          ai_model_used: string | null
          church_id: string
          congregation_context: string | null
          congregation_feedback: string | null
          created_at: string | null
          custom_notes: string | null
          discussion_questions: string[] | null
          effectiveness_rating: number | null
          generated_at: string | null
          generation_confidence: number | null
          id: string
          illustrations: Json | null
          key_messages: Json | null
          local_applications: string[] | null
          pastor_id: string
          pastoral_considerations: string[] | null
          personal_illustrations: string[] | null
          practical_applications: Json | null
          preached_date: string | null
          primary_scripture: string | null
          related_scriptures: Json | null
          scripture_context: Json | null
          sermon_outline: Json | null
          sermon_series: string | null
          special_occasions: string[] | null
          status: Database["public"]["Enums"]["sermon_status_enum"] | null
          supporting_scriptures: string[] | null
          target_audience: string | null
          target_length_minutes: number | null
          title: string
          topic: string | null
          updated_at: string | null
        }
        Insert: {
          ai_model_used?: string | null
          church_id: string
          congregation_context?: string | null
          congregation_feedback?: string | null
          created_at?: string | null
          custom_notes?: string | null
          discussion_questions?: string[] | null
          effectiveness_rating?: number | null
          generated_at?: string | null
          generation_confidence?: number | null
          id?: string
          illustrations?: Json | null
          key_messages?: Json | null
          local_applications?: string[] | null
          pastor_id: string
          pastoral_considerations?: string[] | null
          personal_illustrations?: string[] | null
          practical_applications?: Json | null
          preached_date?: string | null
          primary_scripture?: string | null
          related_scriptures?: Json | null
          scripture_context?: Json | null
          sermon_outline?: Json | null
          sermon_series?: string | null
          special_occasions?: string[] | null
          status?: Database["public"]["Enums"]["sermon_status_enum"] | null
          supporting_scriptures?: string[] | null
          target_audience?: string | null
          target_length_minutes?: number | null
          title: string
          topic?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_model_used?: string | null
          church_id?: string
          congregation_context?: string | null
          congregation_feedback?: string | null
          created_at?: string | null
          custom_notes?: string | null
          discussion_questions?: string[] | null
          effectiveness_rating?: number | null
          generated_at?: string | null
          generation_confidence?: number | null
          id?: string
          illustrations?: Json | null
          key_messages?: Json | null
          local_applications?: string[] | null
          pastor_id?: string
          pastoral_considerations?: string[] | null
          personal_illustrations?: string[] | null
          practical_applications?: Json | null
          preached_date?: string | null
          primary_scripture?: string | null
          related_scriptures?: Json | null
          scripture_context?: Json | null
          sermon_outline?: Json | null
          sermon_series?: string | null
          special_occasions?: string[] | null
          status?: Database["public"]["Enums"]["sermon_status_enum"] | null
          supporting_scriptures?: string[] | null
          target_audience?: string | null
          target_length_minutes?: number | null
          title?: string
          topic?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_aids_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_aids_pastor_id_fkey"
            columns: ["pastor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      si_interactions: {
        Row: {
          ai_response: Json
          character_count_input: number | null
          character_count_response: number | null
          church_id: string
          conversation_context: Json | null
          conversation_history: Json | null
          created_at: string | null
          crisis_alert_id: string | null
          crisis_alert_sent: boolean | null
          crisis_indicators: string[] | null
          cultural_context: string | null
          follow_up_needed: boolean | null
          helpful_rating: boolean | null
          id: string
          language: string | null
          processing_time_ms: number | null
          response_type:
            | Database["public"]["Enums"]["si_response_type_enum"]
            | null
          session_id: string | null
          topic_category:
            | Database["public"]["Enums"]["si_topic_category_enum"]
            | null
          urgency_detected:
            | Database["public"]["Enums"]["si_urgency_enum"]
            | null
          user_id: string
          user_input: string
          user_satisfaction: number | null
        }
        Insert: {
          ai_response: Json
          character_count_input?: number | null
          character_count_response?: number | null
          church_id: string
          conversation_context?: Json | null
          conversation_history?: Json | null
          created_at?: string | null
          crisis_alert_id?: string | null
          crisis_alert_sent?: boolean | null
          crisis_indicators?: string[] | null
          cultural_context?: string | null
          follow_up_needed?: boolean | null
          helpful_rating?: boolean | null
          id?: string
          language?: string | null
          processing_time_ms?: number | null
          response_type?:
            | Database["public"]["Enums"]["si_response_type_enum"]
            | null
          session_id?: string | null
          topic_category?:
            | Database["public"]["Enums"]["si_topic_category_enum"]
            | null
          urgency_detected?:
            | Database["public"]["Enums"]["si_urgency_enum"]
            | null
          user_id: string
          user_input: string
          user_satisfaction?: number | null
        }
        Update: {
          ai_response?: Json
          character_count_input?: number | null
          character_count_response?: number | null
          church_id?: string
          conversation_context?: Json | null
          conversation_history?: Json | null
          created_at?: string | null
          crisis_alert_id?: string | null
          crisis_alert_sent?: boolean | null
          crisis_indicators?: string[] | null
          cultural_context?: string | null
          follow_up_needed?: boolean | null
          helpful_rating?: boolean | null
          id?: string
          language?: string | null
          processing_time_ms?: number | null
          response_type?:
            | Database["public"]["Enums"]["si_response_type_enum"]
            | null
          session_id?: string | null
          topic_category?:
            | Database["public"]["Enums"]["si_topic_category_enum"]
            | null
          urgency_detected?:
            | Database["public"]["Enums"]["si_urgency_enum"]
            | null
          user_id?: string
          user_input?: string
          user_satisfaction?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "si_interactions_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "si_interactions_crisis_alert_id_fkey"
            columns: ["crisis_alert_id"]
            isOneToOne: false
            referencedRelation: "pastoral_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "si_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_campaigns: {
        Row: {
          actual_cost: number | null
          campaign_name: string
          church_id: string
          cost_estimate: number | null
          created_at: string | null
          created_by: string
          delivered_count: number | null
          failed_count: number | null
          id: string
          message_content: string
          recipient_count: number | null
          recipient_list: string[] | null
          scheduled_send_time: string | null
          send_immediately: boolean | null
          sender_phone: string | null
          sent_at: string | null
          sent_count: number | null
          status: Database["public"]["Enums"]["sms_campaign_status_enum"] | null
          target_criteria: Json | null
        }
        Insert: {
          actual_cost?: number | null
          campaign_name: string
          church_id: string
          cost_estimate?: number | null
          created_at?: string | null
          created_by: string
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          message_content: string
          recipient_count?: number | null
          recipient_list?: string[] | null
          scheduled_send_time?: string | null
          send_immediately?: boolean | null
          sender_phone?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?:
            | Database["public"]["Enums"]["sms_campaign_status_enum"]
            | null
          target_criteria?: Json | null
        }
        Update: {
          actual_cost?: number | null
          campaign_name?: string
          church_id?: string
          cost_estimate?: number | null
          created_at?: string | null
          created_by?: string
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          message_content?: string
          recipient_count?: number | null
          recipient_list?: string[] | null
          scheduled_send_time?: string | null
          send_immediately?: boolean | null
          sender_phone?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?:
            | Database["public"]["Enums"]["sms_campaign_status_enum"]
            | null
          target_criteria?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_campaigns_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_logs: {
        Row: {
          campaign_id: string | null
          character_count: number | null
          church_id: string
          cost: number | null
          created_at: string | null
          delivered_at: string | null
          delivery_attempts: number | null
          error_code: string | null
          error_message: string | null
          external_message_id: string | null
          failed_at: string | null
          id: string
          message_content: string
          message_type:
            | Database["public"]["Enums"]["sms_message_type_enum"]
            | null
          recipient_id: string | null
          recipient_phone: string
          segment_count: number | null
          sender_phone: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["sms_log_status_enum"] | null
          urgency: Database["public"]["Enums"]["sms_urgency_enum"] | null
        }
        Insert: {
          campaign_id?: string | null
          character_count?: number | null
          church_id: string
          cost?: number | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          error_code?: string | null
          error_message?: string | null
          external_message_id?: string | null
          failed_at?: string | null
          id?: string
          message_content: string
          message_type?:
            | Database["public"]["Enums"]["sms_message_type_enum"]
            | null
          recipient_id?: string | null
          recipient_phone: string
          segment_count?: number | null
          sender_phone?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["sms_log_status_enum"] | null
          urgency?: Database["public"]["Enums"]["sms_urgency_enum"] | null
        }
        Update: {
          campaign_id?: string | null
          character_count?: number | null
          church_id?: string
          cost?: number | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          error_code?: string | null
          error_message?: string | null
          external_message_id?: string | null
          failed_at?: string | null
          id?: string
          message_content?: string
          message_type?:
            | Database["public"]["Enums"]["sms_message_type_enum"]
            | null
          recipient_id?: string | null
          recipient_phone?: string
          segment_count?: number | null
          sender_phone?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["sms_log_status_enum"] | null
          urgency?: Database["public"]["Enums"]["sms_urgency_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sms_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_logs_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      spiritual_mapping: {
        Row: {
          boundaries: Json | null
          church_id: string
          community_needs: string[] | null
          created_at: string | null
          created_by: string
          cultural_considerations: string[] | null
          demographic_data: Json | null
          description: string | null
          dominant_religions: string[] | null
          evangelism_opportunities: string[] | null
          geographic_area: string
          id: string
          intercessory_focus: string[] | null
          last_updated_by: string | null
          mapping_name: string
          partnership_possibilities: string[] | null
          population_estimate: number | null
          prayer_needs: string[] | null
          prayer_points: string[] | null
          prayer_walking_routes: Json | null
          research_sources: string[] | null
          service_opportunities: string[] | null
          socioeconomic_factors: Json | null
          spiritual_climate:
            | Database["public"]["Enums"]["spiritual_climate_enum"]
            | null
          spiritual_openings: string[] | null
          spiritual_strongholds: string[] | null
          status:
            | Database["public"]["Enums"]["spiritual_mapping_status_enum"]
            | null
          updated_at: string | null
        }
        Insert: {
          boundaries?: Json | null
          church_id: string
          community_needs?: string[] | null
          created_at?: string | null
          created_by: string
          cultural_considerations?: string[] | null
          demographic_data?: Json | null
          description?: string | null
          dominant_religions?: string[] | null
          evangelism_opportunities?: string[] | null
          geographic_area: string
          id?: string
          intercessory_focus?: string[] | null
          last_updated_by?: string | null
          mapping_name: string
          partnership_possibilities?: string[] | null
          population_estimate?: number | null
          prayer_needs?: string[] | null
          prayer_points?: string[] | null
          prayer_walking_routes?: Json | null
          research_sources?: string[] | null
          service_opportunities?: string[] | null
          socioeconomic_factors?: Json | null
          spiritual_climate?:
            | Database["public"]["Enums"]["spiritual_climate_enum"]
            | null
          spiritual_openings?: string[] | null
          spiritual_strongholds?: string[] | null
          status?:
            | Database["public"]["Enums"]["spiritual_mapping_status_enum"]
            | null
          updated_at?: string | null
        }
        Update: {
          boundaries?: Json | null
          church_id?: string
          community_needs?: string[] | null
          created_at?: string | null
          created_by?: string
          cultural_considerations?: string[] | null
          demographic_data?: Json | null
          description?: string | null
          dominant_religions?: string[] | null
          evangelism_opportunities?: string[] | null
          geographic_area?: string
          id?: string
          intercessory_focus?: string[] | null
          last_updated_by?: string | null
          mapping_name?: string
          partnership_possibilities?: string[] | null
          population_estimate?: number | null
          prayer_needs?: string[] | null
          prayer_points?: string[] | null
          prayer_walking_routes?: Json | null
          research_sources?: string[] | null
          service_opportunities?: string[] | null
          socioeconomic_factors?: Json | null
          spiritual_climate?:
            | Database["public"]["Enums"]["spiritual_climate_enum"]
            | null
          spiritual_openings?: string[] | null
          spiritual_strongholds?: string[] | null
          status?:
            | Database["public"]["Enums"]["spiritual_mapping_status_enum"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spiritual_mapping_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spiritual_mapping_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spiritual_mapping_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_health_logs: {
        Row: {
          ai_service_status: Json | null
          api_status: Json | null
          background_task_status: Json | null
          communication_service_status: Json | null
          created_at: string | null
          critical_errors: string[] | null
          database_status: Json | null
          error_count_1h: number | null
          error_count_24h: number | null
          health_alerts_generated: number | null
          id: string
          overall_status:
            | Database["public"]["Enums"]["system_status_enum"]
            | null
          system_metrics: Json | null
          timestamp: string | null
          uptime_percentage_24h: number | null
          uptime_percentage_7d: number | null
        }
        Insert: {
          ai_service_status?: Json | null
          api_status?: Json | null
          background_task_status?: Json | null
          communication_service_status?: Json | null
          created_at?: string | null
          critical_errors?: string[] | null
          database_status?: Json | null
          error_count_1h?: number | null
          error_count_24h?: number | null
          health_alerts_generated?: number | null
          id?: string
          overall_status?:
            | Database["public"]["Enums"]["system_status_enum"]
            | null
          system_metrics?: Json | null
          timestamp?: string | null
          uptime_percentage_24h?: number | null
          uptime_percentage_7d?: number | null
        }
        Update: {
          ai_service_status?: Json | null
          api_status?: Json | null
          background_task_status?: Json | null
          communication_service_status?: Json | null
          created_at?: string | null
          critical_errors?: string[] | null
          database_status?: Json | null
          error_count_1h?: number | null
          error_count_24h?: number | null
          health_alerts_generated?: number | null
          id?: string
          overall_status?:
            | Database["public"]["Enums"]["system_status_enum"]
            | null
          system_metrics?: Json | null
          timestamp?: string | null
          uptime_percentage_24h?: number | null
          uptime_percentage_7d?: number | null
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
      weekly_analytics: {
        Row: {
          ai_interactions_count: number | null
          alerts_generated: number | null
          church_id: string
          communication_engagement_rate: number | null
          counseling_sessions_count: number | null
          created_at: string | null
          detailed_metrics: Json | null
          devotionals_generated: number | null
          engagement_score: number | null
          id: string
          member_growth_rate: number | null
          new_members_count: number | null
          pastoral_visits_count: number | null
          prayer_requests_count: number | null
          total_communications_sent: number | null
          total_members: number | null
          week_end_date: string
          week_number: number | null
          week_start_date: string
          year: number | null
        }
        Insert: {
          ai_interactions_count?: number | null
          alerts_generated?: number | null
          church_id: string
          communication_engagement_rate?: number | null
          counseling_sessions_count?: number | null
          created_at?: string | null
          detailed_metrics?: Json | null
          devotionals_generated?: number | null
          engagement_score?: number | null
          id?: string
          member_growth_rate?: number | null
          new_members_count?: number | null
          pastoral_visits_count?: number | null
          prayer_requests_count?: number | null
          total_communications_sent?: number | null
          total_members?: number | null
          week_end_date: string
          week_number?: number | null
          week_start_date: string
          year?: number | null
        }
        Update: {
          ai_interactions_count?: number | null
          alerts_generated?: number | null
          church_id?: string
          communication_engagement_rate?: number | null
          counseling_sessions_count?: number | null
          created_at?: string | null
          detailed_metrics?: Json | null
          devotionals_generated?: number | null
          engagement_score?: number | null
          id?: string
          member_growth_rate?: number | null
          new_members_count?: number | null
          pastoral_visits_count?: number | null
          prayer_requests_count?: number | null
          total_communications_sent?: number | null
          total_members?: number | null
          week_end_date?: string
          week_number?: number | null
          week_start_date?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_analytics_church_id_fkey"
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
      assign_default_member_role: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      assign_member_role: {
        Args: { p_user_id?: string; p_church_id?: string }
        Returns: undefined
      }
      bootstrap_first_admin: {
        Args: { p_church_id?: string }
        Returns: boolean
      }
      bootstrap_first_pastor: {
        Args: { p_church_id?: string }
        Returns: boolean
      }
      has_role: {
        Args:
          | {
              _user_id: string
              _church_id: string
              _role: Database["public"]["Enums"]["app_role"]
            }
          | { _user_id: string; _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      increment_announcement_view: {
        Args: { p_announcement_id: string }
        Returns: undefined
      }
    }
    Enums: {
      ai_decision_type_enum:
        | "discipleship_mapping"
        | "spiritual_gap_analysis"
        | "growth_trigger"
        | "pastoral_care_recommendation"
        | "crisis_detection"
      alert_priority: "low" | "medium" | "high" | "critical"
      alert_status: "open" | "in_progress" | "resolved" | "closed" | "escalated"
      alert_type:
        | "disengagement"
        | "spiritual_gap"
        | "unanswered_question"
        | "milestone"
        | "pastoral_care"
        | "crisis"
        | "custom"
      announcement_category: "general" | "urgent" | "event"
      app_role: "admin" | "pastor" | "staff" | "member"
      comment_type: "update" | "question" | "resolution" | "escalation"
      devotional_difficulty_enum: "beginner" | "intermediate" | "advanced"
      devotional_trigger_type_enum:
        | "new_believer_nurture"
        | "spiritual_growth"
        | "leadership_development"
        | "pastoral_care"
        | "reengagement"
      email_campaign_status_enum:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "cancelled"
        | "failed"
      email_log_status_enum:
        | "queued"
        | "sent"
        | "delivered"
        | "opened"
        | "clicked"
        | "bounced"
        | "failed"
        | "spam"
        | "unsubscribed"
      newsletter_status_enum: "draft" | "scheduled" | "published" | "archived"
      prayer_category_enum:
        | "health"
        | "family"
        | "finances"
        | "spiritual"
        | "work"
        | "relationships"
        | "grief"
        | "thanksgiving"
        | "guidance"
        | "other"
      prayer_followup_frequency_enum:
        | "daily"
        | "weekly"
        | "monthly"
        | "as_needed"
      prayer_privacy_level_enum:
        | "private"
        | "pastor_only"
        | "leadership"
        | "small_group"
        | "church_family"
        | "public"
      prayer_request_type_enum:
        | "personal"
        | "family"
        | "community"
        | "global"
        | "thanksgiving"
      prayer_status_enum:
        | "active"
        | "answered"
        | "ongoing"
        | "archived"
        | "cancelled"
      prayer_update_type_enum:
        | "progress"
        | "answer"
        | "praise"
        | "continued_need"
        | "escalation"
      prayer_update_visibility_enum: "same_as_request" | "private" | "public"
      prayer_urgency_enum: "low" | "medium" | "high" | "critical"
      resolution_type:
        | "pastoral_visit"
        | "phone_call"
        | "email"
        | "referral"
        | "prayer"
        | "other"
      sermon_status_enum:
        | "draft"
        | "in_preparation"
        | "ready"
        | "preached"
        | "archived"
      si_response_type_enum:
        | "guidance"
        | "encouragement"
        | "correction"
        | "crisis_referral"
        | "prayer"
        | "scripture"
        | "doctrine"
      si_topic_category_enum:
        | "faith"
        | "relationships"
        | "prayer"
        | "scripture"
        | "doubt"
        | "suffering"
        | "service"
        | "growth"
        | "other"
      si_urgency_enum: "none" | "low" | "medium" | "high" | "crisis"
      sms_campaign_status_enum:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "cancelled"
        | "failed"
      sms_log_status_enum:
        | "queued"
        | "sent"
        | "delivered"
        | "failed"
        | "undelivered"
      sms_message_type_enum:
        | "promotional"
        | "transactional"
        | "alert"
        | "reminder"
      sms_urgency_enum: "low" | "normal" | "high" | "emergency"
      spiritual_climate_enum:
        | "hostile"
        | "resistant"
        | "neutral"
        | "receptive"
        | "revival"
      spiritual_mapping_status_enum:
        | "research"
        | "active_mapping"
        | "completed"
        | "archived"
      system_status_enum: "healthy" | "degraded" | "critical" | "maintenance"
      template_category_enum:
        | "welcome"
        | "follow_up"
        | "milestone"
        | "pastoral_care"
        | "announcement"
        | "invitation"
      template_type_enum: "email" | "sms" | "newsletter" | "social_media"
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
      ai_decision_type_enum: [
        "discipleship_mapping",
        "spiritual_gap_analysis",
        "growth_trigger",
        "pastoral_care_recommendation",
        "crisis_detection",
      ],
      alert_priority: ["low", "medium", "high", "critical"],
      alert_status: ["open", "in_progress", "resolved", "closed", "escalated"],
      alert_type: [
        "disengagement",
        "spiritual_gap",
        "unanswered_question",
        "milestone",
        "pastoral_care",
        "crisis",
        "custom",
      ],
      announcement_category: ["general", "urgent", "event"],
      app_role: ["admin", "pastor", "staff", "member"],
      comment_type: ["update", "question", "resolution", "escalation"],
      devotional_difficulty_enum: ["beginner", "intermediate", "advanced"],
      devotional_trigger_type_enum: [
        "new_believer_nurture",
        "spiritual_growth",
        "leadership_development",
        "pastoral_care",
        "reengagement",
      ],
      email_campaign_status_enum: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "cancelled",
        "failed",
      ],
      email_log_status_enum: [
        "queued",
        "sent",
        "delivered",
        "opened",
        "clicked",
        "bounced",
        "failed",
        "spam",
        "unsubscribed",
      ],
      newsletter_status_enum: ["draft", "scheduled", "published", "archived"],
      prayer_category_enum: [
        "health",
        "family",
        "finances",
        "spiritual",
        "work",
        "relationships",
        "grief",
        "thanksgiving",
        "guidance",
        "other",
      ],
      prayer_followup_frequency_enum: [
        "daily",
        "weekly",
        "monthly",
        "as_needed",
      ],
      prayer_privacy_level_enum: [
        "private",
        "pastor_only",
        "leadership",
        "small_group",
        "church_family",
        "public",
      ],
      prayer_request_type_enum: [
        "personal",
        "family",
        "community",
        "global",
        "thanksgiving",
      ],
      prayer_status_enum: [
        "active",
        "answered",
        "ongoing",
        "archived",
        "cancelled",
      ],
      prayer_update_type_enum: [
        "progress",
        "answer",
        "praise",
        "continued_need",
        "escalation",
      ],
      prayer_update_visibility_enum: ["same_as_request", "private", "public"],
      prayer_urgency_enum: ["low", "medium", "high", "critical"],
      resolution_type: [
        "pastoral_visit",
        "phone_call",
        "email",
        "referral",
        "prayer",
        "other",
      ],
      sermon_status_enum: [
        "draft",
        "in_preparation",
        "ready",
        "preached",
        "archived",
      ],
      si_response_type_enum: [
        "guidance",
        "encouragement",
        "correction",
        "crisis_referral",
        "prayer",
        "scripture",
        "doctrine",
      ],
      si_topic_category_enum: [
        "faith",
        "relationships",
        "prayer",
        "scripture",
        "doubt",
        "suffering",
        "service",
        "growth",
        "other",
      ],
      si_urgency_enum: ["none", "low", "medium", "high", "crisis"],
      sms_campaign_status_enum: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "cancelled",
        "failed",
      ],
      sms_log_status_enum: [
        "queued",
        "sent",
        "delivered",
        "failed",
        "undelivered",
      ],
      sms_message_type_enum: [
        "promotional",
        "transactional",
        "alert",
        "reminder",
      ],
      sms_urgency_enum: ["low", "normal", "high", "emergency"],
      spiritual_climate_enum: [
        "hostile",
        "resistant",
        "neutral",
        "receptive",
        "revival",
      ],
      spiritual_mapping_status_enum: [
        "research",
        "active_mapping",
        "completed",
        "archived",
      ],
      system_status_enum: ["healthy", "degraded", "critical", "maintenance"],
      template_category_enum: [
        "welcome",
        "follow_up",
        "milestone",
        "pastoral_care",
        "announcement",
        "invitation",
      ],
      template_type_enum: ["email", "sms", "newsletter", "social_media"],
    },
  },
} as const
