import { useState, useEffect } from 'react';
import { Order, OrderStatus, User } from '@/types';
import { mockOrders } from '@/data/mockData';

interface UseOrdersParams {
  userName?: string;
  userId?: string;
  status?: OrderStatus;
  refreshInterval?: number; // Auto-refresh interval in milliseconds
}

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string, updatedBy?: User) => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrdersByUser: (userId: string) => Order[];
}

export const useOrders = (params: UseOrdersParams = {}): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userName, userId, status, refreshInterval } = params;

  const fetchOrders = async (): Promise<Order[]> => {
    try {
      // TODO: Replace with actual API call
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (userName) queryParams.append('userName', userName);
      if (userId) queryParams.append('userId', userId);
      if (status) queryParams.append('status', status);

      // const response = await fetch(`/api/orders?${queryParams.toString()}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch orders: ${response.statusText}`);
      // }
      // return await response.json();
      
      // For now, simulate API call with mock data and filtering
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      let filteredOrders = [...mockOrders];
      
      // Apply client-side filtering (in real app, this would be done server-side)
      if (userName) {
        filteredOrders = filteredOrders.filter(order => 
          order.requestedBy.name.toLowerCase().includes(userName.toLowerCase()) ||
          order.assignedTo?.name.toLowerCase().includes(userName.toLowerCase())
        );
      }
      
      if (userId) {
        filteredOrders = filteredOrders.filter(order => 
          order.requestedBy.id === userId || order.assignedTo?.id === userId
        );
      }
      
      if (status) {
        filteredOrders = filteredOrders.filter(order => order.status === status);
      }
      
      return filteredOrders;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch orders');
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  const updateOrderStatus = async (
    orderId: string, 
    newStatus: OrderStatus, 
    notes?: string, 
    updatedBy?: User
  ) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orders/${orderId}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ status: newStatus, notes, updatedBy })
      // });
      // if (!response.ok) {
      //   throw new Error(`Failed to update order status: ${response.statusText}`);
      // }
      // const updatedOrder = await response.json();

      // For now, update locally
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            const newStatusUpdate = {
              id: Date.now().toString(),
              status: newStatus,
              updatedBy: updatedBy || order.requestedBy,
              timestamp: new Date().toISOString(),
              notes
            };
            
            return {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              statusHistory: [...order.statusHistory, newStatusUpdate]
            };
          }
          return order;
        })
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update order status');
    }
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(orderData)
      // });
      // if (!response.ok) {
      //   throw new Error(`Failed to create order: ${response.statusText}`);
      // }
      // const newOrder = await response.json();

      // For now, create locally
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
        status: 'pending' as OrderStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [{
          id: Date.now().toString(),
          status: 'pending' as OrderStatus,
          updatedBy: orderData.requestedBy!,
          timestamp: new Date().toISOString()
        }],
        ...orderData
      } as Order;

      setOrders(prevOrders => [newOrder, ...prevOrders]);
      return newOrder;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create order');
    }
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };

  const getOrdersByStatus = (status: OrderStatus): Order[] => {
    return orders.filter(order => order.status === status);
  };

  const getOrdersByUser = (userId: string): Order[] => {
    return orders.filter(order => 
      order.requestedBy.id === userId || order.assignedTo?.id === userId
    );
  };

  // Initial load
  useEffect(() => {
    loadOrders();
  }, [userName, userId, status]); // Reload when parameters change

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        refreshOrders();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return {
    orders,
    loading,
    error,
    refreshOrders,
    updateOrderStatus,
    createOrder,
    getOrderById,
    getOrdersByStatus,
    getOrdersByUser
  };
};