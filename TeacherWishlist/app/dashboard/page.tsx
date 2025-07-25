"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus, Share, Edit, Check, Trash2, GripVertical } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import TeacherProfileForm from "@/components/TeacherProfileForm";
import WishlistForm from "@/components/WishlistForm";
import Navbar from "@/components/Navbar";

export default function TeacherDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showWishlistForm, setShowWishlistForm] = useState(false);
  const [selectedWishlistId, setSelectedWishlistId] = useState<number | undefined>(undefined);
  const [selectedWishlistTitle, setSelectedWishlistTitle] = useState<string | undefined>(undefined);

  // Get current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Get user profile
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
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

  // Get teacher stats
  const { data: stats } = useQuery({
    queryKey: ['teacher-stats'],
    queryFn: async () => {
      if (!teacher) return null;
      
      const { data: wishlists, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          wishlist_items(*, pledges(*))
        `)
        .eq('teacher_id', teacher.id);
        
      if (error) throw error;
      
      const totalItems = wishlists?.reduce((sum, wishlist) => 
        sum + (wishlist.wishlist_items?.length || 0), 0) || 0;
      const fulfilledItems = wishlists?.reduce((sum, wishlist) =>
        sum + (wishlist.wishlist_items?.filter((item: any) => item.is_fulfilled).length || 0), 0) || 0;
      const pledgedItems = wishlists?.reduce((sum, wishlist) =>
        sum + (wishlist.wishlist_items?.filter((item: any) => item.pledges?.length > 0).length || 0), 0) || 0;
      const neededItems = totalItems - fulfilledItems;
      
      return {
        totalItems,
        fulfilledItems,
        pledgedItems,
        neededItems,
      };
    },
    enabled: !!teacher,
  });

  // Get teacher wishlists
  const { data: wishlists = [] } = useQuery({
    queryKey: ['teacher-wishlists'],
    queryFn: async () => {
      if (!teacher) return [];
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('teacher_id', teacher.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!teacher,
  });

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, data }: { itemId: number; data: any }) => {
      const { error } = await supabase
        .from('wishlist_items')
        .update(data)
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-items'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Item Deleted",
        description: "The item has been successfully removed from your wishlist.",
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      // Invalidate all wishlist-items queries to refresh the display
      queryClient.invalidateQueries({ queryKey: ['wishlist-items'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    },
  });

  // Auth check
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, userLoading, router]);

  const handleMarkFulfilled = (itemId: number, isFulfilled: boolean) => {
    updateItemMutation.mutate({
      itemId,
      data: { is_fulfilled: !isFulfilled }
    });
  };

  const handleDeleteItem = (itemId: number) => {
    if (confirm("Are you sure you want to delete this item?\n\nThis action cannot be undone.")) {
      deleteItemMutation.mutate(itemId);
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(!teacher || teacherLoading) ? (
          /* Teacher Profile Setup */
          <div className="text-center py-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <GraduationCap className="mr-2 h-6 w-6" />
                  Complete Your Teacher Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Please set up your teacher profile to start creating wishlists for your classroom.
                </p>
                <Button onClick={() => setShowProfileForm(true)}>
                  Set Up Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-8">
            {/* Dashboard Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome back, {userProfile?.first_name || "Teacher"}!
                    </h1>
                    <p className="text-gray-600">Manage your classroom wishlist and track donations</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{teacher?.grade}</span>
                      <span>•</span>
                      <span>{teacher?.school}</span>
                      <span>•</span>
                      <span>{teacher?.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" onClick={() => setShowProfileForm(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button onClick={() => {
                      // If user has exactly one wishlist, add to it; otherwise create new
                      if (Array.isArray(wishlists) && wishlists.length === 1) {
                        setSelectedWishlistId(wishlists[0].id);
                        setSelectedWishlistTitle(wishlists[0].title);
                      } else {
                        setSelectedWishlistId(undefined);
                        setSelectedWishlistTitle(undefined);
                      }
                      setShowWishlistForm(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Item
                    </Button>
                  </div>
                </div>
                
                {/* Quick Stats */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Total Items</p>
                          <p className="text-2xl font-bold text-blue-900">{stats?.totalItems || 0}</p>
                        </div>
                        <div className="text-blue-500 text-xl">📋</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Fulfilled</p>
                          <p className="text-2xl font-bold text-green-900">{stats?.fulfilledItems || 0}</p>
                        </div>
                        <Check className="text-green-500 h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-orange-600 font-medium">Pledged</p>
                          <p className="text-2xl font-bold text-orange-900">{stats?.pledgedItems || 0}</p>
                        </div>
                        <div className="text-orange-500 text-xl">❤️</div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Still Needed</p>
                          <p className="text-2xl font-bold text-purple-900">{stats?.neededItems || 0}</p>
                        </div>
                        <div className="text-purple-500 text-xl">⏳</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Wishlist Management */}
            {Array.isArray(wishlists) && wishlists.map((wishlist: any) => (
              <Card key={wishlist.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{wishlist.title || "My Classroom Wishlist"}</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm">
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <span className="text-sm text-gray-500">Share Code: {wishlist.share_token}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <WishlistItems
                    wishlistId={wishlist.id}
                    onMarkFulfilled={handleMarkFulfilled}
                    onDeleteItem={handleDeleteItem}
                    isUpdating={updateItemMutation.isPending || deleteItemMutation.isPending}
                  />
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 bg-gray-50 rounded-lg">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedWishlistId(wishlist.id);
                        setSelectedWishlistTitle(wishlist.title);
                        setShowWishlistForm(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Item to Wishlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!Array.isArray(wishlists) || wishlists.length === 0) && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No wishlists yet</h3>
                  <p className="text-gray-600 mb-6">Create your first wishlist to start receiving donations.</p>
                  <Button onClick={() => {
                    setSelectedWishlistId(undefined);
                    setSelectedWishlistTitle(undefined);
                    setShowWishlistForm(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Wishlist
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Forms */}
      {showProfileForm && (
        <TeacherProfileForm
          teacher={teacher}
          isOpen={showProfileForm}
          onClose={() => setShowProfileForm(false)}
        />
      )}

      {showWishlistForm && teacher && (
        <WishlistForm
          teacherId={teacher.id}
          isOpen={showWishlistForm}
          onClose={() => {
            setShowWishlistForm(false);
            setSelectedWishlistId(undefined);
            setSelectedWishlistTitle(undefined);
          }}
          existingWishlistId={selectedWishlistId}
          existingWishlistTitle={selectedWishlistTitle}
        />
      )}
    </div>
  );
}

function WishlistItems({ 
  wishlistId, 
  onMarkFulfilled, 
  onDeleteItem, 
  isUpdating 
}: { 
  wishlistId: number;
  onMarkFulfilled: (itemId: number, isFulfilled: boolean) => void;
  onDeleteItem: (itemId: number) => void;
  isUpdating: boolean;
}) {
  const supabase = createClient();
  
  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist-items', wishlistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          pledges(*)
        `)
        .eq('wishlist_id', wishlistId)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading items...</div>;
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No items in this wishlist yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item: any) => (
        <div
          key={item.id}
          className={`p-4 border rounded-lg transition-all ${
            item.is_fulfilled 
              ? 'bg-gray-50 border-gray-200 opacity-75' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={item.is_fulfilled}
                readOnly
                className="rounded border-gray-300 text-green-600 focus:ring-green-500" 
              />
              <div className="ml-3 w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 cursor-grab">
                <GripVertical className="h-4 w-4" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`font-semibold ${
                  item.is_fulfilled 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }`}>
                  {item.name}
                </h3>
                {item.priority === 'high' && !item.is_fulfilled && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    High Priority
                  </span>
                )}
                {item.pledges?.length > 0 && !item.is_fulfilled && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    ❤️ {item.pledges?.reduce((sum: number, pledge: any) => sum + pledge.quantity, 0) || 0} Pledged
                  </span>
                )}
                {item.is_fulfilled && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    ✅ Completed
                  </span>
                )}
              </div>
              
              {item.description && (
                <p className={`text-sm mb-3 ${
                  item.is_fulfilled 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              )}
              
              <div className={`flex items-center gap-4 text-sm ${
                item.is_fulfilled ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span>Need: <strong>{item.quantity}</strong></span>
                <span>Pledged: <strong>{item.pledges?.reduce((sum: number, pledge: any) => sum + pledge.quantity, 0) || 0}</strong></span>
                <span>Remaining: <strong>{Math.max(0, item.quantity - (item.pledges?.reduce((sum: number, pledge: any) => sum + pledge.quantity, 0) || 0))}</strong></span>
                {item.estimated_cost && <span>Est. Cost: <strong>{item.estimated_cost}</strong></span>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkFulfilled(item.id, item.is_fulfilled)}
                disabled={isUpdating}
                className={`${
                  item.is_fulfilled 
                    ? 'text-green-700 bg-green-100 hover:bg-green-200' 
                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                }`}
                title={item.is_fulfilled ? 'Mark as not fulfilled' : 'Mark as fulfilled'}
              >
                <Check className={`h-4 w-4 ${item.is_fulfilled ? 'font-bold' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteItem(item.id)}
                disabled={isUpdating}
                className={`${
                  item.is_fulfilled 
                    ? 'text-red-400 hover:text-red-500' 
                    : 'text-red-600 hover:text-red-700'
                } hover:bg-red-50`}
                title="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 