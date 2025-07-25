"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Teacher, InsertTeacher } from "@/lib/supabase/schema";

interface TeacherProfileFormProps {
  teacher?: Teacher;
  onClose: () => void;
  isOpen: boolean;
}

export default function TeacherProfileForm({ teacher, onClose, isOpen }: TeacherProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    grade: teacher?.grade || "",
    school: teacher?.school || "",
    location: teacher?.location || "",
    bio: teacher?.bio || "",
    amazon_wishlist_url: teacher?.amazon_wishlist_url || "",
    bank_name: teacher?.bank_name || "",
    account_number: teacher?.account_number || "",
    account_holder_name: teacher?.account_holder_name || "",
    branch_location: teacher?.branch_location || "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const router = useRouter();

  // Fetch existing user data when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData, error } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      if (userData && !error) {
        setFormData(prev => ({
          ...prev,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
        }));
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, supabase]);

  const profileMutation = useMutation({
    mutationFn: async (data: Omit<InsertTeacher, 'user_id'> & { first_name: string; last_name: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Extract user data and teacher data
      const { first_name, last_name, ...teacherFields } = data;
      const teacherData: InsertTeacher = {
        ...teacherFields,
        user_id: user.id,
        is_verified: true, // Auto-verify teachers when they create their profile
      };

      // Update user's first and last name
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          first_name, 
          last_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Check if teacher profile already exists
      const { data: existingTeacher, error: checkError } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingTeacher || teacher) {
        // Update existing teacher
        const { error } = await supabase
          .from('teachers')
          .update(teacherFields)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new teacher
        const { error } = await supabase
          .from('teachers')
          .insert([teacherData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your teacher profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      onClose();
      
      // Redirect to dashboard after profile creation/update
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.grade || !formData.school || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (First Name, Last Name, Grade, School, Location).",
        variant: "destructive",
      });
      return;
    }

    // Basic banking validation - at least bank name if any banking info is provided
    const hasBankingInfo = formData.bank_name || formData.account_number || formData.account_holder_name || formData.branch_location;
    if (hasBankingInfo && !formData.bank_name) {
      toast({
        title: "Incomplete Banking Information",
        description: "Please provide at least the bank name for donation transfers.",
        variant: "destructive",
      });
      return;
    }

    profileMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {teacher ? "Edit Teacher Profile" : "Set Up Teacher Profile"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Teaching Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade">Grade Level *</Label>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => handleInputChange("grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Select 
                  value={formData.location} 
                  onValueChange={(value) => handleInputChange("location", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nassau">Nassau</SelectItem>
                    <SelectItem value="Freeport">Freeport</SelectItem>
                    <SelectItem value="Paradise Island">Paradise Island</SelectItem>
                    <SelectItem value="Eleuthera">Eleuthera</SelectItem>
                    <SelectItem value="Exuma">Exuma</SelectItem>
                    <SelectItem value="Andros">Andros</SelectItem>
                    <SelectItem value="Abaco">Abaco</SelectItem>
                    <SelectItem value="Bimini">Bimini</SelectItem>
                    <SelectItem value="Cat Island">Cat Island</SelectItem>
                    <SelectItem value="Long Island">Long Island</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="school">School Name *</Label>
              <Input
                id="school"
                type="text"
                required
                value={formData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
                placeholder="Enter your school name"
              />
            </div>

            <div>
              <Label htmlFor="bio">About You & Your Classroom</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell donors about yourself and your classroom. What subjects do you teach? What are your students like? What are your educational goals?"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be shown to potential donors to help them understand your needs.
              </p>
            </div>

            <div>
              <Label htmlFor="amazon_wishlist_url">Amazon Wishlist URL (Optional)</Label>
              <Input
                id="amazon_wishlist_url"
                type="url"
                value={formData.amazon_wishlist_url}
                onChange={(e) => handleInputChange("amazon_wishlist_url", e.target.value)}
                placeholder="https://www.amazon.com/hz/wishlist/ls/YOUR_WISHLIST_ID"
              />
              <p className="text-sm text-gray-500 mt-1">
                Share your Amazon wishlist so donors can purchase items directly. Make sure your wishlist is public and has your shipping address.
              </p>
            </div>

            {/* Banking Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Banking Information (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Provide your banking details to enable direct donations via bank transfer. This information will only be shared with donors after they pledge to support your classroom.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => handleInputChange("bank_name", e.target.value)}
                    placeholder="e.g., Commonwealth Bank"
                  />
                </div>
                
                <div>
                  <Label htmlFor="branch_location">Branch Location</Label>
                  <Input
                    id="branch_location"
                    type="text"
                    value={formData.branch_location}
                    onChange={(e) => handleInputChange("branch_location", e.target.value)}
                    placeholder="e.g., Shirley Street, Nassau"
                  />
                </div>
                
                <div>
                  <Label htmlFor="account_holder_name">Account Holder Name</Label>
                  <Input
                    id="account_holder_name"
                    type="text"
                    value={formData.account_holder_name}
                    onChange={(e) => handleInputChange("account_holder_name", e.target.value)}
                    placeholder="Full name as on account"
                  />
                </div>
                
                <div>
                  <Label htmlFor="account_number">Account Number</Label>
                  <Input
                    id="account_number"
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => handleInputChange("account_number", e.target.value)}
                    placeholder="Your account number"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <div className="flex items-start">
                  <div className="text-yellow-600 mr-2">⚠️</div>
                  <div className="text-sm text-yellow-800">
                    <strong>Privacy Notice:</strong> Your banking information will only be shown to donors after they commit to making a donation. It will never be publicly displayed.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 mr-2">ℹ️</div>
                <div className="text-sm text-blue-800">
                  <strong>Profile Verification:</strong> Your profile will be reviewed to ensure you are a legitimate educator. This helps maintain trust with our donor community.
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={profileMutation.isPending}
              >
                {profileMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {teacher ? "Update Profile" : "Create Profile"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 