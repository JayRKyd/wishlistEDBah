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
            // Redirect to our verification endpoint
            router.push('/auth/verify?token_hash=' + code + '&type=signup')
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