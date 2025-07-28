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
  User
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
    { name: 'Emily Rodriguez', title: 'Job Lead', role: 'job_lead' },
    { name: 'Michael Chen', title: 'Project Manager', role: 'project_manager' },
    { name: 'Sarah Williams', title: 'Shop Manager', role: 'shop_manager' },
    { name: 'David Thompson', title: 'Assistant Shop Manager', role: 'assistant_shop_manager' },
    { name: 'Lisa Johnson', title: 'Shop Employee', role: 'shop_employee' },
    { name: 'Robert Davis', title: 'Truck Driver', role: 'truck_driver' },
    { name: 'Jennifer Martinez', title: 'Accountant Manager', role: 'accountant_manager' },
  ];

  const getMenuItems = (role: UserRole) => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'orders', label: 'Orders', icon: Package },
      { id: 'stakeholders', label: 'Stakeholders', icon: Users },
    ];

    const roleSpecificItems = {
      site_foreman: [
        { id: 'create-order', label: 'Create Order', icon: Plus },
      ],
      job_lead: [
        { id: 'create-order', label: 'Create Order', icon: Plus },
      ],
      project_manager: [
        { id: 'create-order', label: 'Create Order', icon: Plus },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ],
      shop_manager: [
        { id: 'shop-queue', label: 'Shop Queue', icon: Package },
        { id: 'deliveries', label: 'Deliveries', icon: Truck },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ],
      assistant_shop_manager: [
        { id: 'shop-queue', label: 'Shop Queue', icon: Package },
        { id: 'deliveries', label: 'Deliveries', icon: Truck },
      ],
      shop_employee: [
        { id: 'my-tasks', label: 'My Tasks', icon: Clock },
      ],
      truck_driver: [
        { id: 'my-deliveries', label: 'My Deliveries', icon: Truck },
      ],
      accountant_manager: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'costs', label: 'Cost Analysis', icon: BarChart3 },
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
        
        {/* Stakeholders Section - Only show when stakeholders tab is active */}
        {activeTab === 'stakeholders' && (
          <div className="mt-6 px-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Project Stakeholders
            </h3>
            <div className="space-y-2">
              {stakeholders.map((stakeholder, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-800 rounded-lg"
                >
                  <User className="mr-3 h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium">{stakeholder.name}</div>
                    <div className="text-xs text-gray-400">{stakeholder.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};