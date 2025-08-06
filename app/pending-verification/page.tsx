"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, GraduationCap, CheckCircle, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

export default function PendingVerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // Get current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Get teacher profile
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  // Check if teacher is verified and redirect if so
  useEffect(() => {
    if (teacher && teacher.is_teacher_verified) {
      router.push('/dashboard');
    }
  }, [teacher, router]);

  // Auth check - redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, userLoading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (userLoading || teacherLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Clock className="text-yellow-500 text-6xl mr-4" />
            <GraduationCap className="text-primary text-6xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Under Review
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for signing up! Your teacher account is currently being reviewed.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-green-500 text-xl mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email Verified</h3>
                  <p className="text-gray-600">Your email address has been successfully verified.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="text-yellow-500 text-xl mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Teacher Verification Pending</h3>
                  <p className="text-gray-600">
                    Our team is reviewing your teacher account. This typically takes 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-3 text-gray-600">
              <p>• You'll receive an email notification once your account is approved</p>
              <p>• Once approved, you can access your dashboard and create wishlists</p>
              <p>• You can sign out and return later to check your status</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
} 