import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get recent wishlists with teacher and user information
    const { data: wishlists, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        title,
        description,
        share_token,
        created_at,
        teachers!inner (
          id,
          grade,
          school,
          location,
          users!inner (
            id,
            first_name,
            last_name
          )
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching wishlists:', error)
      return NextResponse.json({ message: 'Failed to fetch wishlists' }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedWishlists = wishlists?.map(wishlist => ({
      id: wishlist.id,
      title: wishlist.title,
      description: wishlist.description,
      shareToken: wishlist.share_token,
      createdAt: wishlist.created_at,
      teacher: {
        id: wishlist.teachers.id,
        grade: wishlist.teachers.grade,
        school: wishlist.teachers.school,
        location: wishlist.teachers.location,
        user: {
          id: wishlist.teachers.users.id,
          firstName: wishlist.teachers.users.first_name,
          lastName: wishlist.teachers.users.last_name,
        }
      }
    })) || []

    return NextResponse.json(transformedWishlists)
  } catch (error) {
    console.error('Error fetching recent wishlists:', error)
    return NextResponse.json(
      { message: 'Failed to fetch wishlists' },
      { status: 500 }
    )
  }
}