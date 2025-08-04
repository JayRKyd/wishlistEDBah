import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // Get the verified user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if this is a teacher account
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userProfile?.role === 'teacher') {
          // Check if teacher profile exists
          const { data: teacher } = await supabase
            .from('teachers')
            .select('is_teacher_verified')
            .eq('user_id', user.id)
            .single()

          if (!teacher) {
            // Teacher profile doesn't exist yet, redirect to profile creation
            return NextResponse.redirect(new URL('/dashboard', request.url))
          } else if (teacher.is_teacher_verified) {
            // Teacher is verified, redirect to dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url))
          } else {
            // Teacher is not verified, redirect to pending verification page
            return NextResponse.redirect(new URL('/pending-verification', request.url))
          }
        } else {
          // Not a teacher, redirect to dashboard (for donors, etc.)
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=verification_failed', request.url))
}