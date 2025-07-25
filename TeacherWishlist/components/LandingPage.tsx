"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, Search, Plus, Users, CheckCircle, Clock } from "lucide-react";
import ActivityFeed from "@/components/ActivityFeed";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export default function LandingPage() {
  const supabase = createClient();

  // Fetch platform statistics
  const { data: platformStats, isLoading: statsLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      // Get active (verified) teachers count
      const { count: activeTeachers, error: teachersError } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true);

      if (teachersError) throw teachersError;

      // Get fulfilled items count
      const { count: itemsFulfilled, error: itemsError } = await supabase
        .from('wishlist_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_fulfilled', true);

      if (itemsError) throw itemsError;

      // Get unique donors count (for now we'll use a placeholder since pledges system isn't implemented yet)
      // TODO: When pledges system is implemented, query: SELECT COUNT(DISTINCT donor_email) FROM pledges WHERE status = 'completed'
      const generousDonors = 0;

      return {
        activeTeachers: activeTeachers || 0,
        itemsFulfilled: itemsFulfilled || 0,
        generousDonors
      };
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <GraduationCap className="text-primary text-2xl mr-2" />
                  <h1 className="text-xl font-bold text-gray-900">WishListED Bahamas</h1>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/browse" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Browse Wishlists
              </Link>
              <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                How It Works
              </a>
              <a href="#about" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                About
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/auth/login'}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                I'm a Teacher
              </Button>
              <Button variant="outline" asChild>
                <Link href="/browse">
                  <Heart className="mr-2 h-4 w-4" />
                  I Want to Help
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Supporting Bahamian <span className="text-primary">Teachers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect teachers with the supplies they need and donors who care. Every classroom deserves the resources to succeed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/auth/login'}
                className="bg-primary text-white hover:bg-blue-700 transform hover:scale-105 shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create My Wishlist
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg">
                <Link href="/browse">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Wishlists
                </Link>
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {statsLoading ? '...' : platformStats?.activeTeachers || 0}
                </div>
                <div className="text-gray-600">Active Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {statsLoading ? '...' : platformStats?.itemsFulfilled || 0}
                </div>
                <div className="text-gray-600">Items Fulfilled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {statsLoading ? '...' : platformStats?.generousDonors || 0}
                </div>
                <div className="text-gray-600">Generous Donors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect teachers with the supplies they need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">For Teachers</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Create Your Account</h4>
                    <p className="text-gray-600">Sign up and verify your teacher status</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Build Your Wishlist</h4>
                    <p className="text-gray-600">Add items your classroom needs with descriptions and quantities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Share & Receive</h4>
                    <p className="text-gray-600">Share your wishlist and coordinate with donors</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">For Donors</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Browse Wishlists</h4>
                    <p className="text-gray-600">Find teachers and classrooms that need support</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Pledge Items</h4>
                    <p className="text-gray-600">Commit to donating specific items - no payment required</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Coordinate Delivery</h4>
                    <p className="text-gray-600">Contact the teacher to arrange donation drop-off</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <GraduationCap className="text-primary text-2xl mr-2" />
                <h3 className="text-xl font-bold">TeachersConnect Bahamas</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Connecting Bahamian teachers with generous donors to ensure every classroom has the supplies needed for quality education.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Teachers</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Create Account</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Create Wishlists</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Share Your List</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Donors</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse Wishlists</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">How to Help</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Your Impact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Donation Guidelines</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 WishListED Bahamas. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}