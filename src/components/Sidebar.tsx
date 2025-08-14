import React from 'react';
import {
  BarChart3,
  Users,
  Target,
  Calendar,
  Settings,
  Home,
  TrendingUp
} from 'lucide-react';
import { ViewType } from '../types';
import { useApp } from '../contexts/AppContext';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { t } = useApp();
  
  const menuItems = [
    { id: 'dashboard' as ViewType, label: t('dashboard'), icon: Home },
    { id: 'pipeline' as ViewType, label: t('pipeline'), icon: TrendingUp },
    { id: 'contacts' as ViewType, label: t('contacts'), icon: Users },
    { id: 'deals' as ViewType, label: t('deals'), icon: Target },
    { id: 'tasks' as ViewType, label: t('tasks'), icon: Calendar },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">CRMPro</h1>
        </div>
      </div>
      
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
          className={`
            w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
            ${currentView === 'settings'
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
          onClick={() => onViewChange('settings')}
          <Settings className={`w-5 h-5 ${currentView === 'settings' ? 'text-blue-600' : ''}`} />
          <span className="font-medium">{t('settings')}</span>
        </button>
      </div>
    </div>
  );
};