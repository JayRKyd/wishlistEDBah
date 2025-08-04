'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, Heart, LayoutDashboard, Gift, ChevronDown, Menu, X } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-16 gap-1 sm:gap-2">
                     {/* Logo */}
           {userRole?.isAuthenticated ? (
             // Non-clickable logo for authenticated users
             <div className="flex items-center min-w-0 flex-shrink-0">
               <GraduationCap className="text-primary text-lg sm:text-xl lg:text-2xl mr-1 sm:mr-2 flex-shrink-0" />
               <h1 className="text-xs sm:text-sm lg:text-xl font-bold text-gray-900 truncate">WishListED Bahamas</h1>
             </div>
           ) : (
             // Clickable logo for public users
             <Link href="/" className="flex items-center hover:opacity-80 transition-opacity min-w-0 flex-shrink-0">
               <GraduationCap className="text-primary text-lg sm:text-xl lg:text-2xl mr-1 sm:mr-2 flex-shrink-0" />
               <h1 className="text-xs sm:text-sm lg:text-xl font-bold text-gray-900 truncate">WishListED Bahamas</h1>
             </Link>
           )}
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
             {userRole?.isAuthenticated ? (
               // Authenticated user navigation
               <>
                 {userRole.isTeacher && (
                   <>
                     <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                       <LayoutDashboard className="inline-block mr-1 h-4 w-4" />
                       Dashboard
                     </Link>
                     <Link href="/browse" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                       <Gift className="inline-block mr-1 h-4 w-4" />
                       Browse Wishlists
                     </Link>
                   </>
                 )}
                                   {userRole.isDonor && (
                    <>
                      <Link href="/donor/dashboard" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                        <Heart className="inline-block mr-1 h-4 w-4" />
                        My Donations
                      </Link>
                      <Link href="/browse" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                        <Gift className="inline-block mr-1 h-4 w-4" />
                        Browse Wishlists
                      </Link>
                    </>
                  )}
                 {/* Admin users get no navigation links - they only manage verification */}
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
           <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink-0">
             {userRole?.isAuthenticated ? (
               // Authenticated user actions
               <>
                 <span className="text-sm text-gray-600 hidden sm:block">
                   Welcome, {displayName} 
                   {userRole.isDonor && <Heart className="inline-block ml-1 h-3 w-3 text-red-500" />}
                   {userRole.isTeacher && <GraduationCap className="inline-block ml-1 h-3 w-3 text-primary" />}
                   {userRole.isAdmin && <GraduationCap className="inline-block ml-1 h-3 w-3 text-purple-500" />}
                 </span>
                 <Button variant="outline" onClick={handleLogout} size="sm" disabled={isLoggingOut} className="hidden sm:inline-flex">
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
                             // Public actions - more compact for mobile
               <div className="flex gap-1 sm:gap-2 min-w-0">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
                       <GraduationCap className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                       <span className="hidden sm:inline">I'm a Teacher</span>
                       <span className="sm:hidden">Teacher</span>
                       <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
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
                 <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
                   <Link href="/auth/donor-login">
                     <Heart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                     <span className="hidden sm:inline">I Want to Help</span>
                     <span className="sm:hidden">Help</span>
                   </Link>
                 </Button>
               </div>
            )}
          </div>

          {/* Mobile Menu */}
          {userRole?.isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userRole.isTeacher && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/browse" className="flex items-center">
                        <Gift className="mr-2 h-4 w-4 text-primary" />
                        Browse Wishlists
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                                 {userRole.isDonor && (
                   <>
                     <DropdownMenuItem asChild>
                       <Link href="/donor/dashboard" className="flex items-center">
                         <Heart className="mr-2 h-4 w-4 text-red-500" />
                         My Donations
                       </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link href="/browse" className="flex items-center">
                         <Gift className="mr-2 h-4 w-4 text-primary" />
                         Browse Wishlists
                       </Link>
                     </DropdownMenuItem>
                   </>
                 )}
                {userRole.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/verification" className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4 text-purple-500" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Header Row */}
          <div className="flex justify-between items-center h-16 gap-2">
            {/* Logo */}
            {userRole?.isAuthenticated ? (
              // Non-clickable logo for authenticated users
              <div className="flex items-center min-w-0 flex-shrink-0">
                <GraduationCap className="text-primary text-lg mr-1 flex-shrink-0" />
                <h1 className="text-sm font-bold text-gray-900 truncate">WishListED Bahamas</h1>
              </div>
            ) : (
              // Clickable logo for public users
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity min-w-0 flex-shrink-0">
                <GraduationCap className="text-primary text-lg mr-1 flex-shrink-0" />
                <h1 className="text-sm font-bold text-gray-900 truncate">WishListED Bahamas</h1>
              </Link>
            )}

            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              {userRole?.isAuthenticated ? (
                // Authenticated user mobile actions
                <>
                  <span className="text-xs text-gray-600">
                    {displayName}
                    {userRole.isDonor && <Heart className="inline-block ml-1 h-3 w-3 text-red-500" />}
                    {userRole.isTeacher && <GraduationCap className="inline-block ml-1 h-3 w-3 text-primary" />}
                    {userRole.isAdmin && <GraduationCap className="inline-block ml-1 h-3 w-3 text-purple-500" />}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Menu className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {userRole.isTeacher && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex items-center">
                              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/browse" className="flex items-center">
                              <Gift className="mr-2 h-4 w-4 text-primary" />
                              Browse Wishlists
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      {userRole.isDonor && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/donor/dashboard" className="flex items-center">
                              <Heart className="mr-2 h-4 w-4 text-red-500" />
                              My Donations
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/browse" className="flex items-center">
                              <Gift className="mr-2 h-4 w-4 text-primary" />
                              Browse Wishlists
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      {userRole.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/verification" className="flex items-center">
                            <GraduationCap className="mr-2 h-4 w-4 text-purple-500" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
                             ) : (
                 // Public user mobile actions - hamburger menu
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                       <Menu className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                                       <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/auth/login" className="flex items-center">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          I'm a Teacher
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/auth/donor-login" className="flex items-center">
                          <Heart className="mr-2 h-4 w-4" />
                          I Want to Help
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
               )}
            </div>
          </div>

          
        </div>
      </div>
    </header>
  );
} 