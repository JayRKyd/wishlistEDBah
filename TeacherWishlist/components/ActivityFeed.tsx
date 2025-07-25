"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, Heart, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ActivityFeed() {
  const supabase = createClient();

  const { data: recentWishlists, isLoading } = useQuery({
    queryKey: ['recent-wishlists'],
    queryFn: async () => {
      // First, get basic wishlist data
      const { data: wishlists, error: wishlistError } = await supabase
        .from('wishlists')
        .select(`
          id,
          title,
          description,
          share_token,
          created_at,
          teacher_id,
          wishlist_items(
            id,
            is_fulfilled
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (wishlistError) throw wishlistError;
      
      // Debug: Test if we can access teachers table at all
      const { data: allTeachers, error: allTeachersError } = await supabase
        .from('teachers')
        .select('id, grade, school')
        .limit(5);
      
      console.log('All teachers test:', { allTeachers, allTeachersError });

      // Then get teacher data for each wishlist
      const enhancedWishlists = await Promise.all(
        (wishlists || []).map(async (wishlist) => {
          if (!wishlist.teacher_id) {
            console.warn('Wishlist missing teacher_id:', wishlist.id);
            return {
              ...wishlist,
              teachers: null
            };
          }

          // Debug: Let's see if we can fetch ANY teacher data first
          console.log('Attempting to fetch teacher with ID:', wishlist.teacher_id);
          
          // First, get teacher basic info
          const { data: teacherData, error: teacherError } = await supabase
            .from('teachers')
            .select('grade, school, location, user_id')
            .eq('id', wishlist.teacher_id)
            .single();
            
          console.log('Teacher query result:', { teacherData, teacherError });

          if (teacherError) {
            console.error('Teacher fetch error for teacher_id', wishlist.teacher_id, ':', teacherError);
            console.error('Error details:', {
              code: teacherError.code,
              message: teacherError.message,
              details: teacherError.details
            });
            return null;
          }

          // Then get user info separately
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', teacherData.user_id)
            .single();

          if (userError) {
            console.error('User fetch error for teacher', wishlist.teacher_id, ':', userError);
            // Continue with teacher data but no user info
          }

          const combinedTeacherData = {
            ...teacherData,
            users: userData || { first_name: 'Unknown', last_name: 'Teacher' }
          };

          return {
            ...wishlist,
            teachers: combinedTeacherData
          };
        })
      );

      // Filter out wishlists with missing teacher data
      const validWishlists = enhancedWishlists.filter(wishlist => wishlist !== null && wishlist.teachers !== null);

      console.log('ActivityFeed original teacher_ids:', wishlists?.map(w => ({ id: w.id, teacher_id: w.teacher_id })));
      console.log('ActivityFeed valid wishlists:', validWishlists);
      return validWishlists;
    },
    retry: false,
  });

  const getItemCounts = (items: any[]) => {
    if (!items) return { total: 0, fulfilled: 0 };
    return {
      total: items.length,
      fulfilled: items.filter((item: any) => item.is_fulfilled).length
    };
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Teacher Requests</h2>
            <p className="text-gray-600">
              Real-time updates • Live feed of teacher needs
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
            <Button variant="ghost" asChild>
              <Link href="/browse">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="w-20 h-3 bg-gray-200 rounded"></div>
                    <div className="w-24 h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentWishlists && recentWishlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentWishlists.map((wishlist: any) => {
              const counts = getItemCounts(wishlist.wishlist_items);
              const isNew = new Date(wishlist.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
              
              return (
                <Card key={wishlist.id} className="hover:shadow-lg transition-all cursor-pointer bg-white border border-gray-200 rounded-lg">
                  <CardContent className="p-6">
                    {/* Header with teacher info and New badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <GraduationCap className="text-white h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">
                            {wishlist.teachers?.users?.first_name || 'Unknown'} {wishlist.teachers?.users?.last_name || 'Teacher'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {wishlist.teachers?.grade || 'Unknown Grade'} • {wishlist.teachers?.school || 'Unknown School'}
                          </p>
                        </div>
                      </div>
                      {isNew && (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          New
                        </Badge>
                      )}
                    </div>
                    
                    {/* Description/Title */}
                    <div className="mb-4">
                      {wishlist.title ? (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {wishlist.title}
                        </p>
                      ) : wishlist.description ? (
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                          {wishlist.description}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Click to view this teacher's wishlist
                        </p>
                      )}
                    </div>

                    {/* Bottom section with counts and button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-gray-500">
                        <span>{counts.total} items</span> • <span>{counts.fulfilled} fulfilled</span>
                      </div>
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
                        <Link href={`/wishlist/${wishlist.share_token}`}>
                          <Heart className="mr-2 h-4 w-4" />
                          View & Help
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent requests</h3>
              <p className="text-gray-600">
                Check back soon for new teacher wishlist requests!
              </p>
            </CardContent>
          </Card>
        )}

        {recentWishlists && recentWishlists.length > 0 && (
          <div className="text-center">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
              <Link href="/browse">
                <ArrowRight className="mr-2 h-4 w-4" />
                Load More Requests
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
} 