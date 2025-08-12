import React, { useState } from 'react';
import { Search, Plus, DollarSign, Calendar, User, Filter, TrendingUp, Clock, Target } from 'lucide-react';
import { Deal, Contact } from '../types';
import { pipelineStages } from '../data/mockData';
import { DealForm } from './DealForm';

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
  const probabilityColor = deal.probability >= 75 ? 'text-green-600' : 
                          deal.probability >= 50 ? 'text-yellow-600' : 'text-red-600';
  
  const daysUntilClose = Math.ceil((new Date(deal.closeDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilClose < 0;
  const isUrgent = daysUntilClose <= 7 && daysUntilClose >= 0;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{deal.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{deal.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {deal.contact.name}
            </div>
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              {deal.contact.company}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ${deal.value.toLocaleString()}
          </div>
          <div
            className="text-xs px-3 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: deal.stage.color }}
          >
            {deal.stage.name}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Probability</span>
            <span className={`font-semibold ${probabilityColor}`}>
              {deal.probability}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                deal.probability >= 75 ? 'bg-green-500' : 
                deal.probability >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${deal.probability}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Close Date</span>
            <div className="text-right">
              <div className={`text-sm font-medium ${
                isOverdue ? 'text-red-600' : isUrgent ? 'text-yellow-600' : 'text-gray-900'
              }`}>
                {new Date(deal.closeDate).toLocaleDateString()}
              </div>
              <div className={`text-xs ${
                isOverdue ? 'text-red-500' : isUrgent ? 'text-yellow-500' : 'text-gray-500'
              }`}>
                {isOverdue ? `${Math.abs(daysUntilClose)} days overdue` : 
                 isUrgent ? `${daysUntilClose} days left` : 
                 `${daysUntilClose} days`}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Updated {new Date(deal.updatedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium transition-colors">
            Edit
          </button>
          <button className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm font-medium transition-colors">
            Update Stage
          </button>
        </div>
      </div>
    </div>
  );
};

interface DealsListProps {
  deals: Deal[];
  contacts: Contact[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  deleteDeal: (dealId: string) => void;
}

export const DealsList: React.FC<DealsListProps> = ({ deals, contacts, addDeal, updateDeal, deleteDeal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('value');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const filteredAndSortedDeals = deals
    .filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.contact.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStage === 'all' || deal.stage.id === filterStage;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.value - a.value;
        case 'probability':
          return b.probability - a.probability;
        case 'closeDate':
          return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });
  
  const totalValue = filteredAndSortedDeals.reduce((sum, deal) => sum + deal.value, 0);
  const averageProbability = filteredAndSortedDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredAndSortedDeals.length || 0;
  
  return (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage and track all your sales opportunities</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Deal</span>
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAndSortedDeals.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Probability</p>
              <p className="text-2xl font-bold text-gray-900">{averageProbability.toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / filteredAndSortedDeals.length / 1000).toFixed(0)}K</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search deals, contacts, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stages</option>
                {pipelineStages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="value">Sort by Value</option>
              <option value="probability">Sort by Probability</option>
              <option value="closeDate">Sort by Close Date</option>
              <option value="updated">Sort by Last Updated</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
      
      {filteredAndSortedDeals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-400 text-lg mb-2">No deals found</div>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
      </div>
      
      <DealForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={addDeal}
        contacts={contacts}
      />
    </>
  );
};