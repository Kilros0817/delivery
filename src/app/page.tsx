'use client';

import React, { useState } from 'react';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { DashboardPage } from '@/components/Pages/DashboardPage';
import { OrdersPage } from '@/components/Pages/OrdersPage';
import { MaterialsPage } from '@/components/Pages/MaterialsPage';
import { TruckDriversPage } from '@/components/Pages/TruckDriversPage';
import { OrderDetails } from '@/components/Orders/OrderDetails';
import { CreateOrderForm } from '@/components/Orders/CreateOrderForm';
import { NotificationCenter } from '@/components/Notifications/NotificationCenter';
import { SuccessNotification } from '@/components/Notifications/SuccessNotification';
import { useOrderFilters } from '@/hooks/useOrderFilters';
import { useNotifications, NotificationItem } from '@/hooks/useNotifications';
import { useUsers } from '@/hooks/useUsers';
import { useOrders } from '@/hooks/useOrders';
import { Order, OrderStatus, User, MaterialItem } from '@/types';

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'status_update',
    orderId: '1',
    orderNumber: 'ORD-2024-001',
    message: 'Order status updated to "In Shop" - Materials ready for pulling',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    updatedBy: undefined // Will be set after users load
  },
  {
    id: '2',
    type: 'back_ordered',
    orderId: '2',
    orderNumber: 'ORD-2024-002',
    message: 'Some items are back ordered - Expected restock Jan 20',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    updatedBy: undefined // Will be set after users load
  },
  {
    id: '3',
    type: 'status_update',
    orderId: '3',
    orderNumber: 'ORD-2024-003',
    message: 'Order delivered successfully to Brooklyn Bridge site',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    updatedBy: undefined // Will be set after users load
  }
];

export default function Home() {
  const { users, loading: usersLoading, error: usersError, getUserById } = useUsers();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const { 
    orders, 
    loading: ordersLoading, 
    error: ordersError, 
    refreshOrders,
    updateOrderStatus: updateOrderStatusHook,
    createOrder: createOrderHook,
    getOrderById 
  } = useOrders({
    userName: currentUser?.name,
    refreshInterval: 30000 // Auto-refresh every 30 seconds
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [successNotification, setSuccessNotification] = useState<{
    isVisible: boolean;
    message: string;
  }>({ isVisible: false, message: '' });

  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    markAllAsRead, 
    unreadCount 
  } = useNotifications(initialNotifications);

  const filteredOrders = useOrderFilters(orders, currentUser, activeTab);

  const showSuccessNotification = (message: string) => {
    setSuccessNotification({ isVisible: true, message });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    setSelectedOrder(null);
    setShowCreateOrder(false);
  };

  const handleUserSwitch = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    setSelectedOrder(null);
    setShowCreateOrder(false);
  };

  const handleStatusUpdate = (orderId: string, status: OrderStatus, notes?: string) => {
    if (!currentUser) return;

    const order = getOrderById(orderId);
    if (!order) return;

    // Use the hook's update method
    updateOrderStatusHook(orderId, status, notes, currentUser);
    
    addNotification({
      type: 'status_update',
      orderId,
      orderNumber: order.orderNumber,
      message: `Order status updated to "${status.replace('_', ' ').toUpperCase()}"${notes ? ` - ${notes}` : ''}`,
      updatedBy: currentUser
    });
    
    showSuccessNotification(`Order ${order.orderNumber} status updated to "${status.replace('_', ' ').toUpperCase()}"`);
  };

  const handleAddNote = (orderId: string, note: string) => {
    if (!currentUser) return;
    console.log(`Note added to order ${orderId}: ${note}`);
  };

  const handleAssignDriver = (orderId: string, driverId: string, driverName: string) => {
    if (!currentUser) return;

    const driverUser = getUserById(driverId);
    if (!driverUser) return;

    // Update order status and assign driver
    updateOrderStatusHook(orderId, 'loaded', `Assigned to driver: ${driverName}`, currentUser);
    
    const order = getOrderById(orderId);
    if (order) {
      addNotification({
        type: 'status_update',
        orderId,
        orderNumber: order.orderNumber,
        message: `Driver ${driverName} assigned to order - Status updated to "LOADED"`,
        updatedBy: currentUser
      });
      
      showSuccessNotification(`Driver ${driverName} assigned to order ${order.orderNumber}`);
    }
  };

  const handleCreateOrder = (orderData: any) => {
    if (!currentUser) return;

    const orderWithUser = {
      ...orderData,
      requestedBy: currentUser
    };

    createOrderHook(orderWithUser).then((newOrder) => {
      addNotification({
        type: 'order_created',
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        message: `New order created for ${newOrder.projectName}`,
        updatedBy: currentUser
      });
      
      showSuccessNotification(`Order ${newOrder.orderNumber} created successfully`);
    }).catch((error) => {
      console.error('Failed to create order:', error);
      // You could show an error notification here
    });
    
    setShowCreateOrder(false);
  };

  // Show loading screen while users or orders are loading
  if (usersLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {usersLoading ? 'Loading users...' : 'Loading orders...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error screen if users or orders failed to load
  if (usersError || ordersError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load {usersError ? 'Users' : 'Orders'}
          </h2>
          <p className="text-gray-600 mb-4">{usersError || ordersError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateOrder = (updatedOrderData: any) => {
    if (!currentUser || !editingOrder) return;

    // Update the order with new data
    updateOrderStatusHook(
      editingOrder.id, 
      editingOrder.status, 
      'Order updated - materials modified', 
      currentUser
    );
    
    setEditingOrder(null);
    
    addNotification({
      type: 'status_update',
      orderId: editingOrder.id,
      orderNumber: editingOrder.orderNumber,
      message: `Order updated - materials modified by ${currentUser.name}`,
      updatedBy: currentUser
    });
    
    showSuccessNotification(`Order ${editingOrder.orderNumber} updated successfully`);
  };

  const handleUpdateMaterial = (materialId: string, updates: Partial<MaterialItem>) => {
    console.log(`Material ${materialId} updated:`, updates);
    showSuccessNotification('Material updated successfully');
  };

  const handleNotificationClick = (orderId: string) => {
    const order = getOrderById(orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleViewPendingOrders = () => {
    if (!currentUser) return;
    
    if (currentUser.role === 'site_foreman') {
      setActiveTab('active-orders');
    } else if (currentUser.role === 'shop_manager') {
      setActiveTab('shop-queue');
    } else if (currentUser.role === 'truck_driver') {
      setActiveTab('my-deliveries');
    }
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'active-orders': return 'Active Orders';
      case 'completed-orders': return 'Completed Orders';
      case 'shop-queue': return 'Shop Queue';
      case 'my-deliveries': return 'My Deliveries';
      case 'my-tasks': return 'My Tasks';
      default: return 'All Orders';
    }
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            orders={orders}
            currentUser={currentUser}
            onCreateOrder={() => setShowCreateOrder(true)}
            onViewPendingOrders={handleViewPendingOrders}
            onStatusUpdate={handleStatusUpdate}
            onAddNote={handleAddNote}
            onAssignDriver={handleAssignDriver}
          />
        );

      case 'materials':
        return <MaterialsPage onUpdateMaterial={handleUpdateMaterial} />;

      case 'truck-drivers':
        return <TruckDriversPage />;

      case 'create-order':
        setShowCreateOrder(true);
        setActiveTab('active-orders');
        return null;

      default:
        return (
          <OrdersPage
            orders={filteredOrders}
            currentUser={currentUser}
            title={getPageTitle(activeTab)}
            onOrderClick={setSelectedOrder}
            onCreateOrder={() => setShowCreateOrder(true)}
          />
        );
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentUserRole={currentUser.role}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col">
        <Header
          currentUser={currentUser}
          users={users}
          notificationCount={unreadCount}
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          onUserSwitch={handleUserSwitch}
          onLogout={handleLogout}
        />
        
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={markAsRead}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          currentUser={currentUser}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={handleStatusUpdate}
          onAddNote={handleAddNote}
          onAssignDriver={handleAssignDriver}
          onEditOrder={setEditingOrder}
        />
      )}

      {showCreateOrder && (
        <CreateOrderForm
          currentUser={currentUser}
          onClose={() => setShowCreateOrder(false)}
          onSubmit={handleCreateOrder}
        />
      )}
      
      {editingOrder && (
        <CreateOrderForm
          currentUser={currentUser}
          onClose={() => setEditingOrder(null)}
          onSubmit={handleUpdateOrder}
          editingOrder={editingOrder}
          isEditing={true}
        />
      )}
      
      <SuccessNotification
        isVisible={successNotification.isVisible}
        message={successNotification.message}
        onClose={() => setSuccessNotification({ isVisible: false, message: '' })}
      />
    </div>
  );
}