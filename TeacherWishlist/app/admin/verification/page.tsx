"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  School, 
  MapPin,
  GraduationCap,
  Eye,
  EyeOff,
  MessageSquare
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";

interface PendingTeacher {
  id: number;
  user_id: string;
  grade: string;
  school: string;
  location: string;
  bio: string | null;
  is_verified: boolean;
  is_teacher_verified: boolean;
  created_at: string;
  users: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

export default function AdminVerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);
  const [showBankingInfo, setShowBankingInfo] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [teacherToAction, setTeacherToAction] = useState<PendingTeacher | null>(null);

  // Get current user to check if admin
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Get user profile to check role
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

  // Get pending teachers
  const { data: pendingTeachers, isLoading: teachersLoading } = useQuery({
    queryKey: ['pending-teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          )
        `)
        .eq('is_teacher_verified', false)
        .eq('is_verified', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PendingTeacher[];
    },
  });

  // Approve teacher mutation
  const approveMutation = useMutation({
    mutationFn: async ({ teacherId, comment }: { teacherId: number; comment: string }) => {
      const { error } = await supabase
        .from('teachers')
        .update({ 
          is_teacher_verified: true,
          verification_comment: comment || null
        })
        .eq('id', teacherId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Teacher Approved",
        description: "The teacher account has been approved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pending-teachers'] });
      setShowApprovalModal(false);
      setApprovalComment("");
      setTeacherToAction(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to approve teacher. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reject teacher mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ teacherId, comment }: { teacherId: number; comment: string }) => {
      // First, update the teacher with rejection comment before deleting
      const { error: updateError } = await supabase
        .from('teachers')
        .update({ 
          verification_comment: comment || null,
          is_teacher_verified: false
        })
        .eq('id', teacherId);
      
      if (updateError) throw updateError;
      
      // Then delete the teacher account
      const { error: deleteError } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId);
      
      if (deleteError) throw deleteError;
    },
    onSuccess: () => {
      toast({
        title: "Teacher Rejected",
        description: "The teacher account has been rejected and removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['pending-teachers'] });
      setShowRejectionModal(false);
      setRejectionComment("");
      setTeacherToAction(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reject teacher. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Helper functions for approval/rejection
  const handleApproveClick = (teacher: PendingTeacher) => {
    setTeacherToAction(teacher);
    setShowApprovalModal(true);
  };

  const handleRejectClick = (teacher: PendingTeacher) => {
    setTeacherToAction(teacher);
    setShowRejectionModal(true);
  };

  const handleApproveSubmit = () => {
    if (teacherToAction) {
      approveMutation.mutate({ 
        teacherId: teacherToAction.id, 
        comment: approvalComment 
      });
    }
  };

  const handleRejectSubmit = () => {
    if (teacherToAction) {
      rejectMutation.mutate({ 
        teacherId: teacherToAction.id, 
        comment: rejectionComment 
      });
    }
  };

  // Check if user is admin
  if (userProfile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-6 text-center">
              <XCircle className="text-red-500 text-6xl mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">
                You don't have permission to access the admin verification panel.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (userLoading || teachersLoading) {
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <GraduationCap className="text-primary text-3xl mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Teacher Verification Panel</h1>
          </div>
          <p className="text-gray-600">
            Review and approve pending teacher accounts. Ensure all teachers are legitimate educators.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {pendingTeachers?.length || 0}
                  </p>
                </div>
                <Clock className="text-orange-500 h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Teachers List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Pending Teachers</h2>
          
          {(!pendingTeachers || pendingTeachers.length === 0) ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Teachers</h3>
                <p className="text-gray-600">All teacher accounts have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <User className="mr-2 h-5 w-5 text-primary" />
                          {teacher.users.first_name} {teacher.users.last_name}
                        </CardTitle>
                        <div className="flex items-center mt-2">
                          <Mail className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{teacher.users.email}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <School className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <strong>School:</strong> {teacher.school}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <GraduationCap className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <strong>Grade:</strong> {teacher.grade}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <strong>Location:</strong> {teacher.location}
                        </span>
                      </div>
                      
                      {teacher.bio && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <strong>Bio:</strong> {teacher.bio}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => setSelectedTeacher(teacher)}
                          variant="outline"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                                                 <Button
                           size="sm"
                           onClick={() => handleApproveClick(teacher)}
                           disabled={approveMutation.isPending}
                           className="bg-green-600 hover:bg-green-700"
                         >
                           <CheckCircle className="mr-2 h-4 w-4" />
                           Approve
                         </Button>
                         <Button
                           size="sm"
                           variant="destructive"
                           onClick={() => handleRejectClick(teacher)}
                           disabled={rejectMutation.isPending}
                         >
                           <XCircle className="mr-2 h-4 w-4" />
                           Reject
                         </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Teacher Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTeacher(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">
                    {selectedTeacher.users.first_name} {selectedTeacher.users.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedTeacher.users.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">School</label>
                  <p className="text-sm text-gray-900">{selectedTeacher.school}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Grade</label>
                  <p className="text-sm text-gray-900">{selectedTeacher.grade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedTeacher.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Joined</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedTeacher.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {selectedTeacher.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedTeacher.bio}</p>
                </div>
              )}
              
                             <div className="flex gap-3 pt-4">
                 <Button
                   onClick={() => handleApproveClick(selectedTeacher)}
                   disabled={approveMutation.isPending}
                   className="bg-green-600 hover:bg-green-700"
                 >
                   <CheckCircle className="mr-2 h-4 w-4" />
                   Approve Teacher
                 </Button>
                 <Button
                   variant="destructive"
                   onClick={() => handleRejectClick(selectedTeacher)}
                   disabled={rejectMutation.isPending}
                 >
                   <XCircle className="mr-2 h-4 w-4" />
                   Reject Teacher
                 </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTeacher(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
                 </div>
       )}

       {/* Approval Modal */}
       {showApprovalModal && teacherToAction && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <Card className="w-full max-w-md">
             <CardHeader>
               <CardTitle className="flex items-center">
                 <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                 Approve Teacher
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <p className="text-sm text-gray-600">
                 You are about to approve <strong>{teacherToAction.users.first_name} {teacherToAction.users.last_name}</strong>.
               </p>
               <div>
                 <label className="text-sm font-medium text-gray-700">Approval Comment (Optional)</label>
                 <Textarea
                   value={approvalComment}
                   onChange={(e) => setApprovalComment(e.target.value)}
                   placeholder="Add a comment about this approval..."
                   rows={3}
                   className="mt-1"
                 />
               </div>
               <div className="flex gap-3 pt-4">
                 <Button
                   onClick={handleApproveSubmit}
                   disabled={approveMutation.isPending}
                   className="bg-green-600 hover:bg-green-700"
                 >
                   <CheckCircle className="mr-2 h-4 w-4" />
                   {approveMutation.isPending ? "Approving..." : "Approve Teacher"}
                 </Button>
                 <Button
                   variant="outline"
                   onClick={() => {
                     setShowApprovalModal(false);
                     setApprovalComment("");
                     setTeacherToAction(null);
                   }}
                 >
                   Cancel
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       )}

       {/* Rejection Modal */}
       {showRejectionModal && teacherToAction && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <Card className="w-full max-w-md">
             <CardHeader>
               <CardTitle className="flex items-center">
                 <XCircle className="mr-2 h-5 w-5 text-red-600" />
                 Reject Teacher
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <p className="text-sm text-gray-600">
                 You are about to reject <strong>{teacherToAction.users.first_name} {teacherToAction.users.last_name}</strong>.
                 This action cannot be undone.
               </p>
               <div>
                 <label className="text-sm font-medium text-gray-700">Rejection Reason (Required)</label>
                 <Textarea
                   value={rejectionComment}
                   onChange={(e) => setRejectionComment(e.target.value)}
                   placeholder="Please provide a reason for rejection..."
                   rows={3}
                   className="mt-1"
                   required
                 />
               </div>
               <div className="flex gap-3 pt-4">
                 <Button
                   onClick={handleRejectSubmit}
                   disabled={rejectMutation.isPending || !rejectionComment.trim()}
                   variant="destructive"
                 >
                   <XCircle className="mr-2 h-4 w-4" />
                   {rejectMutation.isPending ? "Rejecting..." : "Reject Teacher"}
                 </Button>
                 <Button
                   variant="outline"
                   onClick={() => {
                     setShowRejectionModal(false);
                     setRejectionComment("");
                     setTeacherToAction(null);
                   }}
                 >
                   Cancel
                 </Button>
               </div>
             </CardContent>
           </Card>
         </div>
       )}
     </div>
   );
 } 