'use client';

import React, { useState } from 'react';
import { LoginScreen } from '@/components/Auth/LoginScreen';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { OrderCard } from '@/components/Orders/OrderCard';
import { OrderDetails } from '@/components/Orders/OrderDetails';
import { CreateOrderForm } from '@/components/Orders/CreateOrderForm';
import { NotificationCenter } from '@/components/Notifications/NotificationCenter';
import { SuccessNotification } from '@/components/Notifications/SuccessNotification';
import { mockUsers, mockOrders } from '@/data/mockData';
import { Order, OrderStatus, User } from '@/types';

interface NotificationItem {
  id: string;
  type: 'status_update' | 'order_created' | 'back_ordered' | 'delivery_scheduled';
  orderId: string;
  orderNumber: string;
  message: string;
  timestamp: string;
  read: boolean;
  updatedBy?: User;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
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
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [successNotification, setSuccessNotification] = useState<{
    isVisible: boolean;
    message: string;
  }>({ isVisible: false, message: '' });

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
    
    // Add notification for status update
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'status_update',
      orderId,
      orderNumber: order.orderNumber,
      message: `Order status updated to "${status.replace('_', ' ').toUpperCase()}"${notes ? ` - ${notes}` : ''}`,
      timestamp: new Date().toISOString(),
      read: false,
      updatedBy: currentUser
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show success notification
    setSuccessNotification({
      isVisible: true,
      message: `Order ${order.orderNumber} status updated to "${status.replace('_', ' ').toUpperCase()}"`
    });
    
    // In a real app, this would trigger notifications to all stakeholders
    console.log(`Order ${orderId} status updated to ${status} by ${currentUser.name}`);
  };

  const handleAddNote = (orderId: string, note: string) => {
    if (!currentUser) return;
    // In a real app, this would add the note to the order and notify stakeholders
    console.log(`Note added to order ${orderId}: ${note}`);
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
    
    // Add notification for new order
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'order_created',
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      message: `New order created for ${newOrder.projectName}`,
      timestamp: new Date().toISOString(),
      read: false,
      updatedBy: currentUser
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show success notification
    setSuccessNotification({
      isVisible: true,
      message: `Order ${newOrder.orderNumber} created successfully`
    });
    
    // In a real app, this would notify all stakeholders
    console.log(`New order created: ${newOrder.orderNumber} by ${currentUser.name}`);
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
    
    // Add notification for order update
    const newNotification: NotificationItem = {
      id: Date.now().toString(),
      type: 'status_update',
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      message: `Order updated - materials modified by ${currentUser.name}`,
      timestamp: new Date().toISOString(),
      read: false,
      updatedBy: currentUser
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show success notification
    setSuccessNotification({
      isVisible: true,
      message: `Order ${updatedOrder.orderNumber} updated successfully`
    });
    
    console.log(`Order updated: ${updatedOrder.orderNumber} by ${currentUser.name}`);
  };

  const handleNotificationClick = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getFilteredOrders = () => {
    if (!currentUser) return [];

    switch (activeTab) {
      case 'shop-queue':
        return orders.filter(order => ['pending', 'in_shop', 'being_pulled', 'ready_to_load'].includes(order.status));
      case 'deliveries':
        return orders.filter(order => ['loaded', 'out_for_delivery'].includes(order.status));
      case 'my-deliveries':
        return orders.filter(order => 
          order.assignedTo?.id === currentUser.id && 
          ['loaded', 'out_for_delivery', 'delivered'].includes(order.status)
        );
      case 'my-tasks':
        return orders.filter(order => ['in_shop', 'being_pulled'].includes(order.status));
      default:
        return orders;
    }
  };

  const canCreateOrder = (userRole: string) => {
    return ['site_foreman', 'job_lead', 'project_manager'].includes(userRole);
  };

  const renderStakeholdersContent = () => {
    const stakeholders = [
      { 
        name: 'John Smith', 
        title: 'Site Foreman', 
        role: 'site_foreman', 
        email: 'john.smith@company.com', 
        phone: '(555) 123-4567',
        permissions: [
          'Access to Document',
          'See Progress',
          'Receive Notifications',
          'Adjust/Change as Needed'
        ],
        restrictions: ['NO ACCESS TO ACCOUNTING']
      },
      { 
        name: 'Emily Rodriguez', 
        title: 'Job Lead', 
        role: 'job_lead', 
        email: 'emily.rodriguez@company.com', 
        phone: '(555) 234-5678',
        permissions: [
          'Access to Document',
          'See Progress',
          'Receive Notifications',
          'Adjust/Change as Needed'
        ],
        restrictions: ['NO ACCESS TO ACCOUNTING']
      },
      { 
        name: 'Michael Chen', 
        title: 'Project Manager', 
        role: 'project_manager', 
        email: 'michael.chen@company.com', 
        phone: '(555) 345-6789',
        permissions: [
          'FULL ACCESS TO EVERYTHING',
          'Change Item Style or Manufacturer',
          'Receives All Notifications'
        ],
        restrictions: [],
        special: 'Notifications sent when item style/manufacturer changed'
      },
      { 
        name: 'Sarah Williams', 
        title: 'Shop Manager', 
        role: 'shop_manager', 
        email: 'sarah.williams@company.com', 
        phone: '(555) 456-7890',
        permissions: [
          'Limited Access to Document',
          'Receives All Notifications'
        ],
        restrictions: [
          'Cannot change Manufacturer or Item without Foreman Approval',
          'NO ACCESS TO ACCOUNTING'
        ]
      },
      { 
        name: 'David Thompson', 
        title: 'Assistant Shop Manager', 
        role: 'assistant_shop_manager', 
        email: 'david.thompson@company.com', 
        phone: '(555) 567-8901',
        permissions: [
          'Limited Access to Document'
        ],
        restrictions: [],
        special: 'ONLY PERSON WHO CAN HANDLE Back Ordered Items'
      },
      { 
        name: 'Lisa Johnson', 
        title: 'Shop Employee', 
        role: 'shop_employee', 
        email: 'lisa.johnson@company.com', 
        phone: '(555) 678-9012',
        permissions: [
          'Limited Access',
          'Note if item is "Available or Back Ordered"'
        ],
        restrictions: [
          'Cannot Change or Update any line items (except availability status)'
        ]
      },
      { 
        name: 'Robert Davis', 
        title: 'Truck Driver', 
        role: 'truck_driver', 
        email: 'robert.davis@company.com', 
        phone: '(555) 789-0123',
        permissions: [
          'View Document Only',
          'Acknowledge "On Truck" Line Item'
        ],
        restrictions: []
      },
      { 
        name: 'Jennifer Martinez', 
        title: 'Accountant Manager', 
        role: 'accountant_manager', 
        email: 'jennifer.martinez@company.com', 
        phone: '(555) 890-1234',
        permissions: [
          'Full Access to Whole Document'
        ],
        restrictions: [],
        special: 'Only person who can confirm "Billed to Job"'
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Project Stakeholders</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Team Members & Contact Information</h2>
            <p className="text-sm text-gray-600 mt-1">All stakeholders involved in the inventory workflow process</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {stakeholders.map((stakeholder, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {stakeholder.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{stakeholder.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{stakeholder.title}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{stakeholder.email}</p>
                    <p className="text-sm text-gray-500">{stakeholder.phone}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {stakeholder.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  
                  {/* Role-specific permissions */}
                  {stakeholder.role === 'site_foreman' || stakeholder.role === 'job_lead' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Can Create Orders
                    </span>
                  ) : null}
                  
                  {stakeholder.role === 'project_manager' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Can Approve Orders
                    </span>
                  ) : null}
                  
                  {stakeholder.role === 'shop_manager' || stakeholder.role === 'assistant_shop_manager' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Shop Operations
                    </span>
                  ) : null}
                  
                  {stakeholder.role === 'truck_driver' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Delivery Management
                    </span>
                  ) : null}
                  
                  {stakeholder.role === 'accountant_manager' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Financial Oversight
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Notification System</h3>
          <p className="text-blue-800 text-sm">
            All stakeholders are automatically notified when orders are created, modified, back-ordered, or when special notes are added. 
            This ensures seamless communication throughout the inventory workflow process.
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!currentUser) return null;

    if (activeTab === 'dashboard') {
      return (
        <Dashboard 
          orders={orders} 
          currentUser={currentUser}
          onCreateOrder={() => setShowCreateOrder(true)}
          onViewPendingOrders={() => {
            // Navigate to appropriate tab based on user role
            if (currentUser.role === 'site_foreman' || currentUser.role === 'job_lead') {
              setActiveTab('orders');
            } else if (currentUser.role === 'project_manager') {
              setActiveTab('analytics');
            } else if (currentUser.role === 'shop_manager' || currentUser.role === 'assistant_shop_manager') {
              setActiveTab('shop-queue');
            } else if (currentUser.role === 'truck_driver') {
              setActiveTab('my-deliveries');
            } else if (currentUser.role === 'accountant_manager') {
              setActiveTab('analytics');
            }
          }}
        />
      );
    }

    if (activeTab === 'stakeholders') {
      return renderStakeholdersContent();
    }

    if (activeTab === 'create-order') {
      setShowCreateOrder(true);
      setActiveTab('orders');
    }

    const filteredOrders = getFilteredOrders();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'shop-queue' ? 'Shop Queue' :
             activeTab === 'deliveries' ? 'Deliveries' :
             activeTab === 'my-deliveries' ? 'My Deliveries' :
             activeTab === 'my-tasks' ? 'My Tasks' :
             'All Orders'}
          </h1>
          
          {canCreateOrder(currentUser.role) && (
            <button
              onClick={() => setShowCreateOrder(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Order
            </button>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={setSelectedOrder}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Show login screen if no user is logged in
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
          onMarkAsRead={handleMarkAsRead}
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
          onEditOrder={setEditingOrder}
        />
      )}

      {showCreateOrder && canCreateOrder(currentUser.role) && (
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