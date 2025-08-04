'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function VerifyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleVerification = async () => {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')
      
      if (!token_hash || !type) {
        setStatus('error')
        setMessage('Invalid verification link')
        return
      }

      try {
        // Verify the OTP
        const { error } = await supabase.auth.verifyOtp({
          type: type as any,
          token_hash,
        })

        if (error) {
          setStatus('error')
          setMessage(error.message)
          return
        }

        // Get the verified user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setStatus('error')
          setMessage('User not found')
          return
        }

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
        } else if (userProfile?.role === 'donor') {
          // Donor account, redirect to donor dashboard
          router.push('/donor/dashboard')
          return
        } else {
          // Admin or other roles, redirect to appropriate dashboard
          router.push('/dashboard')
          return
        }

        setStatus('success')
        setMessage('Email verified successfully!')
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('Verification failed. Please try again.')
      }
    }

    handleVerification()
  }, [searchParams, router, supabase])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="text-primary text-4xl" />
            </div>
            <CardTitle className="text-2xl font-bold">Verifying Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <XCircle className="text-red-500 text-4xl" />
            </div>
            <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">
                  Go to Login
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="text-green-500 text-4xl" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">{message}</p>
          <Button asChild className="w-full">
            <Link href="/dashboard">
              Continue to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="text-primary text-4xl" />
            </div>
            <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
            <p className="text-gray-600">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
} 