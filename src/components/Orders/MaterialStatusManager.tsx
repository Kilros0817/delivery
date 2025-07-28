import React, { useState } from 'react';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { MaterialItem } from '@/types';

interface MaterialStatusManagerProps {
  materials: MaterialItem[];
  onUpdateMaterialStatus: (materialId: string, status: 'available' | 'back_ordered') => void;
  onClose: () => void;
}

export const MaterialStatusManager: React.FC<MaterialStatusManagerProps> = ({
  materials,
  onUpdateMaterialStatus,
  onClose
}) => {
  const [materialStatuses, setMaterialStatuses] = useState<Record<string, 'available' | 'back_ordered'>>(
    materials.reduce((acc, material) => ({
      ...acc,
      [material.id]: material.quantityAvailable > 0 ? 'available' : 'back_ordered'
    }), {})
  );

  const handleStatusChange = (materialId: string, status: 'available' | 'back_ordered') => {
    setMaterialStatuses(prev => ({
      ...prev,
      [materialId]: status
    }));
  };

  const handleSave = () => {
    Object.entries(materialStatuses).forEach(([materialId, status]) => {
      onUpdateMaterialStatus(materialId, status);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Update Material Availability</h3>
          <p className="text-sm text-gray-600 mt-1">Mark items as available or back ordered</p>
        </div>

        <div className="p-6 space-y-4">
          {materials.map((material) => (
            <div key={material.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{material.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Requested: {material.quantityRequested} {material.unit}
                  </p>
                </div>
                
                <div className="ml-4 space-y-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(material.id, 'available')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        materialStatuses[material.id] === 'available'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Available
                    </button>
                    <button
                      onClick={() => handleStatusChange(material.id, 'back_ordered')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        materialStatuses[material.id] === 'back_ordered'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Back Ordered
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};