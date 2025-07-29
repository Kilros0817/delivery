import React from 'react';
import { 
  Home, 
  Plus, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Clock,
  AlertTriangle,
  User,
  CheckCircle
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  currentUserRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentUserRole, 
  activeTab, 
  onTabChange 
}) => {
  const stakeholders = [
    { name: 'John Smith', title: 'Site Foreman', role: 'site_foreman' },
    { name: 'Mike Wilson', title: 'Shop Manager', role: 'shop_manager' },
    { name: 'Tom Rodriguez', title: 'Truck Driver', role: 'truck_driver' },
  ];

  const getMenuItems = (role: UserRole) => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    // Add Orders tabs for all roles
    if (role === 'site_foreman') {
      baseItems.push({ id: 'active-orders', label: 'Active Orders', icon: Package });
    } else {
      baseItems.splice(1, 0, 
        { id: 'active-orders', label: 'Active Orders', icon: Package },
        { id: 'completed-orders', label: 'Completed Orders', icon: CheckCircle }
      );
    }
    
    const roleSpecificItems = {
      site_foreman: [
        { id: 'create-order', label: 'Create Order', icon: Plus },
      ],
      shop_manager: [
        { id: 'truck-drivers', label: 'Truck Drivers', icon: Truck },
      ],
      truck_driver: [
      ],
    };

    return [...baseItems, ...(roleSpecificItems[role] || [])];
  };

  const menuItems = getMenuItems(currentUserRole);

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
        
      </nav>
    </div>
  );
};