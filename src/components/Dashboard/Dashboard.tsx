import React from 'react';
import { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Truck,
  Users,
  DollarSign,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { Order, User as UserType } from '@/types';
import { OrderDetails } from '@/components/Orders/OrderDetails';

interface DashboardProps {
  orders: Order[];
  currentUser: UserType;
  onCreateOrder?: () => void;
  onViewPendingOrders?: () => void;
  onStatusUpdate?: (orderId: string, status: any, notes?: string) => void;
  onAddNote?: (orderId: string, note: string) => void;
  onAssignDriver?: (orderId: string, driverId: string, driverName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  orders, 
  currentUser, 
  onCreateOrder, 
  onViewPendingOrders,
  onStatusUpdate,
  onAddNote,
  onAssignDriver
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        return order.assignedTo?.id === currentUser.id && 
               ['loaded', 'out_for_delivery'].includes(order.status);
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
            : currentUser.role === 'shop_manager'
            ? 'Oversee shop operations and material fulfillment.'
            : currentUser.role === 'truck_driver'
            ? 'Check your delivery schedule and update delivery status.'
            : 'Welcome to the inventory system.'
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
      {currentUser.role === 'shop_manager' && (
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
      {/* Orders List for Site Foreman */}
      {currentUser.role === 'site_foreman' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>
          </div>
          <div className="p-6">
            {myOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.projectName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium ${
                          order.priority === 'urgent' ? 'text-red-600' :
                          order.priority === 'high' ? 'text-orange-600' :
                          order.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {order.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {order.jobSite}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {order.materials.length} item{order.materials.length !== 1 ? 's' : ''}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${order.materials.reduce((sum, material) => 
                          sum + (material.quantityRequested * material.unitPrice), 0
                        ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    {order.backOrderedItems && order.backOrderedItems.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {order.backOrderedItems.length} item{order.backOrderedItems.length !== 1 ? 's' : ''} back ordered
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Orders List for Shop Manager */}
      {currentUser.role === 'shop_manager' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Orders</h2>
          </div>
          <div className="p-6">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.projectName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium ${
                          order.priority === 'urgent' ? 'text-red-600' :
                          order.priority === 'high' ? 'text-orange-600' :
                          order.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {order.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
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
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {order.materials.length} item{order.materials.length !== 1 ? 's' : ''}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${order.materials.reduce((sum, material) => 
                          sum + (material.quantityRequested * material.unitPrice), 0
                        ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    {order.backOrderedItems && order.backOrderedItems.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {order.backOrderedItems.length} item{order.backOrderedItems.length !== 1 ? 's' : ''} back ordered
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Orders and My Orders - Only show for truck drivers and other roles */}
      {currentUser.role === 'truck_driver' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>
          </div>
          <div className="p-6">
            {myOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders assigned</p>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.projectName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium ${
                          order.priority === 'urgent' ? 'text-red-600' :
                          order.priority === 'high' ? 'text-orange-600' :
                          order.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {order.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {order.jobSite}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {order.materials.length} item{order.materials.length !== 1 ? 's' : ''}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${order.materials.reduce((sum, material) => 
                          sum + (material.quantityRequested * material.unitPrice), 0
                        ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    {order.backOrderedItems && order.backOrderedItems.length > 0 && (
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {order.backOrderedItems.length} item{order.backOrderedItems.length !== 1 ? 's' : ''} back ordered
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      {currentUser.role === 'site_foreman' && (
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
          </div>
        </div>
      )}

      {currentUser.role === 'shop_manager' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onViewPendingOrders && onViewPendingOrders()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Truck className="h-4 w-4 mr-2" />
              Manage Truck Drivers
            </button>
          </div>
        </div>
      )}

      {currentUser.role === 'truck_driver' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onViewPendingOrders && onViewPendingOrders()}
              className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              <Truck className="h-4 w-4 mr-2" />
              View Active Orders
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal for Site Foreman, Shop Manager, and Truck Driver */}
      {selectedOrder && (currentUser.role === 'site_foreman' || currentUser.role === 'shop_manager' || currentUser.role === 'truck_driver') && (
        <OrderDetails
          order={selectedOrder}
          currentUser={currentUser}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={onStatusUpdate || (() => {})}
          onAddNote={onAddNote || (() => {})}
          onAssignDriver={onAssignDriver}
        />
      )}
    </div>
  );
};