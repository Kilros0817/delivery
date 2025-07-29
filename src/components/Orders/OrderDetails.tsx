import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  MapPin, 
  Package, 
  Truck, 
  AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus, User as UserType } from '@/types';
import { TruckDriverAssignment } from './TruckDriverAssignment';

interface OrderDetailsProps {
  order: Order;
  currentUser: UserType;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus, notes?: string) => void;
  onAddNote: (orderId: string, note: string) => void;
  onEditOrder?: (order: Order) => void;
  onAssignDriver?: (orderId: string, driverId: string, driverName: string) => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  order, 
  currentUser, 
  onClose, 
  onStatusUpdate,
  onAddNote,
  onEditOrder,
  onAssignDriver
}) => {
  const [statusNotes, setStatusNotes] = useState('');
  const [showDriverAssignment, setShowDriverAssignment] = useState(false);

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

  const getAvailableStatusUpdates = () => {
    const statusFlow: Record<OrderStatus, OrderStatus[]> = {
      pending: ['approved', 'cancelled'],
      pending: ['in_shop', 'cancelled'],
      in_shop: ['being_pulled', 'back_ordered'],
      being_pulled: ['ready_to_load'],
      ready_to_load: ['loaded'],
      loaded: ['out_for_delivery'],
      out_for_delivery: ['delivered'],
      delivered: ['foreman_confirmed'],
      foreman_confirmed: [],
      back_ordered: ['in_shop'],
      cancelled: []
    };

    return statusFlow[order.status] || [];
  };

  const canUpdateStatus = () => {
    const rolePermissions = {
      shop_manager: ['pending', 'in_shop', 'being_pulled', 'ready_to_load', 'loaded', 'back_ordered'],
      truck_driver: ['ready_to_load', 'loaded', 'out_for_delivery'],
      site_foreman: ['delivered'],
    };

    const allowedStatuses = rolePermissions[currentUser.role as keyof typeof rolePermissions] || [];
    return allowedStatuses.includes(order.status);
  };

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    onStatusUpdate(order.id, newStatus, statusNotes);
    setStatusNotes('');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(order.id, newNote);
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const handleAssignDriver = (driverId: string, driverName: string) => {
    if (onAssignDriver) {
      onAssignDriver(order.id, driverId, driverName);
    }
    setShowDriverAssignment(false);
  };

  const totalValue = order.materials.reduce((sum, material) => 
    sum + (material.quantityRequested * material.unitPrice), 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{order.orderNumber}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Project:</span>
                  <span className="ml-2 text-sm font-medium">{order.projectName}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Job Site:</span>
                  <span className="ml-2 text-sm">{order.jobSite}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Requested by:</span>
                  <span className="ml-2 text-sm">{order.requestedBy.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Delivery Date:</span>
                  <span className="ml-2 text-sm">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                </div>
                {order.assignedTo && (
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Assigned Driver:</span>
                    <span className="ml-2 text-sm">{order.assignedTo.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Priority</h3>
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`ml-3 text-sm font-medium ${
                    order.priority === 'urgent' ? 'text-red-600' :
                    order.priority === 'high' ? 'text-orange-600' :
                    order.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {order.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                {/* Assign Driver Button for Shop Manager */}
                {currentUser.role === 'shop_manager' && order.status === 'ready_to_load' && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowDriverAssignment(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Assign Truck Driver
                    </button>
                  </div>
                )}

                {canUpdateStatus() && getAvailableStatusUpdates().length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Update Status:</label>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableStatusUpdates().map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          {status.replace('_', ' ').toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      placeholder="Add notes for status update (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Materials</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.materials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500">{material.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {material.quantityRequested} {material.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${material.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(material.quantityRequested * material.unitPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.backOrderedItems?.includes(material.name) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Back Ordered
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Total Order Value:
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">
                      ${totalValue.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Special Notes */}
          {order.specialNotes && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Special Notes</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-sm text-gray-700">{order.specialNotes}</p>
              </div>
            </div>
          )}

          {/* Status History */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status History</h3>
            <div className="space-y-3">
              {order.statusHistory.map((update) => (
                <div key={update.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(update.status)}`}>
                        {update.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">by {update.updatedBy?.name ?? 'Unknown User'}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {update.notes && (
                      <p className="mt-1 text-sm text-gray-700">{update.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Truck Driver Assignment Modal */}
        {showDriverAssignment && (
          <TruckDriverAssignment
            order={order}
            onAssignDriver={handleAssignDriver}
            onClose={() => setShowDriverAssignment(false)}
          />
        )}
      </div>
    </div>
  );
};