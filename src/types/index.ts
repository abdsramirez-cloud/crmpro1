export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'hot' | 'warm' | 'cold';
  lastContact: string;
  avatar?: string;
  tags: string[];
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: PipelineStage;
  contactId: string;
  contact: Contact;
  probability: number;
  closeDate: string;
  description: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
  contactId?: string;
  dealId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  googleCalendarEventId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  attendees?: string[];
}
export interface DashboardStats {
  totalDeals: number;
  totalValue: number;
  wonDeals: number;
  conversionRate: number;
  averageDealSize: number;
  pipelineVelocity: number;
}

export type ViewType = 'dashboard' | 'pipeline' | 'contacts' | 'deals' | 'tasks' | 'settings';