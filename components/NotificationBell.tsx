"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Heart, 
  DollarSign, 
  CheckCircle,
  X,
  Clock
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationBellProps {
  teacherId: number;
}

export default function NotificationBell({ teacherId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['teacher-notifications', teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          pledges(
            amount,
            transaction_reference,
            wishlist_items(
              name,
              wishlists(title)
            )
          ),
          donors(
            users(first_name, last_name)
          )
        `)
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!teacherId,
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-notifications', teacherId] });
    },
  });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pledge_confirmed':
        return <Heart className="h-4 w-4 text-green-600" />;
      case 'pledge_completed':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'pledge_confirmed':
        return 'bg-green-50 border-green-200';
      case 'pledge_completed':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading notifications...
                </div>
              ) : notifications?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsReadMutation.mutate(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          {notification.pledges && (
                            <div className="mt-2 text-xs text-gray-500">
                              <span className="font-medium">
                                ${notification.pledges.amount}
                              </span>
                              {notification.pledges.wishlist_items && (
                                <span className="ml-2">
                                  for "{notification.pledges.wishlist_items.name}"
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center mt-2 text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(notification.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 