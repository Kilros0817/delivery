import { useState } from 'react';
import { User } from '@/types';

export interface NotificationItem {
  id: string;
  type: 'status_update' | 'order_created' | 'back_ordered' | 'delivery_scheduled';
  orderId: string;
  orderNumber: string;
  message: string;
  timestamp: string;
  read: boolean;
  updatedBy?: User;
}

export const useNotifications = (initialNotifications: NotificationItem[] = []) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const addNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    unreadCount
  };
};