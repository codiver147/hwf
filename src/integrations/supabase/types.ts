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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          children_ages: string | null
          city: string | null
          country_of_origin: string | null
          created_at: string | null
          email: string | null
          first_name: string
          has_transportation: number | null
          housing_type: string | null
          id: number
          languages_spoken: string | null
          last_name: string
          number_of_adults: number | null
          number_of_children: number | null
          phone: string | null
          postal_code: string | null
          reference_organization: string | null
          status_in_canada: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          children_ages?: string | null
          city?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          has_transportation?: number | null
          housing_type?: string | null
          id?: never
          languages_spoken?: string | null
          last_name: string
          number_of_adults?: number | null
          number_of_children?: number | null
          phone?: string | null
          postal_code?: string | null
          reference_organization?: string | null
          status_in_canada?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          children_ages?: string | null
          city?: string | null
          country_of_origin?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          has_transportation?: number | null
          housing_type?: string | null
          id?: never
          languages_spoken?: string | null
          last_name?: string
          number_of_adults?: number | null
          number_of_children?: number | null
          phone?: string | null
          postal_code?: string | null
          reference_organization?: string | null
          status_in_canada?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      delivery_assignments: {
        Row: {
          completed_date: string | null
          created_at: string | null
          id: number
          notes: string | null
          request_id: number | null
          scheduled_date: string | null
          status: string | null
          updated_at: string | null
          volunteer_id: number | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          id?: never
          notes?: string | null
          request_id?: number | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
          volunteer_id?: number | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          id?: never
          notes?: string | null
          request_id?: number | null
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
          volunteer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_delivery_assignments_request_id"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_delivery_assignments_volunteer_id"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_categories: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category_id: number | null
          condition: string | null
          created_at: string | null
          date_received: string | null
          description: string | null
          id: number
          is_available: number | null
          location: string | null
          name: string
          quantity: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          condition?: string | null
          created_at?: string | null
          date_received?: string | null
          description?: string | null
          id?: number
          is_available?: number | null
          location?: string | null
          name: string
          quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          condition?: string | null
          created_at?: string | null
          date_received?: string | null
          description?: string | null
          id?: number
          is_available?: number | null
          location?: string | null
          name?: string
          quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      request_items: {
        Row: {
          inventory_item_id: number
          quantity: number | null
          request_id: number
          status: string | null
        }
        Insert: {
          inventory_item_id: number
          quantity?: number | null
          request_id: number
          status?: string | null
        }
        Update: {
          inventory_item_id?: number
          quantity?: number | null
          request_id?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_request_items_inventory_item_id"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_request_items_request_id"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      request_teams: {
        Row: {
          created_at: string | null
          id: number
          request_id: number
          team_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          request_id: number
          team_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          request_id?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "request_teams_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      request_volunteers: {
        Row: {
          created_at: string | null
          id: number
          request_id: number | null
          updated_at: string | null
          volunteer_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          request_id?: number | null
          updated_at?: string | null
          volunteer_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          request_id?: number | null
          updated_at?: string | null
          volunteer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_request_volunteers_volunteer_id"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_volunteers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_volunteers_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          client_id: number | null
          created_at: string | null
          description: string | null
          id: number
          location: string | null
          priority: string | null
          scheduled_at: string | null
          status: string | null
          team_id: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          location?: string | null
          priority?: string | null
          scheduled_at?: string | null
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          location?: string | null
          priority?: string | null
          scheduled_at?: string | null
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_request_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_requests_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_requests_team_id"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: number
          joined_at: string | null
          team_id: number | null
          volunteer_id: number | null
        }
        Insert: {
          id?: number
          joined_at?: string | null
          team_id?: number | null
          volunteer_id?: number | null
        }
        Update: {
          id?: number
          joined_at?: string | null
          team_id?: number | null
          volunteer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      team_skills: {
        Row: {
          id: number
          skill_id: number | null
          team_id: number | null
        }
        Insert: {
          id?: number
          skill_id?: number | null
          team_id?: number | null
        }
        Update: {
          id?: number
          skill_id?: number | null
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "team_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_skills_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          active_requests: number | null
          completed_requests: number | null
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          active_requests?: number | null
          completed_requests?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          active_requests?: number | null
          completed_requests?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          is_active: number | null
          last_login: string | null
          last_name: string | null
          password_hash: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: never
          is_active?: number | null
          last_login?: string | null
          last_name?: string | null
          password_hash: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: never
          is_active?: number | null
          last_login?: string | null
          last_name?: string | null
          password_hash?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      volunteer_skills: {
        Row: {
          proficiency_level: string | null
          skill_id: number
          volunteer_id: number
        }
        Insert: {
          proficiency_level?: string | null
          skill_id: number
          volunteer_id: number
        }
        Update: {
          proficiency_level?: string | null
          skill_id?: number
          volunteer_id?: number
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          address: string | null
          availability: Json | null
          created_at: string | null
          email: string | null
          emergency_contact: string | null
          first_name: string
          id: number
          is_active: number | null
          join_date: string | null
          last_name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          availability?: Json | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          first_name: string
          id?: never
          is_active?: number | null
          join_date?: string | null
          last_name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          availability?: Json | null
          created_at?: string | null
          email?: string | null
          emergency_contact?: string | null
          first_name?: string
          id?: never
          is_active?: number | null
          join_date?: string | null
          last_name?: string
          phone?: string | null
          updated_at?: string | null
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
