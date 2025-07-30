import React from 'react';
import { OrderCard } from '@/components/Orders/OrderCard';
import { Order, User } from '@/types';

interface OrdersPageProps {
  orders: Order[];
  currentUser: User;
  title: string;
  onOrderClick: (order: Order) => void;
  onCreateOrder?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  currentUser,
  title,
  onOrderClick,
  onCreateOrder
}) => {
  const canCreateOrder = (userRole: string) => {
    return ['site_foreman', 'job_lead', 'project_manager'].includes(userRole);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        {canCreateOrder(currentUser.role) && onCreateOrder && (
          <button
            onClick={onCreateOrder}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Order
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={onOrderClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};