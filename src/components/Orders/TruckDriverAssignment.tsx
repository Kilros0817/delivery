import React, { useState } from 'react';
import { X, Truck, User, Phone, CheckCircle } from 'lucide-react';
import { Order, User as UserType } from '@/types';
import { mockTruckDrivers } from '@/data/mockData';

interface TruckDriverAssignmentProps {
  order: Order;
  onAssignDriver: (driverId: string, driverName: string) => void;
  onClose: () => void;
}

export const TruckDriverAssignment: React.FC<TruckDriverAssignmentProps> = ({
  order,
  onAssignDriver,
  onClose
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const availableDrivers = mockTruckDrivers.filter(driver => 
    driver.status === 'available' || driver.status === 'loading'
  );

  const handleAssign = () => {
    if (selectedDriverId) {
      const selectedDriver = mockTruckDrivers.find(d => d.id === selectedDriverId);
      if (selectedDriver) {
        onAssignDriver(selectedDriverId, selectedDriver.name);
        onClose();
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      loading: 'bg-blue-100 text-blue-800 border-blue-200',
      out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
      maintenance: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || colors.available;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✅';
      case 'loading':
        return '📦';
      case 'out_for_delivery':
        return '🚛';
      case 'maintenance':
        return '🔧';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Truck className="h-5 w-5 mr-2 text-blue-600" />
            Assign Truck Driver - {order.orderNumber}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Order Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Project:</span>
                <span className="ml-2 font-medium">{order.projectName}</span>
              </div>
              <div>
                <span className="text-gray-600">Delivery Date:</span>
                <span className="ml-2">{new Date(order.deliveryDate).toLocaleDateString()}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Job Site:</span>
                <span className="ml-2">{order.jobSite}</span>
              </div>
            </div>
          </div>

          {/* Driver Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Available Drivers</h4>
            
            {availableDrivers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No drivers available at the moment</p>
                <p className="text-sm">All drivers are currently on delivery or in maintenance</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    onClick={() => setSelectedDriverId(driver.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDriverId === driver.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{driver.name}</h5>
                          <p className="text-sm text-gray-600">{driver.truckNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(driver.status)}`}>
                          <span className="mr-1">{getStatusIcon(driver.status)}</span>
                          {driver.status.replace('_', ' ').toUpperCase()}
                        </span>
                        
                        {selectedDriverId === driver.id && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {driver.phone}
                      </div>
                      <div>
                        <span className="font-medium">Today:</span> {driver.completedToday} completed
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Location:</span> {driver.currentLocation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedDriverId}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign Driver
          </button>
        </div>
      </div>
    </div>
  );
};