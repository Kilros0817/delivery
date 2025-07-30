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
import { mockUsers, mockOrders } from '@/data/mockData';
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
    updatedBy: mockUsers[2]
  },
  {
    id: '2',
    type: 'back_ordered',
    orderId: '2',
    orderNumber: 'ORD-2024-002',
    message: 'Some items are back ordered - Expected restock Jan 20',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    updatedBy: mockUsers[2]
  },
  {
    id: '3',
    type: 'status_update',
    orderId: '3',
    orderNumber: 'ORD-2024-003',
    message: 'Order delivered successfully to Brooklyn Bridge site',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    updatedBy: mockUsers[5]
  }
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
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

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const newStatusUpdate = {
            id: Date.now().toString(),
            status,
            updatedBy: currentUser,
            timestamp: new Date().toISOString(),
            notes
          };
          
          return {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
            statusHistory: [...order.statusHistory, newStatusUpdate]
          };
        }
        return order;
      })
    );
    
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

    const driverUser = mockUsers.find(u => u.id === driverId);
    if (!driverUser) return;

    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const newStatusUpdate = {
            id: Date.now().toString(),
            status: 'loaded' as OrderStatus,
            updatedBy: currentUser,
            timestamp: new Date().toISOString(),
            notes: `Assigned to driver: ${driverName}`
          };
          
          return {
            ...order,
            assignedTo: driverUser,
            status: 'loaded' as OrderStatus,
            updatedAt: new Date().toISOString(),
            statusHistory: [...order.statusHistory, newStatusUpdate]
          };
        }
        return order;
      })
    );
    
    const order = orders.find(o => o.id === orderId);
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

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      ...orderData,
      status: 'pending' as OrderStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [{
        id: Date.now().toString(),
        status: 'pending' as OrderStatus,
        updatedBy: currentUser,
        timestamp: new Date().toISOString()
      }]
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setShowCreateOrder(false);
    
    addNotification({
      type: 'order_created',
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      message: `New order created for ${newOrder.projectName}`,
      updatedBy: currentUser
    });
    
    showSuccessNotification(`Order ${newOrder.orderNumber} created successfully`);
  };

  const handleUpdateOrder = (updatedOrderData: any) => {
    if (!currentUser || !editingOrder) return;

    const updatedOrder: Order = {
      ...editingOrder,
      ...updatedOrderData,
      updatedAt: new Date().toISOString(),
      statusHistory: [...editingOrder.statusHistory, {
        id: Date.now().toString(),
        status: editingOrder.status,
        updatedBy: currentUser,
        timestamp: new Date().toISOString(),
        notes: 'Order updated - materials modified'
      }]
    };

    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === editingOrder.id ? updatedOrder : order
      )
    );
    
    setEditingOrder(null);
    
    addNotification({
      type: 'status_update',
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      message: `Order updated - materials modified by ${currentUser.name}`,
      updatedBy: currentUser
    });
    
    showSuccessNotification(`Order ${updatedOrder.orderNumber} updated successfully`);
  };

  const handleUpdateMaterial = (materialId: string, updates: Partial<MaterialItem>) => {
    console.log(`Material ${materialId} updated:`, updates);
    showSuccessNotification('Material updated successfully');
  };

  const handleNotificationClick = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
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
    return <LoginScreen onLogin={handleLogin} />;
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