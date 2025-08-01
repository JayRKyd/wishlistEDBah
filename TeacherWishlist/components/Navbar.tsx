'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, Heart, LayoutDashboard, Gift, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const { data: userRole } = useUserRole();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Force a full page reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const displayName = userRole?.profile?.first_name || userRole?.user?.email?.split('@')[0] || 'User';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <GraduationCap className="text-primary text-2xl mr-2" />
            <h1 className="text-xl font-bold text-gray-900">WishListED Bahamas</h1>
          </Link>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {userRole?.isAuthenticated ? (
              // Authenticated user navigation
              <>
                {userRole.isTeacher && (
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    <LayoutDashboard className="inline-block mr-1 h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                {userRole.isDonor && (
                  <Link href="/donor/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    <Heart className="inline-block mr-1 h-4 w-4" />
                    My Donations
                  </Link>
                )}
                <Link href="/browse" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  <Gift className="inline-block mr-1 h-4 w-4" />
                  Browse Wishlists
                </Link>
                <Link href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
              </>
            ) : (
              // Public navigation
              <>
                <Link href="/browse" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Browse Wishlists
                </Link>
                <Link href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  How It Works
                </a>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {userRole?.isAuthenticated ? (
              // Authenticated user actions
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {displayName} 
                  {userRole.isDonor && <Heart className="inline-block ml-1 h-3 w-3 text-red-500" />}
                  {userRole.isTeacher && <GraduationCap className="inline-block ml-1 h-3 w-3 text-primary" />}
                </span>
                <Button variant="outline" onClick={handleLogout} size="sm" disabled={isLoggingOut}>
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </>
                  )}
                </Button>
              </>
            ) : (
              // Public actions - different buttons for different user types
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      I'm a Teacher
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signup" className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" asChild>
                  <Link href="/auth/donor-login">
                    <Heart className="mr-2 h-4 w-4" />
                    I Want to Help
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 