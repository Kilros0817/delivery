import React from 'react';
import { Bell, Package } from 'lucide-react';
import { User as UserType } from '../../types';
import { UserSwitcher } from '../Auth/UserSwitcher';

interface HeaderProps {
  currentUser: UserType;
  notificationCount: number;
  onNotificationClick: () => void;
  onUserSwitch: (user: UserType) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  notificationCount, 
  onNotificationClick,
  onUserSwitch,
  onLogout
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Inventory Workflow By TomeBlock</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onNotificationClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            <UserSwitcher
              currentUser={currentUser}
              onUserSwitch={onUserSwitch}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
};