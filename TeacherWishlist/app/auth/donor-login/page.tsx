"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DonorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Verify this is a donor account
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        if (userData.role !== 'donor') {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "This account is not registered as a donor. Please use the teacher login or create a donor account.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome Back!",
          description: "Successfully signed in to your donor account.",
        });

        // Check if there's a pledge intent saved
        const pledgeIntent = localStorage.getItem('pledge_intent');
        if (pledgeIntent) {
          const intent = JSON.parse(pledgeIntent);
          localStorage.removeItem('pledge_intent');
          router.push(intent.returnUrl || '/browse');
        } else {
          router.push('/donor/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/browse" 
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back, Donor
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to continue supporting teachers and students
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your password"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-primary hover:text-blue-700"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Signup Link */}
            <div className="text-center mt-6 pt-6 border-t">
              <p className="text-gray-600">
                Don't have a donor account?{" "}
                <Link 
                  href="/auth/donor-signup" 
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Create One
                </Link>
              </p>
            </div>

            {/* Teacher Login Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Are you a teacher?{" "}
                <Link 
                  href="/auth/login" 
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Teacher Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 