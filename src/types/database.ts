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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string
          body: string
          course_id: string | null
          created_at: string
          id: string
          is_global: boolean
          published_at: string | null
          title: string
        }
        Insert: {
          author_id: string
          body: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_global?: boolean
          published_at?: string | null
          title: string
        }
        Update: {
          author_id?: string
          body?: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_global?: boolean
          published_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          email_verified: boolean
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          access_type: string
          category: string | null
          category_id: string | null
          created_at: string
          currency: string
          description: string | null
          difficulty_level: string | null
          duration_text: string | null
          featured: boolean
          id: string
          image_url: string | null
          instructor_id: string | null
          instructor_name: string | null
          is_featured: boolean
          learning_objectives: string[] | null
          meta_description: string | null
          meta_title: string | null
          mode: string
          price: number | null
          requirements: string[] | null
          short_description: string | null
          slug: string
          sort_order: number
          status: string
          target_audience: string | null
          thumbnail_url: string | null
          title: string
          total_duration_minutes: number
          total_lessons: number
          updated_at: string
        }
        Insert: {
          access_type?: string
          category?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          difficulty_level?: string | null
          duration_text?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          instructor_name?: string | null
          is_featured?: boolean
          learning_objectives?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          mode?: string
          price?: number | null
          requirements?: string[] | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: string
          target_audience?: string | null
          thumbnail_url?: string | null
          title: string
          total_duration_minutes?: number
          total_lessons?: number
          updated_at?: string
        }
        Update: {
          access_type?: string
          category?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          difficulty_level?: string | null
          duration_text?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          instructor_name?: string | null
          is_featured?: boolean
          learning_objectives?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          mode?: string
          price?: number | null
          requirements?: string[] | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: string
          target_audience?: string | null
          thumbnail_url?: string | null
          title?: string
          total_duration_minutes?: number
          total_lessons?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrolments: {
        Row: {
          course_id: string
          enrolled_at: string
          enrolled_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          notes: string | null
          payment_id: string | null
          student_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          enrolled_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          payment_id?: string | null
          student_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          enrolled_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          payment_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrolments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrolments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          course_id: string
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_reference: string
          paystack_transaction_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          student_id: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_reference: string
          paystack_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_reference?: string
          paystack_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean
          is_published: boolean
          module_id: string
          published: boolean
          resource_url: string | null
          slug: string
          sort_order: number
          title: string
          type: Database["public"]["Enums"]["lesson_type"]
          updated_at: string
          video_cf_uid: string | null
          video_duration_seconds: number | null
          youtube_url: string | null
        }
        Insert: {
          content?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          is_published?: boolean
          module_id: string
          published?: boolean
          resource_url?: string | null
          slug: string
          sort_order?: number
          title: string
          type?: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string
          video_cf_uid?: string | null
          video_duration_seconds?: number | null
          youtube_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean
          is_published?: boolean
          module_id?: string
          published?: boolean
          resource_url?: string | null
          slug?: string
          sort_order?: number
          title?: string
          type?: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string
          video_cf_uid?: string | null
          video_duration_seconds?: number | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string
          course_id: string | null
          created_at: string
          last_position_seconds: number | null
          lesson_id: string
          student_id: string
          updated_at: string
          watch_duration_seconds: number | null
        }
        Insert: {
          completed?: boolean
          completed_at?: string
          course_id?: string | null
          created_at?: string
          last_position_seconds?: number | null
          lesson_id: string
          student_id: string
          updated_at?: string
          watch_duration_seconds?: number | null
        }
        Update: {
          completed?: boolean
          completed_at?: string
          course_id?: string | null
          created_at?: string
          last_position_seconds?: number | null
          lesson_id?: string
          student_id?: string
          updated_at?: string
          watch_duration_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_resources: {
        Row: {
          created_at: string
          file_size_bytes: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_downloadable: boolean
          lesson_id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_downloadable?: boolean
          lesson_id: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_downloadable?: boolean
          lesson_id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_resources_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          lesson_id: string | null
          max_attempts: number | null
          pass_mark: number
          show_answers_after_submit: boolean
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          lesson_id?: string | null
          max_attempts?: number | null
          pass_mark?: number
          show_answers_after_submit?: boolean
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          lesson_id?: string | null
          max_attempts?: number | null
          pass_mark?: number
          show_answers_after_submit?: boolean
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string
          id: string
          is_valid: boolean
          issued_at: string
          metadata: Json | null
          revocation_reason: string | null
          revoked_at: string | null
          student_id: string
        }
        Insert: {
          certificate_number: string
          course_id: string
          id?: string
          is_valid?: boolean
          issued_at?: string
          metadata?: Json | null
          revocation_reason?: string | null
          revoked_at?: string | null
          student_id: string
        }
        Update: {
          certificate_number?: string
          course_id?: string
          id?: string
          is_valid?: boolean
          issued_at?: string
          metadata?: Json | null
          revocation_reason?: string | null
          revoked_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          academy_description: string | null
          academy_name: string
          announcements_enabled: boolean
          assignments_enabled: boolean
          certificates_enabled: boolean
          coupons_enabled: boolean
          discussions_enabled: boolean
          drip_content_enabled: boolean
          id: number
          instructor_accounts_enabled: boolean
          live_classes_enabled: boolean
          maintenance_mode: boolean
          prerequisites_enabled: boolean
          quizzes_enabled: boolean
          ratings_enabled: boolean
          reviews_enabled: boolean
          support_email: string | null
          support_phone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          academy_description?: string | null
          academy_name?: string
          announcements_enabled?: boolean
          assignments_enabled?: boolean
          certificates_enabled?: boolean
          coupons_enabled?: boolean
          discussions_enabled?: boolean
          drip_content_enabled?: boolean
          id?: number
          instructor_accounts_enabled?: boolean
          live_classes_enabled?: boolean
          maintenance_mode?: boolean
          prerequisites_enabled?: boolean
          quizzes_enabled?: boolean
          ratings_enabled?: boolean
          reviews_enabled?: boolean
          support_email?: string | null
          support_phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          academy_description?: string | null
          academy_name?: string
          announcements_enabled?: boolean
          assignments_enabled?: boolean
          certificates_enabled?: boolean
          coupons_enabled?: boolean
          discussions_enabled?: boolean
          drip_content_enabled?: boolean
          id?: number
          instructor_accounts_enabled?: boolean
          live_classes_enabled?: boolean
          maintenance_mode?: boolean
          prerequisites_enabled?: boolean
          quizzes_enabled?: boolean
          ratings_enabled?: boolean
          reviews_enabled?: boolean
          support_email?: string | null
          support_phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      video_access_logs: {
        Row: {
          id: string
          ip_address: unknown
          lesson_id: string
          student_id: string
          token_expires_at: string | null
          token_issued_at: string
        }
        Insert: {
          id?: string
          ip_address?: unknown
          lesson_id: string
          student_id: string
          token_expires_at?: string | null
          token_issued_at?: string
        }
        Update: {
          id?: string
          ip_address?: unknown
          lesson_id?: string
          student_id?: string
          token_expires_at?: string | null
          token_issued_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_access_logs_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_access_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_enrolled: { Args: { p_course_id: string }; Returns: boolean }
      is_instructor_or_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      course_status: "draft" | "published" | "archived"
      lesson_type: "video" | "text" | "pdf" | "resource" | "live_class" | "quiz"
      payment_status: "pending" | "successful" | "failed" | "refunded"
      submission_status:
        | "submitted"
        | "reviewed"
        | "approved"
        | "revision_requested"
      user_role: "student" | "instructor" | "admin" | "super_admin"
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

export const Constants = {
  public: {
    Enums: {
      course_status: ["draft", "published", "archived"],
      lesson_type: ["video", "text", "pdf", "resource", "live_class", "quiz"],
      payment_status: ["pending", "successful", "failed", "refunded"],
      submission_status: [
        "submitted",
        "reviewed",
        "approved",
        "revision_requested",
      ],
      user_role: ["student", "instructor", "admin", "super_admin"],
    },
  },
} as const
