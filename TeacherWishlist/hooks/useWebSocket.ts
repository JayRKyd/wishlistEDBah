import { useEffect, useRef } from 'react';
import { queryClient } from '@/lib/queryClient';

interface WebSocketMessage {
  type: 'activity_update' | 'pledge_update' | 'wishlist_update';
  data: any;
}

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      try {
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            handleWebSocketMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        ws.current.onclose = () => {
          console.log('WebSocket disconnected');
          // Attempt to reconnect after 3 seconds
          setTimeout(connect, 3000);
        };

        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        // Attempt to reconnect after 5 seconds
        setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'activity_update':
        // Invalidate recent wishlists to show new activity
        queryClient.invalidateQueries({ queryKey: ['/api/wishlists/recent'] });
        queryClient.invalidateQueries({ queryKey: ['/api/wishlists/search'] });
        break;
        
      case 'pledge_update':
        // Invalidate specific wishlist and general queries
        queryClient.invalidateQueries({ queryKey: ['/api/wishlists'] });
        queryClient.invalidateQueries({ queryKey: ['/api/teacher/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/wishlists/recent'] });
        break;
        
      case 'wishlist_update':
        // Handle specific wishlist updates
        if (message.data.wishlistId) {
          queryClient.invalidateQueries({ 
            queryKey: ['/api/wishlists', message.data.wishlistId, 'items'] 
          });
        }
        queryClient.invalidateQueries({ queryKey: ['/api/teacher/wishlists'] });
        queryClient.invalidateQueries({ queryKey: ['/api/teacher/stats'] });
        queryClient.invalidateQueries({ queryKey: ['/api/wishlists/recent'] });
        break;
        
      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  };

  return {
    isConnected: ws.current?.readyState === WebSocket.OPEN,
  };
}
