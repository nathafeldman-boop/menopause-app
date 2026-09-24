export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      coach_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "coach_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_progress: {
        Row: {
          created_at: string
          id: string
          meals_done: string[]
          mood: string | null
          note: string | null
          progress_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meals_done?: string[]
          mood?: string | null
          note?: string | null
          progress_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meals_done?: string[]
          mood?: string | null
          note?: string | null
          progress_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          ingredients: string[]
          servings: string | null
          source: string
          steps: string[]
          time: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredients?: string[]
          servings?: string | null
          source?: string
          steps?: string[]
          time?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredients?: string[]
          servings?: string | null
          source?: string
          steps?: string[]
          time?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      ingredient_recipes: {
        Row: {
          created_at: string
          id: string
          ingredients_input: string[]
          is_teaser: boolean
          recipes: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredients_input: string[]
          is_teaser?: boolean
          recipes: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredients_input?: string[]
          is_teaser?: boolean
          recipes?: Json
          user_id?: string
        }
        Relationships: []
      }
      meal_analyses: {
        Row: {
          calcium_flag: string | null
          carbs_level: string | null
          created_at: string
          fat_level: string | null
          good_points: string[]
          id: string
          image_path: string
          improve_points: string[]
          meal_name: string | null
          protein_flag: string | null
          raw_ai: Json | null
          score: number | null
          sugar_flag: string | null
          suggestions: string[]
          user_id: string
          veg_fiber_flag: string | null
        }
        Insert: {
          calcium_flag?: string | null
          carbs_level?: string | null
          created_at?: string
          fat_level?: string | null
          good_points?: string[]
          id?: string
          image_path: string
          improve_points?: string[]
          meal_name?: string | null
          protein_flag?: string | null
          raw_ai?: Json | null
          score?: number | null
          sugar_flag?: string | null
          suggestions?: string[]
          user_id: string
          veg_fiber_flag?: string | null
        }
        Update: {
          calcium_flag?: string | null
          carbs_level?: string | null
          created_at?: string
          fat_level?: string | null
          good_points?: string[]
          id?: string
          image_path?: string
          improve_points?: string[]
          meal_name?: string | null
          protein_flag?: string | null
          raw_ai?: Json | null
          score?: number | null
          sugar_flag?: string | null
          suggestions?: string[]
          user_id?: string
          veg_fiber_flag?: string | null
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          created_at: string
          days: Json
          id: string
          is_teaser: boolean
          shopping_list: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          days?: Json
          id?: string
          is_teaser?: boolean
          shopping_list?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          days?: Json
          id?: string
          is_teaser?: boolean
          shopping_list?: Json
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string | null
          cooking_skill: string | null
          cooking_time: string | null
          created_at: string
          diet_type: string | null
          disliked_foods: string | null
          email: string | null
          goal: string | null
          height_cm: number | null
          household_size: string | null
          hydration: string | null
          id: string
          important_note: string | null
          menopause_stage: string | null
          onboarding_completed: boolean
          recipe_preference: string | null
          sleep_quality: string | null
          snacking_frequency: string | null
          stress_level: string | null
          supplements: string | null
          symptoms: string[] | null
          todays_meals: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string | null
          cooking_skill?: string | null
          cooking_time?: string | null
          created_at?: string
          diet_type?: string | null
          disliked_foods?: string | null
          email?: string | null
          goal?: string | null
          height_cm?: number | null
          household_size?: string | null
          hydration?: string | null
          id: string
          important_note?: string | null
          menopause_stage?: string | null
          onboarding_completed?: boolean
          recipe_preference?: string | null
          sleep_quality?: string | null
          snacking_frequency?: string | null
          stress_level?: string | null
          supplements?: string | null
          symptoms?: string[] | null
          todays_meals?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string | null
          cooking_skill?: string | null
          cooking_time?: string | null
          created_at?: string
          diet_type?: string | null
          disliked_foods?: string | null
          email?: string | null
          goal?: string | null
          height_cm?: number | null
          household_size?: string | null
          hydration?: string | null
          id?: string
          important_note?: string | null
          menopause_stage?: string | null
          onboarding_completed?: boolean
          recipe_preference?: string | null
          sleep_quality?: string | null
          snacking_frequency?: string | null
          stress_level?: string | null
          supplements?: string | null
          symptoms?: string[] | null
          todays_meals?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      recipe_scans: {
        Row: {
          adapted: Json | null
          created_at: string
          extracted: Json | null
          fit_score: number | null
          good_points: string[]
          id: string
          image_path: string | null
          improve_points: string[]
          is_teaser: boolean
          summary: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          adapted?: Json | null
          created_at?: string
          extracted?: Json | null
          fit_score?: number | null
          good_points?: string[]
          id?: string
          image_path?: string | null
          improve_points?: string[]
          is_teaser?: boolean
          summary?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          adapted?: Json | null
          created_at?: string
          extracted?: Json | null
          fit_score?: number | null
          good_points?: string[]
          id?: string
          image_path?: string | null
          improve_points?: string[]
          is_teaser?: boolean
          summary?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
