'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Search, Filter, Heart, ExternalLink, ArrowLeft, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

export default function BrowseWishlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [grade, setGrade] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showHighPriorityOnly, setShowHighPriorityOnly] = useState(false);
  const [showAddedThisWeek, setShowAddedThisWeek] = useState(false);
  const [showScienceSupplies, setShowScienceSupplies] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const supabase = createClient();

  // Helper functions for filtering and sorting
  const isAddedThisWeek = (createdAt: string) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(createdAt) >= weekAgo;
  };

  const hasHighPriorityItems = (items: any[]) => {
    return items.some(item => item.priority === 'high' && !item.is_fulfilled);
  };

  const hasScienceSupplies = (items: any[]) => {
    const scienceKeywords = ['science', 'lab', 'microscope', 'beaker', 'experiment', 'chemistry', 'biology', 'physics'];
    return items.some(item => 
      scienceKeywords.some(keyword => 
        item.name.toLowerCase().includes(keyword) || 
        (item.description && item.description.toLowerCase().includes(keyword))
      )
    );
  };

  const sortWishlists = (wishlists: any[]) => {
    return [...wishlists].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        
        case 'priority':
          const aHighPriority = (a.wishlist_items || []).filter((item: any) => item.priority === 'high' && !item.is_fulfilled).length;
          const bHighPriority = (b.wishlist_items || []).filter((item: any) => item.priority === 'high' && !item.is_fulfilled).length;
          return bHighPriority - aHighPriority;
        
        case 'completion':
          const aProgress = getProgress(a.wishlist_items || []);
          const bProgress = getProgress(b.wishlist_items || []);
          return aProgress.percentage - bProgress.percentage;
        
        case 'alphabetical':
          const aTeacher = Array.isArray(a.teachers) ? a.teachers[0] : a.teachers;
          const bTeacher = Array.isArray(b.teachers) ? b.teachers[0] : b.teachers;
          const aUser = Array.isArray(aTeacher?.users) ? aTeacher?.users[0] : aTeacher?.users;
          const bUser = Array.isArray(bTeacher?.users) ? bTeacher?.users[0] : bTeacher?.users;
          const aName = `${aUser?.first_name || ''} ${aUser?.last_name || ''}`.trim();
          const bName = `${bUser?.first_name || ''} ${bUser?.last_name || ''}`.trim();
          return aName.localeCompare(bName);
        
        default:
          return 0;
      }
    });
  };

  const { data: wishlists, isLoading } = useQuery({
    queryKey: ['browse-wishlists', debouncedSearch, location, grade, sortBy, showHighPriorityOnly, showAddedThisWeek, showScienceSupplies],
    queryFn: async () => {
      // First get all active wishlists with their teachers
      let query = supabase
        .from('wishlists')
        .select(`
          id,
          title,
          description,
          share_token,
          created_at,
          teacher_id,
          teachers!inner(
            id,
            grade,
            school,
            location,
            is_verified,
            users!inner(first_name, last_name)
          ),
          wishlist_items(
            id,
            name,
            quantity,
            priority,
            is_fulfilled
          )
        `)
        .eq('is_active', true)
        .eq('teachers.is_verified', true);

      // Apply location filter
      if (location && location !== 'all') {
        query = query.eq('teachers.location', location);
      }
      
      // Apply grade filter
      if (grade && grade !== 'all') {
        query = query.eq('teachers.grade', grade);
      }

      const { data: allWishlists, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

              // Client-side search filtering for better control
        let filteredWishlists = allWishlists || [];
        
        if (debouncedSearch) {
          const searchLower = debouncedSearch.toLowerCase();
          filteredWishlists = filteredWishlists.filter(wishlist => {
            const teacher = Array.isArray(wishlist.teachers) ? wishlist.teachers[0] : wishlist.teachers;
            const user = Array.isArray(teacher?.users) ? teacher?.users[0] : teacher?.users;
            
            const title = wishlist.title?.toLowerCase() || '';
            const description = wishlist.description?.toLowerCase() || '';
            const school = teacher?.school?.toLowerCase() || '';
            const firstName = user?.first_name?.toLowerCase() || '';
            const lastName = user?.last_name?.toLowerCase() || '';
            const fullName = `${firstName} ${lastName}`;
            
            return title.includes(searchLower) ||
                   description.includes(searchLower) ||
                   school.includes(searchLower) ||
                   firstName.includes(searchLower) ||
                   lastName.includes(searchLower) ||
                   fullName.includes(searchLower);
          });
        }

        // Apply additional filters
        if (showHighPriorityOnly) {
          filteredWishlists = filteredWishlists.filter(wishlist => 
            hasHighPriorityItems(wishlist.wishlist_items || [])
          );
        }

        if (showAddedThisWeek) {
          filteredWishlists = filteredWishlists.filter(wishlist => 
            isAddedThisWeek(wishlist.created_at)
          );
        }

        if (showScienceSupplies) {
          filteredWishlists = filteredWishlists.filter(wishlist => 
            hasScienceSupplies(wishlist.wishlist_items || [])
          );
        }

        // Apply sorting
        const sortedWishlists = sortWishlists(filteredWishlists);

        return sortedWishlists.slice(0, 20);
    },
    enabled: true,
    retry: false,
  });

  const getPriorityItems = (items: any[]) => {
    return items.filter(item => item.priority === 'high' && !item.is_fulfilled).slice(0, 3);
  };

  const getProgress = (items: any[]) => {
    if (items.length === 0) return { fulfilled: 0, total: 0, percentage: 0 };
    const fulfilled = items.filter(item => item.is_fulfilled).length;
    return {
      fulfilled,
      total: items.length,
      percentage: Math.round((fulfilled / items.length) * 100)
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Teachers to Support</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search by teacher name, school, or location to find specific wishlists, or browse all active requests.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by teacher name or school..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="min-w-[150px]">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Nassau">Nassau</SelectItem>
                    <SelectItem value="Freeport">Freeport</SelectItem>
                    <SelectItem value="Paradise Island">Paradise Island</SelectItem>
                    <SelectItem value="Eleuthera">Eleuthera</SelectItem>
                    <SelectItem value="Exuma">Exuma</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="min-w-[120px]">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="Pre-K">Pre-K</SelectItem>
                    <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                    <SelectItem value="Grade 1">Grade 1</SelectItem>
                    <SelectItem value="Grade 2">Grade 2</SelectItem>
                    <SelectItem value="Grade 3">Grade 3</SelectItem>
                    <SelectItem value="Grade 4">Grade 4</SelectItem>
                    <SelectItem value="Grade 5">Grade 5</SelectItem>
                    <SelectItem value="Grade 6">Grade 6</SelectItem>
                    <SelectItem value="Grade 7">Grade 7</SelectItem>
                    <SelectItem value="Grade 8">Grade 8</SelectItem>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant={showHighPriorityOnly ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowHighPriorityOnly(!showHighPriorityOnly)}
                className={showHighPriorityOnly 
                  ? "bg-orange-600 text-white hover:bg-orange-700" 
                  : "text-orange-600 border-orange-200 hover:bg-orange-50"
                }
              >
                ❗ High Priority Only
              </Button>
              <Button 
                variant={showAddedThisWeek ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowAddedThisWeek(!showAddedThisWeek)}
                className={showAddedThisWeek 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "text-green-600 border-green-200 hover:bg-green-50"
                }
              >
                🕐 Added This Week
              </Button>
              <Button 
                variant={showScienceSupplies ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowScienceSupplies(!showScienceSupplies)}
                className={showScienceSupplies 
                  ? "bg-purple-600 text-white hover:bg-purple-700" 
                  : "text-purple-600 border-purple-200 hover:bg-purple-50"
                }
              >
                🧪 Science Supplies
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{wishlists?.length || 0}</span> teacher wishlists
            </div>
            
            {/* Active filters indicator */}
            {(showHighPriorityOnly || showAddedThisWeek || showScienceSupplies) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Filters:</span>
                {showHighPriorityOnly && (
                  <Badge variant="secondary" className="text-xs">
                    High Priority
                  </Badge>
                )}
                {showAddedThisWeek && (
                  <Badge variant="secondary" className="text-xs">
                    This Week
                  </Badge>
                )}
                {showScienceSupplies && (
                  <Badge variant="secondary" className="text-xs">
                    Science
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowHighPriorityOnly(false);
                    setShowAddedThisWeek(false);
                    setShowScienceSupplies(false);
                  }}
                  className="text-xs h-6 px-2"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="priority">Highest Priority</SelectItem>
                <SelectItem value="completion">Least Complete</SelectItem>
                <SelectItem value="alphabetical">Teacher Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Wishlist Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-3 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wishlists && wishlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlists.map((wishlist: any) => {
              const progress = getProgress(wishlist.wishlist_items || []);
              const priorityItems = getPriorityItems(wishlist.wishlist_items || []);
              const teacher = Array.isArray(wishlist.teachers) ? wishlist.teachers[0] : wishlist.teachers;
              const user = Array.isArray(teacher?.users) ? teacher?.users[0] : teacher?.users;
              
              return (
                <Card key={wishlist.id} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <GraduationCap className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {user?.first_name} {user?.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {teacher?.grade} • {teacher?.school}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {priorityItems.length > 0 ? (
                        priorityItems.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="truncate mr-2">{item.name}</span>
                            {item.priority === 'high' ? (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                                High Priority
                              </Badge>
                            ) : (
                              <span className="text-primary font-medium">Need {item.quantity}</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-2">
                          No high priority items
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-500">
                        <span>{progress.total} items</span> • <span>{progress.fulfilled} fulfilled</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {progress.percentage}% complete
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/wishlist/${wishlist.share_token}`}>
                        <Heart className="mr-2 h-4 w-4" />
                        View & Help
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No wishlists found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search filters or check back later for new teacher requests.
              </p>
              <Button asChild>
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {wishlists && wishlists.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Requests
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}