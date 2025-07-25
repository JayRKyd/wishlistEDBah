'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Heart, Search, MapPin, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

export default function BrowseWishlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: wishlists, isLoading } = useQuery({
    queryKey: ['/api/wishlists/search', debouncedSearch, selectedLocation, selectedGrade],
    enabled: true,
    retry: false,
  });

  const { data: recentWishlists } = useQuery({
    queryKey: ['/api/wishlists/recent'],
    retry: false,
  });

  const displayWishlists = wishlists || recentWishlists || [];

  const locations = ["Nassau", "Freeport", "Eleuthera", "Exuma", "Andros", "Abaco"];
  const grades = ["Pre-K", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

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
            
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Teacher Wishlists</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what our Bahamian teachers need for their classrooms and help make a difference in education.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by teacher name, school, or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Grades</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlists...</p>
          </div>
        ) : displayWishlists.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wishlists found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new requests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayWishlists.map((wishlist: any) => (
              <Card key={wishlist.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {wishlist.teacher?.user?.firstName} {wishlist.teacher?.user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {wishlist.teacher?.grade} • {wishlist.teacher?.school}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {wishlist.teacher?.location}
                  </div>
                  
                  <h4 className="font-semibold text-lg mb-2">{wishlist.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {wishlist.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {wishlist.teacher?.grade}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/wishlist/${wishlist.shareToken}`}>
                          <Heart className="mr-1 h-3 w-3" />
                          View & Support
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-blue-100 mb-6">
              Every contribution helps our teachers create better learning environments for Bahamian students.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">
                Join Our Community
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}