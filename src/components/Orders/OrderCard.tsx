import React from 'react';
import { 
  Calendar, 
  User, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Truck,
  Package
} from 'lucide-react';
import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_shop: 'bg-purple-100 text-purple-800 border-purple-200',
      being_pulled: 'bg-orange-100 text-orange-800 border-orange-200',
      ready_to_load: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      loaded: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      out_for_delivery: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      foreman_confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      back_ordered: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      in_shop: Package,
      being_pulled: Package,
      ready_to_load: Package,
      loaded: Package,
      out_for_delivery: Truck,
      delivered: CheckCircle,
      foreman_confirmed: CheckCircle,
      back_ordered: AlertTriangle,
      cancelled: AlertTriangle,
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const totalValue = order.materials.reduce((sum, material) => 
    sum + (material.quantityRequested * material.unitPrice), 0
  );

  return (
    <div 
      onClick={() => onClick(order)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
          <p className="text-sm text-gray-600">{order.projectName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1">{order.status.replace('_', ' ').toUpperCase()}</span>
          </span>
          <span className={`text-xs font-medium ${getPriorityColor(order.priority)}`}>
            {order.priority.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {order.jobSite}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <User className="h-4 w-4 mr-2" />
          Requested by {order.requestedBy.name}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {order.materials.length} item{order.materials.length !== 1 ? 's' : ''}
          </span>
          <span className="text-sm font-medium text-gray-900">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        {order.backOrderedItems && order.backOrderedItems.length > 0 && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {order.backOrderedItems.length} item{order.backOrderedItems.length !== 1 ? 's' : ''} back ordered
          </div>
        )}
        
        {/* Show if order was recently updated */}
        {order.statusHistory.length > 1 && 
         order.statusHistory[order.statusHistory.length - 1].notes?.includes('materials modified') && (
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <Package className="h-4 w-4 mr-1" />
            Recently updated
          </div>
        )}
      </div>
    </div>
  );
};