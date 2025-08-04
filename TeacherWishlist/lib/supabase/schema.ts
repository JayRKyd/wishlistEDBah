// Supabase Database Schema Types
// These match the database schema created in Supabase

export interface User {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  profile_image_url: string | null
  role: 'teacher' | 'admin' | 'donor' | null
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: number
  user_id: string
  grade: string
  school: string
  location: string
  bio: string | null
  is_verified: boolean
  is_teacher_verified: boolean
  verification_comment: string | null
  amazon_wishlist_url: string | null
  bank_name: string | null
  account_number: string | null
  branch_location: string | null
  account_holder_name: string | null
  created_at: string
  updated_at: string
}

export interface Wishlist {
  id: number
  teacher_id: number
  title: string
  description: string | null
  is_active: boolean
  share_token: string
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: number
  wishlist_id: number
  name: string
  description: string | null
  priority: string
  quantity: number
  estimated_cost: string | null
  purchase_link: string | null
  is_fulfilled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Donor {
  id: number
  user_id: string
  phone: string | null
  location: string | null
  motivation: string | null
  total_pledged: number
  total_donated: number
  created_at: string
  updated_at: string
}

export interface Pledge {
  id: number
  wishlist_item_id: number
  donor_id: number | null
  donor_name: string
  donor_email: string
  donor_phone: string | null
  amount: number | null
  quantity: number
  message: string | null
  status: string
  payment_method: string | null
  transaction_reference: string | null
  pledged_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: number
  pledge_id: number | null
  teacher_id: number | null
  donor_id: number | null
  amount: number
  transaction_type: 'pledge' | 'refund'
  payment_method: string | null
  bank_reference: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processed_at: string | null
  created_at: string
}

// Insert types for forms
export interface InsertUser {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  profile_image_url: string | null
  role?: 'teacher' | 'admin' | 'donor' | null
}

export interface InsertTeacher {
  user_id: string
  grade: string
  school: string
  location: string
  bio?: string | null
  is_verified?: boolean
  is_teacher_verified?: boolean
  verification_comment?: string | null
  amazon_wishlist_url?: string | null
  bank_name?: string | null
  account_number?: string | null
  branch_location?: string | null
  account_holder_name?: string | null
}

export interface InsertWishlist {
  teacher_id: number
  title: string
  description?: string | null
  share_token: string
}

export interface InsertDonor {
  user_id: string
  phone?: string | null
  location?: string | null
  motivation?: string | null
}

export interface InsertPledge {
  donor_id: number
  wishlist_item_id: number
  amount: number
  quantity: number
  message?: string | null
  payment_method?: string | null
}

export interface InsertTransaction {
  pledge_id?: number | null
  teacher_id?: number | null
  donor_id?: number | null
  amount: number
  transaction_type: 'pledge' | 'refund'
  payment_method?: string | null
  bank_reference?: string | null
}

export interface InsertWishlistItem {
  wishlist_id: number
  name: string
  description?: string | null
  priority: string
  quantity: number
  estimated_cost?: string | null
  purchase_link?: string | null
  sort_order: number
}

export interface InsertPledge {
  wishlist_item_id: number
  donor_name: string
  donor_email: string
  donor_phone?: string | null
  quantity: number
  message?: string | null
  status: string
}

// Database type for Supabase TypeScript integration
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: InsertUser
        Update: Partial<InsertUser>
      }
      teachers: {
        Row: Teacher
        Insert: InsertTeacher
        Update: Partial<InsertTeacher>
      }
      wishlists: {
        Row: Wishlist
        Insert: InsertWishlist
        Update: Partial<InsertWishlist>
      }
      wishlist_items: {
        Row: WishlistItem
        Insert: InsertWishlistItem
        Update: Partial<InsertWishlistItem>
      }
      pledges: {
        Row: Pledge
        Insert: InsertPledge
        Update: Partial<InsertPledge>
      }
    }
  }
}