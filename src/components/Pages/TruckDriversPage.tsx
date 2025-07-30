import React from 'react';
import { mockTruckDrivers } from '@/data/mockData';

export const TruckDriversPage: React.FC = () => {
  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-200',
      loading: 'bg-blue-100 text-blue-800 border-blue-200',
      out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
      maintenance: 'bg-red-100 text-red-800 border-red-200',
      off_duty: 'bg-gray-100 text-gray-800 border-gray-200',
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
      case 'off_duty':
        return '🏠';
      default:
        return '❓';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Truck Drivers</h1>
        <div className="text-sm text-gray-600">
          {mockTruckDrivers.filter(d => d.status === 'available').length} Available • 
          {mockTruckDrivers.filter(d => d.status === 'out_for_delivery').length} On Delivery • 
          {mockTruckDrivers.filter(d => d.status === 'loading').length} Loading
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockTruckDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                  <p className="text-sm text-gray-600">{driver.truckNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(driver.status)}`}>
                  <span className="mr-1">{getStatusIcon(driver.status)}</span>
                  {driver.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Contact:</span>
                <span className="font-medium">{driver.phone}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">License:</span>
                <span className="font-medium">{driver.licenseNumber}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Location:</span>
                <span className="font-medium text-right">{driver.currentLocation}</span>
              </div>
              
              {driver.estimatedReturn && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Est. Return:</span>
                  <span className="font-medium">
                    {new Date(driver.estimatedReturn).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{driver.ordersAssigned}</div>
                    <div className="text-gray-600">Assigned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{driver.completedToday}</div>
                    <div className="text-gray-600">Completed Today</div>
                  </div>
                </div>
              </div>
              
              {driver.status === 'maintenance' && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">🔧 Truck in maintenance - Not available for assignments</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Driver Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span className="text-blue-800">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📦</span>
            <span className="text-blue-800">Loading</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🚛</span>
            <span className="text-blue-800">On Delivery</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔧</span>
            <span className="text-blue-800">Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🏠</span>
            <span className="text-blue-800">Off Duty</span>
          </div>
        </div>
      </div>
    </div>
  );
};