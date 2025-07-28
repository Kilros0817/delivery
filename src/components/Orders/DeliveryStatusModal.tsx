import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, MessageSquare } from 'lucide-react';

interface DeliveryStatusModalProps {
  orderNumber: string;
  userRole?: string;
  onStatusUpdate: (status: 'delivered_full' | 'delivered_partial' | 'not_delivered', notes?: string) => void;
  onClose: () => void;
}

export const DeliveryStatusModal: React.FC<DeliveryStatusModalProps> = ({
  orderNumber,
  userRole,
  onStatusUpdate,
  onClose
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'delivered_full' | 'delivered_partial' | 'not_delivered' | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (selectedStatus) {
      onStatusUpdate(selectedStatus, notes);
      onClose();
    }
  };

  const statusOptions = [
    {
      id: 'delivered_full' as const,
      label: userRole === 'truck_driver' ? 'Delivered in Full' : 'Delivered In Full',
      description: userRole === 'truck_driver' 
        ? 'All items delivered successfully' 
        : 'Confirm all items were received',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      selectedColor: 'bg-green-100 border-green-300'
    },
    {
      id: 'delivered_partial' as const,
      label: userRole === 'truck_driver' ? 'Delivered but Missing Items' : 'Missing Order',
      description: userRole === 'truck_driver' 
        ? 'Some items were not delivered' 
        : 'Some items are missing from delivery',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200',
      selectedColor: 'bg-orange-100 border-orange-300'
    },
    {
      id: 'not_delivered' as const,
      label: userRole === 'truck_driver' ? 'Not Delivered' : 'Did Not Receive',
      description: userRole === 'truck_driver' 
        ? 'Delivery was not completed' 
        : 'Order was not received at job site',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      selectedColor: 'bg-red-100 border-red-300'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {userRole === 'truck_driver' ? 'Update Delivery Status' : 'Confirm Delivery Status'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Order: {orderNumber}</p>
        </div>

        <div className="p-6 space-y-4">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedStatus === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => setSelectedStatus(option.id)}
                className={`w-full text-left p-4 border rounded-lg transition-colors ${
                  isSelected ? option.selectedColor : option.bgColor
                } hover:${option.selectedColor}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${option.color}`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {selectedStatus && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                Notes {selectedStatus !== 'delivered_full' && '(Required)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  selectedStatus === 'delivered_partial' 
                    ? userRole === 'truck_driver' 
                      ? 'Please specify which items are missing...'
                      : 'Please specify which items were not received...'
                    : selectedStatus === 'not_delivered'
                    ? userRole === 'truck_driver'
                      ? 'Please explain why delivery was not completed...'
                      : 'Please explain why the order was not received...'
                    : 'Any additional notes...'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required={selectedStatus !== 'delivered_full'}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedStatus || (selectedStatus !== 'delivered_full' && !notes.trim())}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};