'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LandingPage from '@/components/LandingPage'

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleVerification = async () => {
      const code = searchParams.get('code')
      
      if (code) {
        try {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (!error) {
            // Small delay to ensure database is updated
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Get the user to check their role
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
              try {
                // Check user role and redirect accordingly
                const { data: userProfile, error: profileError } = await supabase
                  .from('users')
                  .select('role')
                  .eq('id', user.id)
                  .single()

                if (profileError) {
                  console.error('Profile fetch error:', profileError)
                  // Fallback: redirect to role selection or login
                  router.push('/auth/login?error=profile_not_found')
                  return
                }

                if (userProfile?.role === 'donor') {
                  router.push('/donor/dashboard')
                  return
                } else if (userProfile?.role === 'teacher') {
                  // Check if teacher profile exists
                  const { data: teacher, error: teacherError } = await supabase
                    .from('teachers')
                    .select('is_teacher_verified')
                    .eq('user_id', user.id)
                    .single()

                  if (teacherError && teacherError.code !== 'PGRST116') {
                    console.error('Teacher profile fetch error:', teacherError)
                    // Teacher profile doesn't exist yet, redirect to dashboard for profile creation
                    router.push('/dashboard')
                    return
                  }

                  if (!teacher) {
                    // Teacher profile doesn't exist yet, redirect to dashboard for profile creation
                    router.push('/dashboard')
                    return
                  } else if (teacher.is_teacher_verified) {
                    // Teacher is verified, redirect to dashboard
                    router.push('/dashboard')
                    return
                  } else {
                    // Teacher is not verified, redirect to pending verification page
                    router.push('/pending-verification')
                    return
                  }
                } else if (userProfile?.role === 'admin') {
                  // Admin role, redirect to admin verification page
                  router.push('/admin/verification')
                  return
                } else {
                  // Unknown role or no role, redirect to login with error
                  router.push('/auth/login?error=unknown_role')
                  return
                }
              } catch (error) {
                console.error('Role detection error:', error)
                // Fallback: redirect to login with error
                router.push('/auth/login?error=verification_failed')
                return
              }
            } else {
              // No user found, redirect to login
              router.push('/auth/login?error=user_not_found')
              return
            }
          } else {
            console.error('Verification error:', error)
            // Redirect to login with error
            router.push('/auth/login?error=verification_failed')
          }
        } catch (error) {
          console.error('Verification failed:', error)
          router.push('/auth/login?error=verification_failed')
        }
      }
    }

    handleVerification()
  }, [searchParams, router, supabase])

  return <LandingPage />
}

export default function RootPage() {
  return (
    <Suspense fallback={<LandingPage />}>
      <HomePageContent />
    </Suspense>
  )
}