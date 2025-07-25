'use client'

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, LogOut, Plus, Heart, BookOpen, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export default function HomePage() {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ["/api/teacher/profile"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/teacher/stats"],
    enabled: !!teacher,
    retry: false,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 500);
      return;
    }
  }, [user, isLoading, toast, router]);

  if (isLoading || teacherLoading) {
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="text-primary text-2xl mr-2" />
              <h1 className="text-xl font-bold text-gray-900">WishListED Bahamas</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/donor" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Donor
              </Link>
              <Link href="/browse" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Browse
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || user?.email}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!teacher ? (
          /* Teacher Setup */
          <div className="text-center py-12">
            <Card className="max-w-lg mx-auto">
              <CardContent className="pt-6">
                <GraduationCap className="mx-auto h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Teacher Profile</h2>
                <p className="text-gray-600 mb-6">
                  Let's set up your profile so you can start creating wishlists for your classroom.
                </p>
                <Button asChild>
                  <Link href="/dashboard">
                    <Plus className="mr-2 h-4 w-4" />
                    Set Up Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Teacher Dashboard */
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Teacher'}!
              </h1>
              <p className="text-blue-100 mb-6">
                {teacher?.grade} at {teacher?.school}, {teacher?.location}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Link href="/dashboard">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Teacher Dashboard
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link href="/donor">
                    <Heart className="mr-2 h-5 w-5" />
                    Donor Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalItems || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Items on your wishlists
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.fulfilledItems || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Items completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Still Needed</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.neededItems || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Items remaining
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Progress Visualization */}
            {stats && stats.totalItems > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Your Impact Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {stats.fulfilledItems} of {stats.totalItems} items fulfilled</span>
                      <span>{Math.round((stats.fulfilledItems / stats.totalItems) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(stats.fulfilledItems / stats.totalItems) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>🎯 Goal: Complete all wishlist items</span>
                      <span>
                        {stats.neededItems === 0 ? '🎉 All done!' : `${stats.neededItems} items to go!`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/dashboard">
                  <CardContent className="p-6 text-center">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Manage Profile</h3>
                    <p className="text-sm text-gray-600">Update your teacher information and settings</p>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/browse">
                  <CardContent className="p-6 text-center">
                    <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Browse Community</h3>
                    <p className="text-sm text-gray-600">See what other teachers are requesting</p>
                  </CardContent>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href="/donor">
                  <CardContent className="p-6 text-center">
                    <div className="bg-green-500/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Your Donations</h3>
                    <p className="text-sm text-gray-600">Track your contributions to other teachers</p>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}