"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Heart, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  Calendar,
  School,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/components/Navbar";
import BankingInfoModal from "@/components/BankingInfoModal";
import { useRouter } from "next/navigation";

export default function DonorDashboard() {
  const router = useRouter();
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const supabase = createClient();

  // Banking modal state
  const [showBankingModal, setShowBankingModal] = useState(false);
  const [selectedPledge, setSelectedPledge] = useState<any>(null);

  // Redirect non-donors (only after role is loaded)
  if (!roleLoading && userRole && !userRole.isDonor) {
    router.push('/browse');
    return null;
  }

  // Get donor profile and stats
  const { data: donorData, isLoading: donorLoading } = useQuery({
    queryKey: ['donor-profile'],
    queryFn: async () => {
      if (!userRole?.user) return null;
      
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', userRole.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userRole?.user,
  });

  // Get pledges with related data
  const { data: pledges, isLoading: pledgesLoading } = useQuery({
    queryKey: ['donor-pledges'],
    queryFn: async () => {
      if (!donorData) return [];

      const { data, error } = await supabase
        .from('pledges')
        .select(`
          *,
          wishlist_items(
            id,
            name,
            description,
            quantity,
            estimated_cost,
            wishlists(
              id,
              title,
              share_token,
              teachers(
                id,
                grade,
                school,
                location,
                bank_name,
                account_number,
                account_holder_name,
                branch_location,
                users(first_name, last_name)
              )
            )
          )
        `)
        .eq('donor_id', donorData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!donorData,
  });

  // Calculate stats
  const stats = pledges ? {
    totalPledged: donorData?.total_pledged || 0,
    totalDonated: donorData?.total_donated || 0,
    activePledges: pledges.filter(p => p.status === 'pending' || p.status === 'confirmed').length,
    teachersHelped: new Set(pledges.map(p => p.wishlist_items.wishlists.teachers.id)).size,
    completedPledges: pledges.filter(p => p.status === 'completed').length,
  } : null;

  const activePledges = pledges?.filter(p => p.status === 'pending' || p.status === 'confirmed') || [];
  const pledgeHistory = pledges?.filter(p => p.status === 'completed' || p.status === 'cancelled') || [];

  if (roleLoading || donorLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userRole?.profile?.first_name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Thank you for supporting Bahamian teachers and students. Here's your impact summary.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Pledged</p>
                    <p className="text-lg sm:text-2xl font-bold text-primary">${stats.totalPledged.toFixed(2)}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Donated</p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">${stats.totalDonated.toFixed(2)}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Active Pledges</p>
                    <p className="text-lg sm:text-2xl font-bold text-orange-600">{stats.activePledges}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Teachers Helped</p>
                    <p className="text-lg sm:text-2xl font-bold text-purple-600">{stats.teachersHelped}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Pledges */}
        {activePledges.length > 0 && (
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Gift className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Active Pledges
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-600 break-words">
                Pledges awaiting your payment or confirmation
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {activePledges.map((pledge) => {
                  const item = pledge.wishlist_items;
                  const teacher = item.wishlists.teachers;
                  const user = Array.isArray(teacher.users) ? teacher.users[0] : teacher.users;
                  
                  return (
                    <div key={pledge.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{item.name}</h3>
                            <Badge 
                              variant={pledge.status === 'pending' ? 'outline' : 'default'}
                              className={
                                pledge.status === 'pending' 
                                  ? 'border-orange-200 text-orange-700 bg-orange-50 text-xs'
                                  : 'border-green-200 text-green-700 bg-green-50 text-xs'
                              }
                            >
                              {pledge.status === 'pending' ? 'Pending Payment' : 'Confirmed'}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="break-words">{user?.first_name} {user?.last_name}</span>
                            </div>
                            <div className="flex items-center">
                              <School className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="break-words">{teacher.school}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                            <span className="text-gray-600">Amount: <strong>${pledge.amount}</strong></span>
                            <span className="text-gray-600">Quantity: <strong>{pledge.quantity}</strong></span>
                            <span className="text-gray-600 break-all">Ref: <strong>{pledge.transaction_reference}</strong></span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs sm:text-sm"
                            onClick={() => router.push(`/wishlist/${item.wishlists.share_token}`)}
                          >
                            <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">View Wishlist</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                          {pledge.status === 'pending' && (
                            <Button 
                              className="bg-primary hover:bg-blue-700 text-xs sm:text-sm"
                              size="sm"
                              onClick={() => {
                                setSelectedPledge(pledge);
                                setShowBankingModal(true);
                              }}
                            >
                              <CreditCard className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">Complete Payment</span>
                              <span className="sm:hidden">Pay</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pledge History */}
        {pledgeHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Donation History
              </CardTitle>
              <p className="text-sm text-gray-600">
                Your completed and cancelled pledges
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pledgeHistory.map((pledge) => {
                    const item = pledge.wishlist_items;
                    const teacher = item.wishlists.teachers;
                    const user = Array.isArray(teacher.users) ? teacher.users[0] : teacher.users;
                    
                    return (
                      <TableRow key={pledge.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{user?.first_name} {user?.last_name}</TableCell>
                        <TableCell>${pledge.amount}</TableCell>
                        <TableCell>
                          {new Date(pledge.completed_at || pledge.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={pledge.status === 'completed' ? 'default' : 'destructive'}
                            className={
                              pledge.status === 'completed'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-red-100 text-red-700 border-red-200'
                            }
                          >
                            {pledge.status === 'completed' ? (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Completed
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-1 h-3 w-3" />
                                Cancelled
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/wishlist/${item.wishlists.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!pledgesLoading && pledges?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Make Your First Donation?
              </h3>
              <p className="text-gray-600 mb-6">
                Browse teacher wishlists and find classroom supplies that need funding.
              </p>
              <Button asChild className="bg-primary hover:bg-blue-700">
                <Link href="/browse">
                  <Gift className="mr-2 h-4 w-4" />
                  Browse Wishlists
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Banking Info Modal */}
      {selectedPledge && (
        <BankingInfoModal
          isOpen={showBankingModal}
          onClose={() => {
            setShowBankingModal(false);
            setSelectedPledge(null);
          }}
          pledge={selectedPledge}
          teacher={{
            users: selectedPledge.wishlist_items.wishlists.teachers.users,
            school: selectedPledge.wishlist_items.wishlists.teachers.school,
            grade: selectedPledge.wishlist_items.wishlists.teachers.grade,
            bank_name: selectedPledge.wishlist_items.wishlists.teachers.bank_name,
            account_number: selectedPledge.wishlist_items.wishlists.teachers.account_number,
            account_holder_name: selectedPledge.wishlist_items.wishlists.teachers.account_holder_name,
            branch_location: selectedPledge.wishlist_items.wishlists.teachers.branch_location,
          }}
        />
      )}
    </div>
  );
} 