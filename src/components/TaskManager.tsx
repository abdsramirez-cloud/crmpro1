import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  User, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle,
  Tag,
  ExternalLink,
  CalendarPlus
} from 'lucide-react';
import { Task } from '../types';
import { mockTasks, mockContacts, mockDeals } from '../data/mockData';

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };
  
  const statusIcons = {
    'todo': Circle,
    'in-progress': Clock,
    'completed': CheckCircle2,
  };
  
  const statusColors = {
    'todo': 'text-gray-500',
    'in-progress': 'text-blue-500',
    'completed': 'text-green-500',
  };
  
  const StatusIcon = statusIcons[task.status];
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const contact = mockContacts.find(c => c.id === task.contactId);
  const deal = mockDeals.find(d => d.id === task.dealId);
  
  const handleAddToCalendar = () => {
    // Google Calendar integration
    const startDate = new Date(task.dueDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(task.description)}&location=${contact ? encodeURIComponent(contact.company) : ''}`;
    
    window.open(googleCalendarUrl, '_blank');
  };
  
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border transition-all duration-200 hover:shadow-md ${
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <button className={`mt-1 ${statusColors[task.status]} hover:scale-110 transition-transform`}>
            <StatusIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 mb-1 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            
            {(contact || deal) && (
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                {contact && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {contact.name}
                  </div>
                )}
                {deal && (
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {deal.title}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <button
            onClick={handleAddToCalendar}
            className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
            title="Add to Google Calendar"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            {isOverdue && <span className="ml-1 text-red-500 font-medium">(Overdue)</span>}
          </div>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-1" />
            <span>{task.assignedTo}</span>
          </div>
        </div>
      </div>
      
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task.tags.map((tag, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Updated {new Date(task.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium transition-colors">
            Edit
          </button>
          <button className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm font-medium transition-colors">
            {task.status === 'completed' ? 'Reopen' : 'Complete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const TaskManager: React.FC = () => {
  const [tasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          const statusOrder = { 'todo': 1, 'in-progress': 2, 'completed': 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });
  
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
  };
  
  const handleSyncCalendar = () => {
    // Open Google Calendar in a new tab
    window.open('https://calendar.google.com', '_blank');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Organize your work and sync with Google Calendar</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSyncCalendar}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Calendar</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>
      
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.total}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">To Do</p>
              <p className="text-2xl font-bold text-blue-600">{taskStats.todo}</p>
            </div>
            <Circle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
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
              placeholder="Search tasks, descriptions, assignees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
              <option value="updated">Sort by Last Updated</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      {filteredAndSortedTasks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-400 text-lg mb-2">No tasks found</div>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Google Calendar Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Google Calendar Integration</h3>
            <p className="text-sm text-blue-700 mb-2">
              Click the calendar icon on any task to add it to your Google Calendar. You can also sync your existing calendar events.
            </p>
            <button 
              onClick={handleSyncCalendar}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Open Google Calendar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};