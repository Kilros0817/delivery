import React, { useState } from 'react';
import { DollarSign, FileText, Calendar, User } from 'lucide-react';
import { Order } from '../../types';

interface BillToJobModalProps {
  order: Order;
  onConfirmBilling: (billingData: {
    jobNumber: string;
    costCenter: string;
    approvedBy: string;
    billingDate: string;
    notes?: string;
  }) => void;
  onClose: () => void;
}

export const BillToJobModal: React.FC<BillToJobModalProps> = ({
  order,
  onConfirmBilling,
  onClose
}) => {
  const [billingData, setBillingData] = useState({
    jobNumber: '',
    costCenter: '',
    approvedBy: '',
    billingDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const totalValue = order.materials.reduce((sum, material) => 
    sum + (material.quantityRequested * material.unitPrice), 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBilling(billingData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-600" />
            Bill to Job - {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Confirm billing details for completed order</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Project:</span>
                <span className="ml-2 font-medium">{order.projectName}</span>
              </div>
              <div>
                <span className="text-gray-600">Job Site:</span>
                <span className="ml-2">{order.jobSite}</span>
              </div>
              <div>
                <span className="text-gray-600">Delivery Date:</span>
                <span className="ml-2">{new Date(order.deliveryDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Value:</span>
                <span className="ml-2 font-bold text-green-600">
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Job Number *
              </label>
              <input
                type="text"
                required
                value={billingData.jobNumber}
                onChange={(e) => setBillingData({ ...billingData, jobNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., JOB-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Center *
              </label>
              <input
                type="text"
                required
                value={billingData.costCenter}
                onChange={(e) => setBillingData({ ...billingData, costCenter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., CC-PLUMBING-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Approved By *
              </label>
              <input
                type="text"
                required
                value={billingData.approvedBy}
                onChange={(e) => setBillingData({ ...billingData, approvedBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Project Manager Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Billing Date *
              </label>
              <input
                type="date"
                required
                value={billingData.billingDate}
                onChange={(e) => setBillingData({ ...billingData, billingDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Materials Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Materials Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.materials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{material.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{material.quantityRequested} {material.unit}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${material.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        ${(material.quantityRequested * material.unitPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Notes
            </label>
            <textarea
              value={billingData.notes}
              onChange={(e) => setBillingData({ ...billingData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional billing notes or special instructions..."
            />
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
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Confirm Billing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};