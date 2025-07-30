import { Order, User, OrderStatus } from '@/types';

interface FilterOptions {
  status?: OrderStatus[];
  userId?: string;
  assignedToId?: string;
  priority?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export const useOrderFilters = (
  orders: Order[], 
  currentUser: User | null, 
  activeTab: string,
  customFilters?: FilterOptions
) => {
  if (!currentUser) return [];

  let filteredOrders = [...orders];

  // Apply custom filters first
  if (customFilters) {
    if (customFilters.status && customFilters.status.length > 0) {
      filteredOrders = filteredOrders.filter(order => 
        customFilters.status!.includes(order.status)
      );
    }

    if (customFilters.userId) {
      filteredOrders = filteredOrders.filter(order => 
        order.requestedBy.id === customFilters.userId
      );
    }

    if (customFilters.assignedToId) {
      filteredOrders = filteredOrders.filter(order => 
        order.assignedTo?.id === customFilters.assignedToId
      );
    }

    if (customFilters.priority && customFilters.priority.length > 0) {
      filteredOrders = filteredOrders.filter(order => 
        customFilters.priority!.includes(order.priority)
      );
    }

    if (customFilters.dateRange) {
      const startDate = new Date(customFilters.dateRange.start);
      const endDate = new Date(customFilters.dateRange.end);
      filteredOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.deliveryDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
  }

  // Apply tab-based filters
  switch (activeTab) {
    case 'active-orders':
      if (currentUser.role === 'site_foreman') {
        return filteredOrders.filter(order => 
          order.requestedBy.id === currentUser.id && 
          !['delivered', 'foreman_confirmed'].includes(order.status)
        );
      }
      return filteredOrders.filter(order => !['delivered', 'foreman_confirmed'].includes(order.status));
    
    case 'completed-orders':
      return filteredOrders.filter(order => ['delivered', 'foreman_confirmed'].includes(order.status));
    
    case 'shop-queue':
      return filteredOrders.filter(order => ['pending', 'in_shop', 'being_pulled', 'ready_to_load'].includes(order.status));
    
    case 'my-deliveries':
      return filteredOrders.filter(order => 
        order.assignedTo?.id === currentUser.id && 
        ['loaded', 'out_for_delivery'].includes(order.status)
      );
    
    case 'my-tasks':
      return filteredOrders.filter(order => ['in_shop', 'being_pulled'].includes(order.status));
    
    default:
      return filteredOrders;
  }
};