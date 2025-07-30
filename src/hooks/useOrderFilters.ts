import { Order, User } from '@/types';

export const useOrderFilters = (orders: Order[], currentUser: User | null, activeTab: string) => {
  if (!currentUser) return [];

  switch (activeTab) {
    case 'active-orders':
      if (currentUser.role === 'site_foreman') {
        return orders.filter(order => 
          order.requestedBy.id === currentUser.id && 
          !['delivered', 'foreman_confirmed'].includes(order.status)
        );
      }
      return orders.filter(order => !['delivered', 'foreman_confirmed'].includes(order.status));
    
    case 'completed-orders':
      return orders.filter(order => ['delivered', 'foreman_confirmed'].includes(order.status));
    
    case 'shop-queue':
      return orders.filter(order => ['pending', 'in_shop', 'being_pulled', 'ready_to_load'].includes(order.status));
    
    case 'my-deliveries':
      return orders.filter(order => 
        order.assignedTo?.id === currentUser.id && 
        ['loaded', 'out_for_delivery'].includes(order.status)
      );
    
    case 'my-tasks':
      return orders.filter(order => ['in_shop', 'being_pulled'].includes(order.status));
    
    default:
      return orders;
  }
};