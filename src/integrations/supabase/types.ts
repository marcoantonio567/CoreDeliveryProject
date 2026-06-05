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
      certificates: {
        Row: {
          id: string
          issued_at: string
          project_id: string
          user_id: string
        }
        Insert: {
          id?: string
          issued_at?: string
          project_id: string
          user_id: string
        }
        Update: {
          id?: string
          issued_at?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number | null
          created_at: string
          description: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_requests: {
        Row: {
          address: string
          contact_email: string | null
          contact_info: string
          contact_phone: string | null
          created_at: string
          description: string
          freight_approved: boolean | null
          id: string
          material_id: string
          needs_freight: boolean
          quantity: number | null
          user_id: string
        }
        Insert: {
          address?: string
          contact_email?: string | null
          contact_info?: string
          contact_phone?: string | null
          created_at?: string
          description: string
          freight_approved?: boolean | null
          id?: string
          material_id: string
          needs_freight?: boolean
          quantity?: number | null
          user_id: string
        }
        Update: {
          address?: string
          contact_email?: string | null
          contact_info?: string
          contact_phone?: string | null
          created_at?: string
          description?: string
          freight_approved?: boolean | null
          id?: string
          material_id?: string
          needs_freight?: boolean
          quantity?: number | null
          user_id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          availability_status: string | null
          condition: string | null
          contact_email: string | null
          contact_info: string
          contact_phone: string | null
          created_at: string
          description: string
          id: string
          images: string[]
          location: string
          name: string
          owner_id: string
          quantity: number
          rejection_reason: string | null
          status: Database["public"]["Enums"]["material_status"]
          unit: string | null
        }
        Insert: {
          availability_status?: string | null
          condition?: string | null
          contact_email?: string | null
          contact_info?: string
          contact_phone?: string | null
          created_at?: string
          description: string
          id?: string
          images?: string[]
          location: string
          name: string
          owner_id: string
          quantity?: number
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["material_status"]
          unit?: string | null
        }
        Update: {
          availability_status?: string | null
          condition?: string | null
          contact_email?: string | null
          contact_info?: string
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          location?: string
          name?: string
          owner_id?: string
          quantity?: number
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["material_status"]
          unit?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          availability: string | null
          avatar_url: string | null
          birth_date: string | null
          city: string | null
          created_at: string
          display_name: string
          experience_years: number | null
          id: string
          phone: string | null
          pix_key: string | null
          pix_key_type: string | null
          profession: string | null
          professional_register: string | null
          specialty: string | null
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          availability?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          display_name?: string
          experience_years?: number | null
          id: string
          phone?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          profession?: string | null
          professional_register?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          availability?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          display_name?: string
          experience_years?: number | null
          id?: string
          phone?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          profession?: string | null
          professional_register?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_expenses: {
        Row: {
          amount: number
          created_at: string
          date: string | null
          description: string
          id: string
          project_id: string | null
          receipt_url: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string | null
          description: string
          id?: string
          project_id?: string | null
          receipt_url?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string | null
          description?: string
          id?: string
          project_id?: string | null
          receipt_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_needs: {
        Row: {
          created_at: string
          description: string
          id: string
          project_id: string | null
          quantity_met: number | null
          quantity_needed: number | null
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          project_id?: string | null
          quantity_met?: number | null
          quantity_needed?: number | null
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          project_id?: string | null
          quantity_met?: number | null
          quantity_needed?: number | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_needs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_requests: {
        Row: {
          contact_info: string
          created_at: string
          description: string
          id: string
          project_id: string
          quantity: number | null
          request_type: string
          status: string
          user_id: string
        }
        Insert: {
          contact_info?: string
          created_at?: string
          description: string
          id?: string
          project_id: string
          quantity?: number | null
          request_type: string
          status?: string
          user_id: string
        }
        Update: {
          contact_info?: string
          created_at?: string
          description?: string
          id?: string
          project_id?: string
          quantity?: number | null
          request_type?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          created_at: string
          description: string
          id: string
          images: string[] | null
          project_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          project_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          beneficiary_children: number | null
          beneficiary_income: string | null
          beneficiary_name: string | null
          beneficiary_residents: number | null
          beneficiary_situation: string | null
          beneficiary_vulnerability: string | null
          completion_status: Database["public"]["Enums"]["completion_status"]
          created_at: string
          description: string
          end_date: string | null
          estimated_cost: number | null
          financial_goal: number | null
          id: string
          images: string[]
          improvement_type: string
          location: string
          name: string
          observations: string | null
          owner_id: string
          rejection_reason: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
          urgency: string | null
        }
        Insert: {
          beneficiary_children?: number | null
          beneficiary_income?: string | null
          beneficiary_name?: string | null
          beneficiary_residents?: number | null
          beneficiary_situation?: string | null
          beneficiary_vulnerability?: string | null
          completion_status?: Database["public"]["Enums"]["completion_status"]
          created_at?: string
          description: string
          end_date?: string | null
          estimated_cost?: number | null
          financial_goal?: number | null
          id?: string
          images?: string[]
          improvement_type: string
          location: string
          name: string
          observations?: string | null
          owner_id: string
          rejection_reason?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          beneficiary_children?: number | null
          beneficiary_income?: string | null
          beneficiary_name?: string | null
          beneficiary_residents?: number | null
          beneficiary_situation?: string | null
          beneficiary_vulnerability?: string | null
          completion_status?: Database["public"]["Enums"]["completion_status"]
          created_at?: string
          description?: string
          end_date?: string | null
          estimated_cost?: number | null
          financial_goal?: number | null
          id?: string
          images?: string[]
          improvement_type?: string
          location?: string
          name?: string
          observations?: string | null
          owner_id?: string
          rejection_reason?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          urgency?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          project_id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
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
      volunteer_requests: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          message: string
          project_id: string
          skills: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          message?: string
          project_id: string
          skills?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          message?: string
          project_id?: string
          skills?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      completion_status:
        | "in_progress"
        | "completion_requested"
        | "completed"
        | "completion_rejected"
      material_status: "pending" | "approved" | "rejected" | "disabled"
      project_status: "pending" | "approved" | "rejected" | "disabled"
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
      app_role: ["admin", "user"],
      completion_status: [
        "in_progress",
        "completion_requested",
        "completed",
        "completion_rejected",
      ],
      material_status: ["pending", "approved", "rejected", "disabled"],
      project_status: ["pending", "approved", "rejected", "disabled"],
    },
  },
} as const
