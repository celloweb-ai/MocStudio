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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          asset_code: string | null
          asset_type: string
          created_at: string
          created_by: string
          criticality: string
          description: string | null
          facility_id: string | null
          id: string
          last_maintenance: string | null
          location: string | null
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          asset_code?: string | null
          asset_type: string
          created_at?: string
          created_by: string
          criticality?: string
          description?: string | null
          facility_id?: string | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          asset_code?: string | null
          asset_type?: string
          created_at?: string
          created_by?: string
          criticality?: string
          description?: string | null
          facility_id?: string | null
          id?: string
          last_maintenance?: string | null
          location?: string | null
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          code: string | null
          created_at: string
          facility_type: string | null
          id: string
          location: string | null
          manager_id: string | null
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          facility_type?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          facility_type?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      moc_approvers: {
        Row: {
          comments: string | null
          created_at: string
          id: string
          moc_request_id: string
          responded_at: string | null
          role_required: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["approval_status"] | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: string
          moc_request_id: string
          responded_at?: string | null
          role_required: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["approval_status"] | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: string
          moc_request_id?: string
          responded_at?: string | null
          role_required?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["approval_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moc_approvers_moc_request_id_fkey"
            columns: ["moc_request_id"]
            isOneToOne: false
            referencedRelation: "moc_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      moc_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: string | null
          id: string
          moc_comment_id: string | null
          moc_request_id: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: string | null
          id?: string
          moc_comment_id?: string | null
          moc_request_id?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: string | null
          id?: string
          moc_comment_id?: string | null
          moc_request_id?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "moc_attachments_moc_comment_id_fkey"
            columns: ["moc_comment_id"]
            isOneToOne: false
            referencedRelation: "moc_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moc_attachments_moc_request_id_fkey"
            columns: ["moc_request_id"]
            isOneToOne: false
            referencedRelation: "moc_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      moc_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          moc_request_id: string
          parent_comment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          moc_request_id: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          moc_request_id?: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moc_comments_moc_request_id_fkey"
            columns: ["moc_request_id"]
            isOneToOne: false
            referencedRelation: "moc_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moc_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "moc_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      moc_history: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          moc_request_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          moc_request_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          moc_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moc_history_moc_request_id_fkey"
            columns: ["moc_request_id"]
            isOneToOne: false
            referencedRelation: "moc_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      moc_requests: {
        Row: {
          affected_areas: string[] | null
          affected_systems: string[] | null
          change_type: Database["public"]["Enums"]["moc_change_type"] | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          estimated_duration: string | null
          facility_id: string | null
          id: string
          is_temporary: boolean | null
          justification: string | null
          mitigation_measures: string | null
          priority: Database["public"]["Enums"]["moc_priority"] | null
          request_number: string
          requires_hazop: boolean | null
          review_deadline: string | null
          risk_category: string | null
          risk_probability: number | null
          risk_severity: number | null
          status: Database["public"]["Enums"]["moc_status"] | null
          submitted_at: string | null
          target_implementation_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_areas?: string[] | null
          affected_systems?: string[] | null
          change_type?: Database["public"]["Enums"]["moc_change_type"] | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          estimated_duration?: string | null
          facility_id?: string | null
          id?: string
          is_temporary?: boolean | null
          justification?: string | null
          mitigation_measures?: string | null
          priority?: Database["public"]["Enums"]["moc_priority"] | null
          request_number: string
          requires_hazop?: boolean | null
          review_deadline?: string | null
          risk_category?: string | null
          risk_probability?: number | null
          risk_severity?: number | null
          status?: Database["public"]["Enums"]["moc_status"] | null
          submitted_at?: string | null
          target_implementation_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_areas?: string[] | null
          affected_systems?: string[] | null
          change_type?: Database["public"]["Enums"]["moc_change_type"] | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          estimated_duration?: string | null
          facility_id?: string | null
          id?: string
          is_temporary?: boolean | null
          justification?: string | null
          mitigation_measures?: string | null
          priority?: Database["public"]["Enums"]["moc_priority"] | null
          request_number?: string
          requires_hazop?: boolean | null
          review_deadline?: string | null
          risk_category?: string | null
          risk_probability?: number | null
          risk_severity?: number | null
          status?: Database["public"]["Enums"]["moc_status"] | null
          submitted_at?: string | null
          target_implementation_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "moc_requests_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      moc_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          moc_request_id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          moc_request_id: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          moc_request_id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "moc_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moc_tasks_moc_request_id_fkey"
            columns: ["moc_request_id"]
            isOneToOne: false
            referencedRelation: "moc_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          email_sent: boolean
          id: string
          is_read: boolean
          message: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          email_sent?: boolean
          id?: string
          is_read?: boolean
          message: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          email_sent?: boolean
          id?: string
          is_read?: boolean
          message?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          facility_id: string | null
          full_name: string | null
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          facility_id?: string | null
          full_name?: string | null
          id: string
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          facility_id?: string | null
          full_name?: string | null
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_orders: {
        Row: {
          assignee: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          facility_id: string | null
          id: string
          moc_request_id: string | null
          order_number: string | null
          priority: string
          progress: number
          status: string
          title: string
          updated_at: string
          work_type: string
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          facility_id?: string | null
          id?: string
          moc_request_id?: string | null
          order_number?: string | null
          priority?: string
          progress?: number
          status?: string
          title: string
          updated_at?: string
          work_type?: string
        }
        Update: {
          assignee?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          facility_id?: string | null
          id?: string
          moc_request_id?: string | null
          order_number?: string | null
          priority?: string
          progress?: number
          status?: string
          title?: string
          updated_at?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_moc_request_id_fkey"
            columns: ["moc_request_id"]
            isOneToOne: false
            referencedRelation: "moc_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_moc: { Args: { _moc_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_moc_approver: { Args: { _moc_id: string }; Returns: boolean }
      is_moc_owner: { Args: { _moc_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "administrator"
        | "facility_manager"
        | "process_engineer"
        | "maintenance_technician"
        | "hse_coordinator"
        | "approval_committee"
      approval_status: "pending" | "approved" | "rejected" | "changes_requested"
      moc_change_type:
        | "equipment_modification"
        | "equipment_replacement"
        | "equipment_addition"
        | "procedure_change"
        | "software_change"
        | "major_change"
      moc_priority: "low" | "medium" | "high" | "critical"
      moc_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "implemented"
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
      app_role: [
        "administrator",
        "facility_manager",
        "process_engineer",
        "maintenance_technician",
        "hse_coordinator",
        "approval_committee",
      ],
      approval_status: ["pending", "approved", "rejected", "changes_requested"],
      moc_change_type: [
        "equipment_modification",
        "equipment_replacement",
        "equipment_addition",
        "procedure_change",
        "software_change",
        "major_change",
      ],
      moc_priority: ["low", "medium", "high", "critical"],
      moc_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "implemented",
      ],
    },
  },
} as const
