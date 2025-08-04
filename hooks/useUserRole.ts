import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useUserRole() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          user: null,
          profile: null,
          isTeacher: false,
          isDonor: false,
          isAdmin: false,
          isAuthenticated: false,
        };
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('role, first_name, last_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return {
          user,
          profile: null,
          isTeacher: false,
          isDonor: false,
          isAdmin: false,
          isAuthenticated: true,
        };
      }

      return {
        user,
        profile,
        isTeacher: profile.role === 'teacher',
        isDonor: profile.role === 'donor',
        isAdmin: profile.role === 'admin',
        isAuthenticated: true,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
} 