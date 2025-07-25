// Supabase Database Schema Types
// These match the database schema created in Supabase

export interface User {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  profile_image_url: string | null
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
  estimated_cost: number | null
  is_fulfilled: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Pledge {
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

// Insert types for forms
export interface InsertUser {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  profile_image_url: string | null
}

export interface InsertTeacher {
  user_id: string
  grade: string
  school: string
  location: string
  bio?: string | null
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

export interface InsertWishlistItem {
  wishlist_id: number
  name: string
  description?: string | null
  priority: string
  quantity: number
  estimated_cost?: number | null
  sort_order: number
}

export interface InsertPledge {
  wishlist_item_id: number
  donor_name: string
  donor_email: string
  quantity: number
  message?: string | null
  status: string
}