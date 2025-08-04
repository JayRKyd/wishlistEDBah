'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useState } from 'react'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey, signal }) => {
          const res = await fetch(queryKey[0] as string, {
            signal,
            credentials: 'include',
          });
          
          if (!res.ok) {
            if (res.status >= 500) {
              throw new Error(`Server error: ${res.status}`);
            }
            if (res.status === 404) {
              throw new Error(`Not found: ${res.status}`);
            }
            if (res.status === 401) {
              throw new Error(`401: Unauthorized`);
            }
            if (res.status >= 400) {
              const errorText = await res.text();
              throw new Error(`Client error: ${res.status} - ${errorText}`);
            }
          }

          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          }
          return res.text();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error) => {
          if (error.message.includes('401')) return false;
          return failureCount < 3;
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  )
} 