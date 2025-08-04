import { createClient } from '@/lib/supabase/server'
import BrowseWishlists from '@/components/BrowseWishlists'

export default async function BrowsePage() {
  return <BrowseWishlists />
}