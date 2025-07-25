import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Return user data in the expected format
    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.user_metadata.first_name || null,
      lastName: user.user_metadata.last_name || null,
      profileImageUrl: user.user_metadata.profile_image_url || null,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}