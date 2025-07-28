import React from 'react';
import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  AlertTriangle, 
  DollarSign,
  Edit3,
  Eye
} from 'lucide-react';
import { Order, OrderStatus, User, UserRole } from '@/types';
import { MaterialStatusManager } from '@/components/Orders/MaterialStatusManager';
import { DeliveryStatusModal } from '@/components/Orders/DeliveryStatusModal';
import { BillToJobModal } from '@/components/Orders/BillToJobModal';
import { FutureDeliveryModal } from '@/components/Orders/FutureDeliveryModal';

interface RoleBasedOrderActionsProps {
  order: Order;
  currentUser: User;
  onStatusUpdate: (orderId: string, status: OrderStatus, notes?: string) => void;
  onEditOrder?: (order: Order) => void;
}

export const RoleBasedOrderActions: React.FC<RoleBasedOrderActionsProps> = ({
  order,
  currentUser,
  onStatusUpdate,
  onEditOrder
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMaterialManager, setShowMaterialManager] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showBillToJobModal, setShowBillToJobModal] = useState(false);
  const [showFutureDeliveryModal, setShowFutureDeliveryModal] = useState(false);

  const getAvailableActions = (userRole: UserRole, orderStatus: OrderStatus) => {
    const actions: Array<{
      id: string;
      label: string;
      icon: React.ComponentType<any>;
      status?: OrderStatus;
      color: string;
      description: string;
    }> = [];

    switch (userRole) {
      case 'site_foreman':
      case 'job_lead':
        if (orderStatus === 'pending' || orderStatus === 'in_shop' || orderStatus === 'being_pulled') {
          actions.push({
            id: 'edit',
            label: orderStatus === 'pending' ? 'Edit Order' : 'Update Order',
            icon: Edit3,
            color: 'bg-blue-600 hover:bg-blue-700',
            description: orderStatus === 'pending' 
              ? 'Modify order details before processing'
              : 'Add materials or increase quantities'
          });
        }
        actions.push({
          id: 'view',
          label: 'View Details',
          icon: Eye,
          color: 'bg-gray-600 hover:bg-gray-700',
          description: 'View order progress and details'
        });
        break;

      case 'project_manager':
        if (orderStatus === 'pending') {
          if (orderStatus !== 'delivered' && orderStatus !== 'cancelled') {
            actions.push({
              id: 'edit',
              label: 'Modify Order',
              icon: Edit3,
              color: 'bg-blue-600 hover:bg-blue-700',
              description: 'Change item style or manufacturer'
            });
          }
        }
        break;

      case 'shop_manager':
        if (orderStatus === 'approved') {
          actions.push({
            id: 'in_shop',
            label: 'Move to Shop',
            icon: Package,
            status: 'in_shop',
            color: 'bg-purple-600 hover:bg-purple-700',
            description: 'Materials received in shop'
          });
        }
        if (orderStatus === 'in_shop' || orderStatus === 'being_pulled') {
          actions.push({
            id: 'back_order',
            label: 'Back Order',
            icon: AlertTriangle,
            status: 'back_ordered',
            color: 'bg-orange-600 hover:bg-orange-700',
            description: 'Mark items as back ordered'
          });
        }
        if (orderStatus === 'loaded') {
          actions.push({
            id: 'assign_driver',
            label: 'Assign Driver',
            icon: Truck,
            color: 'bg-indigo-600 hover:bg-indigo-700',
            description: 'Assign truck driver for delivery'
          });
        }
        break;

      case 'assistant_shop_manager':
        if (orderStatus === 'back_ordered') {
          actions.push({
            id: 'resolve_backorder',
            label: 'Resolve Back Order',
            icon: CheckCircle,
            status: 'in_shop',
            color: 'bg-green-600 hover:bg-green-700',
            description: 'Mark back ordered items as available'
          });
        }
        if (orderStatus === 'in_shop') {
          actions.push({
            id: 'being_pulled',
            label: 'Start Pulling',
            icon: Package,
            status: 'being_pulled',
            color: 'bg-purple-600 hover:bg-purple-700',
            description: 'Begin pulling materials'
          });
        }
        break;

      case 'shop_employee':
        if (orderStatus === 'being_pulled') {
          actions.push({
            id: 'ready_to_load',
            label: 'Ready To Load on Truck',
            icon: Package,
            status: 'ready_to_load',
            color: 'bg-blue-600 hover:bg-blue-700',
            description: 'Materials are ready to be loaded on truck'
          });
        }
        // Can only update availability status
        actions.push({
          id: 'update_material_status',
          label: 'Update Availability',
          icon: AlertTriangle,
          color: 'bg-yellow-600 hover:bg-yellow-700',
          description: 'Mark items as available or back ordered'
        });
        break;

      case 'truck_driver':
        if (orderStatus === 'ready_to_load') {
          actions.push({
            id: 'confirm_on_truck',
            label: 'Confirm On Truck',
            icon: Truck,
            status: 'loaded',
            color: 'bg-blue-600 hover:bg-blue-700',
            description: 'Confirm items are loaded on truck'
          });
        }
        if (orderStatus === 'loaded' && order.assignedTo?.id === currentUser.id) {
          actions.push({
            id: 'out_for_delivery',
            label: 'Out for Delivery',
            icon: Truck,
            status: 'out_for_delivery',
            color: 'bg-cyan-600 hover:bg-cyan-700',
            description: 'Start delivery to job site'
          });
        }
        if (orderStatus === 'out_for_delivery' && order.assignedTo?.id === currentUser.id) {
          actions.push({
            id: 'delivered',
            label: 'Mark Delivered',
            icon: CheckCircle,
            status: 'delivered',
            color: 'bg-green-600 hover:bg-green-700',
            description: 'Confirm delivery to job site'
          });
        }
        break;

      case 'accountant_manager':
        if (orderStatus === 'foreman_confirmed') {
          actions.push({
            id: 'bill_to_job',
            label: 'Bill to Job',
            icon: DollarSign,
            color: 'bg-green-600 hover:bg-green-700',
            description: 'Confirm billing to job site'
          });
        }
        actions.push({
          id: 'view_costs',
          label: 'View Costs',
          icon: DollarSign,
          color: 'bg-gray-600 hover:bg-gray-700',
          description: 'View detailed cost breakdown'
        });
        break;

      case 'site_foreman':
      case 'job_lead':
        if (orderStatus === 'out_for_delivery') {
          actions.push({
            id: 'update_delivery_status',
            label: 'Update Delivery',
            icon: CheckCircle,
            color: 'bg-green-600 hover:bg-green-700',
            description: 'Confirm delivery status'
          });
        }
        if (orderStatus === 'delivered') {
          actions.push({
            id: 'confirm_delivery_status',
            label: 'Confirm Delivery',
            icon: CheckCircle,
            color: 'bg-emerald-600 hover:bg-emerald-700',
            description: 'Confirm final delivery status'
          });
        }
        break;
    }

    return actions;
  };

  const handleAction = async (actionId: string, status?: OrderStatus) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (status) {
      onStatusUpdate(order.id, status);
    } else if (actionId === 'edit' && onEditOrder) {
      onEditOrder(order);
    } else if (actionId === 'update_material_status') {
      setShowMaterialManager(true);
    } else if (actionId === 'update_delivery_status') {
      setShowDeliveryModal(true);
    } else if (actionId === 'confirm_delivery_status') {
      setShowDeliveryModal(true);
    } else if (actionId === 'bill_to_job') {
      setShowBillToJobModal(true);
    } else {
      // Handle other custom actions
      console.log(`Action ${actionId} triggered for order ${order.id}`);
    }
    
    setIsUpdating(false);
  };

  const handleMaterialStatusUpdate = (materialId: string, status: 'available' | 'back_ordered') => {
    // In a real app, this would update the material status in the database
    console.log(`Material ${materialId} status updated to ${status}`);
    
    // Update order status based on material availability
    const hasBackOrderedItems = status === 'back_ordered';
    if (hasBackOrderedItems && order.status !== 'back_ordered') {
      onStatusUpdate(order.id, 'back_ordered', `Material marked as back ordered`);
    }
    
    setShowMaterialManager(false);
  };

  const handleDeliveryStatusUpdate = (status: 'delivered_full' | 'delivered_partial' | 'not_delivered', notes?: string) => {
    let orderStatus: OrderStatus;
    let statusNotes = notes || '';
    
    switch (status) {
      case 'delivered_full':
        orderStatus = currentUser.role === 'truck_driver' ? 'delivered' : 'foreman_confirmed';
        statusNotes = `Delivered in full. ${statusNotes}`.trim();
        break;
      case 'delivered_partial':
        orderStatus = currentUser.role === 'truck_driver' ? 'delivered' : 'foreman_confirmed';
        statusNotes = `Delivered with missing items. ${statusNotes}`.trim();
        break;
      case 'not_delivered':
        orderStatus = currentUser.role === 'truck_driver' ? 'out_for_delivery' : 'delivered';
        statusNotes = `Delivery not completed. ${statusNotes}`.trim();
        break;
    }
    
    onStatusUpdate(order.id, orderStatus, statusNotes);
    setShowDeliveryModal(false);
  };

  const handleBillToJob = (billingData: any) => {
    // In a real app, this would create billing records
    console.log('Billing confirmed:', billingData);
    onStatusUpdate(order.id, 'delivered', `Billed to job ${billingData.jobNumber} - Cost Center: ${billingData.costCenter}`);
    setShowBillToJobModal(false);
  };
  const actions = getAvailableActions(currentUser.role, order.status);
  const handleScheduleFutureDelivery = (deliveryData: any) => {
    // In a real app, this would create a future delivery schedule
    console.log('Future delivery scheduled:', deliveryData);
    onStatusUpdate(order.id, 'back_ordered', `Future delivery scheduled for ${deliveryData.deliveryDate} - Awaiting Site Foreman approval`);
    setShowFutureDeliveryModal(false);
  };


  if (actions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No actions available for your role</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Available Actions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id, action.status)}
                disabled={isUpdating}
                className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md transition-colors ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                title={action.description}
              >
                <Icon className="h-4 w-4 mr-2" />
                {isUpdating ? 'Processing...' : action.label}
              </button>
            );
          })}
        </div>
      </div>

      {showMaterialManager && (
        <MaterialStatusManager
          materials={order.materials}
          onUpdateMaterialStatus={handleMaterialStatusUpdate}
          onClose={() => setShowMaterialManager(false)}
        />
      )}

      {showDeliveryModal && (
        <DeliveryStatusModal
          orderNumber={order.orderNumber}
          userRole={currentUser.role}
          onStatusUpdate={handleDeliveryStatusUpdate}
          onClose={() => setShowDeliveryModal(false)}
        />
      )}

      {showBillToJobModal && (
        <BillToJobModal
          order={order}
          onConfirmBilling={handleBillToJob}
          onClose={() => setShowBillToJobModal(false)}
        />
      )}
    </>
  );
};