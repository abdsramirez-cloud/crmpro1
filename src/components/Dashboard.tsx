import React from 'react';
import { TrendingUp, Users, Target, DollarSign, Activity, Calendar } from 'lucide-react';
import { dashboardStats, pipelineStages } from '../data/mockData';
import { Deal, Contact } from '../types';

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        <p className={`text-sm mt-2 ${color}`}>{change}</p>
      </div>
      <div className={`p-3 rounded-lg ${color === 'text-green-600' ? 'bg-green-100' : 'bg-blue-100'}`}>
        <Icon className={`w-6 h-6 ${color === 'text-green-600' ? 'text-green-600' : 'text-blue-600'}`} />
      </div>
    </div>
  </div>
);

interface DashboardProps {
  deals: Deal[];
  contacts: Contact[];
}

export const Dashboard: React.FC<DashboardProps> = ({ deals, contacts }) => {
  const recentDeals = deals.slice(0, 5);
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(deal => deal.stage.name === 'Closed Won').length;
  const conversionRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;
  const hotContacts = contacts.filter(contact => contact.status === 'hot').length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pipeline Value"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          change="+12% from last month"
          icon={DollarSign}
          color="text-green-600"
        />
        <StatCard
          title="Active Deals"
          value={deals.length.toString()}
          change="+8% from last month"
          icon={Target}
          color="text-blue-600"
        />
        <StatCard
          title="Total Contacts"
          value={contacts.length.toString()}
          change="+12% from last month"
          icon={Users}
          color="text-green-600"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          change="+3% from last month"
          icon={Activity}
          color="text-green-600"
        />
      </div>
      
      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h2>
          <div className="space-y-4">
            {pipelineStages.map((stage) => {
              const stageDeals = deals.filter(deal => deal.stage.id === stage.id);
              const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              
              return (
                <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-gray-900">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{stageDeals.length} deals</div>
                    <div className="text-sm text-gray-600">${(stageValue / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Deals</h2>
          <div className="space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <div className="font-medium text-gray-900">{deal.title}</div>
                  <div className="text-sm text-gray-600">{deal.contact.company}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${(deal.value / 1000).toFixed(0)}K</div>
                  <div
                    className="text-xs px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: deal.stage.color }}
                  >
                    {deal.stage.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group">
            <Users className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
            <span className="font-medium text-gray-600 group-hover:text-blue-600">Add New Contact</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Target className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
            <span className="font-medium text-gray-600 group-hover:text-green-600">Create Deal</span>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group">
            <Calendar className="w-6 h-6 text-gray-400 group-hover:text-purple-600" />
            <span className="font-medium text-gray-600 group-hover:text-purple-600">Schedule Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
};