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
      users: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: number
          user_id: string
          grade: string
          school: string
          location: string
          bio: string | null
          is_verified: boolean
          amazon_wishlist_url: string | null
          bank_name: string | null
          account_number: string | null
          branch_location: string | null
          account_holder_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          grade: string
          school: string
          location: string
          bio?: string | null
          is_verified?: boolean
          amazon_wishlist_url?: string | null
          bank_name?: string | null
          account_number?: string | null
          branch_location?: string | null
          account_holder_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          grade?: string
          school?: string
          location?: string
          bio?: string | null
          is_verified?: boolean
          amazon_wishlist_url?: string | null
          bank_name?: string | null
          account_number?: string | null
          branch_location?: string | null
          account_holder_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: number
          teacher_id: number
          title: string
          description: string | null
          is_active: boolean
          share_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          teacher_id: number
          title: string
          description?: string | null
          is_active?: boolean
          share_token: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          teacher_id?: number
          title?: string
          description?: string | null
          is_active?: boolean
          share_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: number
          wishlist_id: number
          name: string
          description: string | null
          priority: string
          quantity: number
          estimated_cost: number | null
          is_fulfilled: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          wishlist_id: number
          name: string
          description?: string | null
          priority: string
          quantity: number
          estimated_cost?: number | null
          is_fulfilled?: boolean
          sort_order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          wishlist_id?: number
          name?: string
          description?: string | null
          priority?: string
          quantity?: number
          estimated_cost?: number | null
          is_fulfilled?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      pledges: {
        Row: {
          id: number
          wishlist_item_id: number
          donor_name: string
          donor_email: string
          quantity: number
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          wishlist_item_id: number
          donor_name: string
          donor_email: string
          quantity: number
          message?: string | null
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          wishlist_item_id?: number
          donor_name?: string
          donor_email?: string
          quantity?: number
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}