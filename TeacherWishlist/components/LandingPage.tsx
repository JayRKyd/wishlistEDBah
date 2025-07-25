'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export default function LandingPage() {
  const { data: recentWishlists, isLoading } = useQuery({
    queryKey: ['/api/wishlists/recent'],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="text-primary text-2xl mr-2" />
              <h1 className="text-xl font-bold text-gray-900">WishListED Bahamas</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/browse" className="text-gray-600 hover:text-primary transition-colors">
                Browse Wishlists
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connecting{" "}
              <span className="text-primary">Teachers</span>{" "}
              with{" "}
              <span className="text-secondary">Donors</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Help Bahamian educators get the classroom supplies they need. Browse teacher wishlists, 
              make a difference, and support our local schools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/browse">
                  <Heart className="mr-2 h-5 w-5" />
                  Browse Wishlists
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/auth/signup">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  I'm a Teacher
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Teachers</h3>
              <p className="text-gray-600">Dedicated educators sharing their classroom needs</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Donors</h3>
              <p className="text-gray-600">Generous supporters making education possible</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Impact</h3>
              <p className="text-gray-600">Real change in Bahamian classrooms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Wishlists */}
      {recentWishlists && recentWishlists.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Teacher Requests</h2>
              <p className="text-xl text-gray-600">See what our educators are asking for</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWishlists.slice(0, 3).map((wishlist: any) => (
                <Card key={wishlist.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {wishlist.teacher?.user?.firstName} {wishlist.teacher?.user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {wishlist.teacher?.grade} • {wishlist.teacher?.school}
                        </p>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-lg mb-2">{wishlist.title}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {wishlist.description}
                    </p>
                    
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/wishlist/${wishlist.shareToken}`}>
                        View Wishlist
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/browse">
                  View All Wishlists
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="text-primary text-2xl mr-2" />
                <span className="text-xl font-bold">WishListED Bahamas</span>
              </div>
              <p className="text-gray-400">
                Supporting education in the Bahamas by connecting teachers with generous donors.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse Wishlists</Link></li>
                <li><Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors">For Teachers</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Have questions? We're here to help make education better for everyone.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 WishListED Bahamas. Supporting our teachers, strengthening our future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}