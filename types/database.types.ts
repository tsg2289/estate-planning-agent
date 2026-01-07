export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: any
        Insert: any
        Update: any
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          email: string
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
          email_verified: boolean
          two_factor_enabled: boolean
          preferences: Json
          data_retention_until: string | null
          consent_given_at: string | null
          privacy_policy_accepted_at: string | null
        }
        Insert: {
          id: string
          organization_id?: string | null
          email: string
          full_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          email_verified?: boolean
          two_factor_enabled?: boolean
          preferences?: Json
          data_retention_until?: string | null
          consent_given_at?: string | null
          privacy_policy_accepted_at?: string | null
        }
        Update: {
          id?: string
          organization_id?: string | null
          email?: string
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
          email_verified?: boolean
          two_factor_enabled?: boolean
          preferences?: Json
          data_retention_until?: string | null
          consent_given_at?: string | null
          privacy_policy_accepted_at?: string | null
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
          is_active: boolean
          settings: Json
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          settings?: Json
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          settings?: Json
        }
      }
      estate_documents: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          document_type: 'will' | 'trust' | 'poa' | 'ahcd'
          title: string
          content_encrypted: string
          content_hash: string
          status: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_at: string
          updated_at: string
          completed_at: string | null
          version: number
          is_template: boolean
          metadata: Json
          access_level: string
          shared_with: string[]
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          document_type: 'will' | 'trust' | 'poa' | 'ahcd'
          title: string
          content_encrypted: string
          content_hash: string
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          version?: number
          is_template?: boolean
          metadata?: Json
          access_level?: string
          shared_with?: string[]
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          document_type?: 'will' | 'trust' | 'poa' | 'ahcd'
          title?: string
          content_encrypted?: string
          content_hash?: string
          status?: 'draft' | 'in_progress' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          version?: number
          is_template?: boolean
          metadata?: Json
          access_level?: string
          shared_with?: string[]
          created_by?: string | null
          updated_by?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          organization_id: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          details: Json
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          created_at: string
          data_classification: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
          data_classification?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          organization_id?: string | null
          action?: string
          resource_type?: string | null
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
          data_classification?: string
        }
      }
      ai_processing_logs: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          request_id: string
          anonymization_applied: boolean
          ai_provider: string
          model_used: string | null
          tokens_used: number | null
          processing_time_ms: number | null
          created_at: string
          data_anonymized_at: string | null
          data_deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          request_id: string
          anonymization_applied?: boolean
          ai_provider: string
          model_used?: string | null
          tokens_used?: number | null
          processing_time_ms?: number | null
          created_at?: string
          data_anonymized_at?: string | null
          data_deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          request_id?: string
          anonymization_applied?: boolean
          ai_provider?: string
          model_used?: string | null
          tokens_used?: number | null
          processing_time_ms?: number | null
          created_at?: string
          data_anonymized_at?: string | null
          data_deleted_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_type: 'will' | 'trust' | 'poa' | 'ahcd'
      document_status: 'draft' | 'in_progress' | 'completed' | 'archived'
      audit_action: 'login' | 'logout' | 'document_created' | 'document_updated' | 'document_deleted' | 'document_accessed' | 'ai_request_initiated' | 'ai_response_received' | 'ai_request_failed' | 'profile_updated' | 'password_changed' | 'failed_login'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}