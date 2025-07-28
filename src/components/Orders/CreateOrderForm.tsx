import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { MaterialItem, User } from '../../types';
import { mockMaterials } from '../../data/mockData';

interface CreateOrderFormProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  editingOrder?: Order;
  isEditing?: boolean;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ 
  currentUser, 
  onClose, 
  onSubmit,
  editingOrder,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    projectName: editingOrder?.projectName || '',
    jobSite: editingOrder?.jobSite || '',
    deliveryDate: editingOrder?.deliveryDate || '',
    priority: (editingOrder?.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
    specialNotes: editingOrder?.specialNotes || '',
  });

  const [selectedMaterials, setSelectedMaterials] = useState<MaterialItem[]>(
    editingOrder?.materials || []
  );
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMaterials.length === 0) {
      alert('Please add at least one material to the order.');
      return;
    }

    const orderData = {
      ...formData,
      materials: selectedMaterials,
      requestedBy: currentUser,
    };

    onSubmit(orderData);
  };

  const addMaterial = (material: MaterialItem) => {
    const existingIndex = selectedMaterials.findIndex(m => m.id === material.id);
    
    if (existingIndex >= 0) {
      const updated = [...selectedMaterials];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantityRequested: updated[existingIndex].quantityRequested + 1
      };
      setSelectedMaterials(updated);
    } else {
      setSelectedMaterials([...selectedMaterials, { ...material, quantityRequested: 1 }]);
    }
    
    setShowMaterialSelector(false);
  };

  const updateMaterialQuantity = (materialId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
    } else {
      setSelectedMaterials(selectedMaterials.map(m => 
        m.id === materialId ? { ...m, quantityRequested: quantity } : m
      ));
    }
  };

  const removeMaterial = (materialId: string) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
  };

  const totalValue = selectedMaterials.reduce((sum, material) => 
    sum + (material.quantityRequested * material.unitPrice), 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? `Edit Order - ${editingOrder?.orderNumber}` : 'Create New Order'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Site Address *
              </label>
              <input
                type="text"
                required
                value={formData.jobSite}
                onChange={(e) => setFormData({ ...formData, jobSite: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 123 Broadway, New York, NY 10001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Materials Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Materials</h3>
              <button
                type="button"
                onClick={() => setShowMaterialSelector(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </button>
            </div>

            {selectedMaterials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No materials added yet. Click "Add Material" to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedMaterials.map((material) => (
                      <tr key={material.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{material.name}</div>
                            <div className="text-sm text-gray-500">{material.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={material.quantityRequested}
                            onChange={(e) => updateMaterialQuantity(material.id, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span className="ml-2 text-sm text-gray-500">{material.unit}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${material.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(material.quantityRequested * material.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => removeMaterial(material.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
            )}
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Notes
            </label>
            <textarea
              value={formData.specialNotes}
              onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special delivery instructions or notes..."
            />
          </div>

          {/* Form Actions */}
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
              {isEditing ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>

        {/* Material Selector Modal */}
        {showMaterialSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Select Material</h3>
                <button
                  onClick={() => setShowMaterialSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {mockMaterials.map((material) => (
                    <div
                      key={material.id}
                      onClick={() => addMaterial(material)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{material.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-gray-500">
                              Available: {material.quantityAvailable} {material.unit}
                            </span>
                            <span className="text-sm text-gray-500">
                              Supplier: {material.supplier}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            ${material.unitPrice.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">per {material.unit}</div>
                          {material.quantityAvailable < 10 && (
                            <div className="flex items-center text-orange-600 text-sm mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low Stock
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};