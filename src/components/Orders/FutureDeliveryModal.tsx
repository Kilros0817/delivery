import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Package, AlertTriangle } from 'lucide-react';
import { Order } from '../../types';

interface FutureDeliveryModalProps {
  order: Order;
  onScheduleDelivery: (deliveryData: {
    deliveryDate: string;
    estimatedTime: string;
    specialInstructions?: string;
    backOrderedItems: string[];
  }) => void;
  onClose: () => void;
}

export const FutureDeliveryModal: React.FC<FutureDeliveryModalProps> = ({
  order,
  onScheduleDelivery,
  onClose
}) => {
  const [deliveryData, setDeliveryData] = useState({
    deliveryDate: '',
    estimatedTime: '08:00',
    specialInstructions: '',
    backOrderedItems: order.backOrderedItems || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleDelivery(deliveryData);
    onClose();
  };

  const backOrderedMaterials = order.materials.filter(material => 
    order.backOrderedItems?.includes(material.name)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Schedule Future Delivery - {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Set up delivery for back ordered items</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Back Ordered Items */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Back Ordered Items
            </h4>
            <div className="space-y-2">
              {backOrderedMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div>
                    <p className="font-medium text-gray-900">{material.name}</p>
                    <p className="text-sm text-gray-600">{material.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{material.quantityRequested} {material.unit}</p>
                    <p className="text-sm text-gray-500">${material.unitPrice.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Future Delivery Date *
              </label>
              <input
                type="date"
                required
                value={deliveryData.deliveryDate}
                onChange={(e) => setDeliveryData({ ...deliveryData, deliveryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Estimated Time
              </label>
              <select
                value={deliveryData.estimatedTime}
                onChange={(e) => setDeliveryData({ ...deliveryData, estimatedTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="06:00">6:00 AM</option>
                <option value="07:00">7:00 AM</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>
          </div>

          {/* Job Site Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Delivery Location
            </h4>
            <p className="text-sm text-gray-700">{order.jobSite}</p>
            <p className="text-sm text-gray-600 mt-1">Project: {order.projectName}</p>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Delivery Instructions
            </label>
            <textarea
              value={deliveryData.specialInstructions}
              onChange={(e) => setDeliveryData({ ...deliveryData, specialInstructions: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special instructions for the future delivery (access requirements, contact person, etc.)"
            />
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Important Notice</h4>
            <p className="text-sm text-blue-800">
              This future delivery will require approval from the Site Foreman before it can be processed. 
              The Site Foreman will be notified once the delivery is scheduled.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Schedule Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};