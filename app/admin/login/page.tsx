"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Shield, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@wishlistedbahamas.com");
  const [password, setPassword] = useState("admin123456");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if this is an admin account
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        if (userData.role !== 'admin') {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "This account is not an admin account.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome Admin!",
          description: "Successfully signed in to admin panel.",
        });

        router.push('/admin/verification');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-purple-600 text-4xl mr-2" />
            <GraduationCap className="text-primary text-4xl" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600">Access the teacher verification panel</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wishlistedbahamas.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign In as Admin
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              <strong>Test Admin Account:</strong><br />
              Email: admin@wishlistedbahamas.com<br />
              Password: admin123456
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 