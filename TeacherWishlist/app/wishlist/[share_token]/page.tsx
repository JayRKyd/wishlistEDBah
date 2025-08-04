"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Share, 
  Mail, 
  GraduationCap, 
  MapPin, 
  School,
  Heart,
  ExternalLink,
  Package
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import DonorAuthModal from "@/components/DonorAuthModal";
import PledgeModal from "@/components/PledgeModal";
import { useUserRole } from "@/hooks/useUserRole";

export default function WishlistPage() {
  const params = useParams();
  const shareToken = params.share_token as string;
  const supabase = createClient();
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // User role checking
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  // Handle pledge button clicks
  const handlePledgeClick = (item: any, teacherName: string) => {
    // Wait for role to be loaded
    if (roleLoading) {
      return;
    }
    
    if (!userRole?.isAuthenticated) {
      // Not logged in - show auth modal
      setSelectedItem({ name: item.name, teacherName });
      setShowAuthModal(true);
    } else if (userRole.isDonor) {
      // Logged in as donor - open pledge modal
      setSelectedItem(item);
      setShowPledgeModal(true);
    } else if (userRole.isTeacher) {
      // Logged in as teacher - do nothing (button won't show)
      return;
    }
  };

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist', shareToken],
    queryFn: async () => {
      // Get wishlist with basic teacher data using a simpler query
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          title,
          description,
          created_at,
          updated_at,
          teacher_id,
          wishlist_items(
            id,
            name,
            description,
            quantity,
            priority,
            purchase_link,
            estimated_cost,
            is_fulfilled,
            sort_order
          )
        `)
        .eq('share_token', shareToken)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      // Get teacher info with raw SQL-like query
      const { data: teacherInfo } = await supabase
        .rpc('get_teacher_with_user', { teacher_id: data.teacher_id });

      // If RPC doesn't work, get the data manually
      if (!teacherInfo) {
        const { data: teacherData } = await supabase
          .from('teachers')
          .select('grade, school, location, bio, amazon_wishlist_url, user_id')
          .eq('id', data.teacher_id)
          .single();

        const { data: userData } = await supabase
          .from('users')
          .select('first_name, last_name, email')
          .eq('id', teacherData?.user_id)
          .single();

        return {
          ...data,
          teachers: {
            ...teacherData,
            users: userData
          }
        };
      }

      return {
        ...data,
        teachers: teacherInfo
      };
    },
    enabled: !!shareToken,
    retry: false,
  });

  const getProgress = () => {
    if (!wishlist?.wishlist_items) return { fulfilled: 0, total: 0, percentage: 0 };
    const fulfilled = wishlist.wishlist_items.filter(item => item.is_fulfilled).length;
    const total = wishlist.wishlist_items.length;
    return {
      fulfilled,
      total,
      percentage: total > 0 ? Math.round((fulfilled / total) * 100) : 0
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = async () => {
    const teacher = wishlist?.teachers;
    const user = teacher?.users;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.first_name}'s Classroom Wishlist`,
          text: `Help support ${user?.first_name} ${user?.last_name}'s classroom!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleContactTeacher = () => {
    const teacher = wishlist?.teachers;
    const user = teacher?.users;
    
    if (!user?.email) {
      // If no email is available, show a message or fallback
      alert('Teacher contact information is not available.');
      return;
    }

    // Create email subject and body
    const subject = encodeURIComponent(`Support for ${user?.first_name} ${user?.last_name}'s Classroom Wishlist`);
    const body = encodeURIComponent(
      `Hello ${user?.first_name} ${user?.last_name},

I saw your classroom wishlist on WishListED Bahamas and would like to help support your classroom!

Teacher: ${user?.first_name} ${user?.last_name}
School: ${teacher?.school}
Grade: ${teacher?.grade}
Location: ${teacher?.location}

Wishlist: ${window.location.href}

Please let me know how I can best help support your classroom needs.

Best regards,
[Your name]`
    );

    // Open default email client
    const mailtoLink = `mailto:${user.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            {/* Header */}
            <div className="flex items-center mb-8">
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
            </div>
            
            {/* Profile Card */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-48 h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="w-64 h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex items-center justify-center flex-1 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wishlist Not Found</h2>
            <p className="text-gray-600 mb-6">
              This wishlist may have been removed or the link is incorrect.
            </p>
            <Button asChild>
              <Link href="/browse">
                Browse Other Wishlists
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = getProgress();
  const teacher = wishlist.teachers;
  const user = teacher?.users;
  const sortedItems = wishlist.wishlist_items?.sort((a, b) => a.sort_order - b.sort_order) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Teacher Profile Card with Progress */}
        <Card className="mb-8 border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="text-white h-10 w-10" />
                </div>

                {/* Teacher Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <School className="h-4 w-4 mr-2" />
                      <span className="text-sm">{teacher?.grade}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span className="text-sm">{teacher?.school}</span>
                    </div>
                    <div className="flex items-center text-pink-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{teacher?.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {wishlist.description || wishlist.title || "I need help"}
                  </p>
                </div>
              </div>

                            {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleShare} className="flex items-center">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button 
                  onClick={handleContactTeacher}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Teacher
                </Button>
                {teacher?.amazon_wishlist_url && (
                  <Button variant="outline" asChild>
                    <a href={teacher.amazon_wishlist_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Amazon Wishlist
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Wishlist Progress</h3>
                  <p className="text-sm text-gray-600">
                    {progress.fulfilled} of {progress.total} items fulfilled
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {progress.percentage}% Complete
                  </div>
                  <p className="text-sm text-gray-500">
                    Last updated {formatDate(wishlist.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classroom Wishlist */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Classroom Wishlist</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-gray-600">High Priority</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Fulfilled</span>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="space-y-4">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <Card key={item.id} className={`border border-gray-200 shadow-sm ${item.is_fulfilled ? 'bg-green-50' : 'bg-white'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Package Icon */}
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        
                        <div className="flex-1">
                          {/* Item Name and Priority Badge */}
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            <Badge 
                              className={
                                item.priority === 'high' 
                                  ? 'bg-orange-100 text-orange-700 border-orange-200' 
                                  : 'bg-blue-100 text-blue-700 border-blue-200'
                              }
                            >
                              {item.priority === 'high' ? 'High Priority' : 'Standard Priority'}
                            </Badge>
                          </div>
                          
                          {item.description && (
                            <p className="text-gray-600 mb-2">{item.description}</p>
                          )}
                          
                          {/* Quantity */}
                          <div className="flex items-center text-sm text-gray-600">
                            <Package className="h-4 w-4 mr-1" />
                            <span>Quantity Needed: <strong>{item.quantity}</strong></span>
                            {item.estimated_cost && (
                              <span className="ml-4">💰 Est. Cost: <strong>{item.estimated_cost}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex space-x-3">
                        {item.is_fulfilled ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Fulfilled ✓
                          </Badge>
                        ) : userRole?.isTeacher ? (
                          // Teachers see a sharing message instead of pledge button
                          <div className="text-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">
                              Share this wishlist with potential donors in your community
                            </p>
                          </div>
                        ) : (
                          // Non-teachers and non-authenticated users see pledge button
                          <Button 
                            className="bg-primary hover:bg-blue-700 text-white"
                            onClick={() => handlePledgeClick(item, `${user?.first_name} ${user?.last_name}`)}
                            disabled={roleLoading}
                          >
                            {roleLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <Heart className="mr-2 h-4 w-4" />
                                Pledge to Donate
                              </>
                            )}
                          </Button>
                        )}
                        
                        {!item.is_fulfilled && item.purchase_link && (
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Online
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Yet</h3>
                  <p className="text-gray-600">
                    This teacher hasn't added any items to their wishlist yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Donor Auth Modal */}
      <DonorAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        itemName={selectedItem?.name}
        teacherName={selectedItem?.teacherName}
        returnUrl={`/wishlist/${shareToken}`}
      />

      {/* Pledge Modal */}
      <PledgeModal
        isOpen={showPledgeModal}
        onClose={() => setShowPledgeModal(false)}
        item={selectedItem}
        teacher={{
          users: {
            first_name: user?.first_name || '',
            last_name: user?.last_name || ''
          },
          school: teacher?.school || '',
          grade: teacher?.grade || ''
        }}
      />
    </div>
  );
} 