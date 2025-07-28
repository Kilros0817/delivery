import React from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Truck,
  Users,
  DollarSign
} from 'lucide-react';
import { Order, User } from '../../types';

interface DashboardProps {
  orders: Order[];
  currentUser: User;
  onCreateOrder?: () => void;
  onViewPendingOrders?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  orders, 
  currentUser, 
  onCreateOrder, 
  onViewPendingOrders 
}) => {
  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const inProgress = orders.filter(o => ['in_shop', 'being_pulled', 'ready_to_load', 'loaded', 'out_for_delivery'].includes(o.status)).length;
    const delivered = orders.filter(o => ['delivered', 'foreman_confirmed'].includes(o.status)).length;
    const backOrdered = orders.filter(o => o.status === 'back_ordered').length;
    
    return { total, pending, inProgress, delivered, backOrdered };
  };

  const getTotalValue = () => {
    return orders.reduce((sum, order) => {
      return sum + order.materials.reduce((orderSum, material) => 
        orderSum + (material.quantityRequested * material.unitPrice), 0
      );
    }, 0);
  };

  const getRecentOrders = () => {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getMyOrders = () => {
    return orders.filter(order => {
      if (currentUser.role === 'site_foreman' || currentUser.role === 'job_lead') {
        return order.requestedBy.id === currentUser.id;
      }
      if (currentUser.role === 'truck_driver') {
        return order.assignedTo?.id === currentUser.id;
      }
      return true;
    });
  };

  const stats = getOrderStats();
  const totalValue = getTotalValue();
  const recentOrders = getRecentOrders();
  const myOrders = getMyOrders();

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-blue-600 bg-blue-100',
      in_shop: 'text-purple-600 bg-purple-100',
      being_pulled: 'text-orange-600 bg-orange-100',
      loaded: 'text-indigo-600 bg-indigo-100',
      out_for_delivery: 'text-cyan-600 bg-cyan-100',
      delivered: 'text-green-600 bg-green-100',
      back_ordered: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-blue-100">
          {currentUser.role === 'site_foreman' || currentUser.role === 'job_lead' 
            ? 'Track your material orders and create new requests.'
            : currentUser.role === 'project_manager'
            ? 'Manage project orders and approvals.'
            : currentUser.role === 'shop_manager' || currentUser.role === 'assistant_shop_manager'
            ? 'Oversee shop operations and material fulfillment.'
            : currentUser.role === 'shop_employee'
            ? 'View your assigned tasks and update order status.'
            : currentUser.role === 'truck_driver'
            ? 'Check your delivery schedule and update delivery status.'
            : 'Monitor order costs and financial metrics.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats for Managers */}
      {(currentUser.role === 'project_manager' || 
        currentUser.role === 'shop_manager' || 
        currentUser.role === 'accountant_manager') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Back Ordered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.backOrdered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.projectName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Orders / Assigned Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentUser.role === 'truck_driver' ? 'My Deliveries' : 
               currentUser.role === 'shop_employee' ? 'My Tasks' : 'My Orders'}
            </h2>
          </div>
          <div className="p-6">
            {myOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {currentUser.role === 'truck_driver' ? 'No deliveries assigned' :
                 currentUser.role === 'shop_employee' ? 'No tasks assigned' : 'No orders found'}
              </p>
            ) : (
              <div className="space-y-4">
                {myOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.projectName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {(currentUser.role === 'site_foreman' || currentUser.role === 'job_lead') && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onCreateOrder}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Package className="h-4 w-4 mr-2" />
              Create New Order
            </button>
            <button 
              onClick={onViewPendingOrders}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Clock className="h-4 w-4 mr-2" />
              View My Orders
            </button>
          </div>
        </div>
      )}
      
      {/* Quick Actions for Project Managers */}
      {currentUser.role === 'project_manager' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onCreateOrder}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Package className="h-4 w-4 mr-2" />
              Create New Order
            </button>
            <button 
              onClick={onViewPendingOrders}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      )}
      
      {/* Quick Actions for Shop Managers */}
      {(currentUser.role === 'shop_manager' || currentUser.role === 'assistant_shop_manager') && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onViewPendingOrders && onViewPendingOrders()}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Package className="h-4 w-4 mr-2" />
              View Shop Queue
            </button>
            <button 
              onClick={() => onViewPendingOrders && onViewPendingOrders()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Truck className="h-4 w-4 mr-2" />
              Manage Deliveries
            </button>
          </div>
        </div>
      )}
      
      {/* Quick Actions for Truck Drivers */}
      {currentUser.role === 'truck_driver' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onViewPendingOrders && onViewPendingOrders()}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              <Truck className="h-4 w-4 mr-2" />
              View My Deliveries
            </button>
          </div>
        </div>
      )}
      
      {/* Quick Actions for Accountant Manager */}
      {currentUser.role === 'accountant_manager' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onViewPendingOrders && onViewPendingOrders()}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              View Cost Analysis
            </button>
            <button 
              onClick={() => onViewPendingOrders && onViewPendingOrders()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};