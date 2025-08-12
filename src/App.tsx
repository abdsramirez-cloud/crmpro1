import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { ContactList } from './components/ContactList';
import { DealsList } from './components/DealsList';
import { TaskManager } from './components/TaskManager';
import { useDeals } from './hooks/useDeals';
import { useContacts } from './hooks/useContacts';
import { ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { deals, addDeal, updateDeal, deleteDeal } = useDeals();
  const { contacts, addContact, updateContact, deleteContact } = useContacts();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard deals={deals} contacts={contacts} />;
      case 'pipeline':
        return <KanbanBoard deals={deals} updateDeal={updateDeal} addDeal={addDeal} contacts={contacts} />;
      case 'contacts':
        return <ContactList contacts={contacts} addContact={addContact} updateContact={updateContact} deleteContact={deleteContact} />;
      case 'deals':
        return <DealsList deals={deals} addDeal={addDeal} updateDeal={updateDeal} deleteDeal={deleteDeal} contacts={contacts} />;
      case 'tasks':
        return <TaskManager />;
      default:
        return <Dashboard deals={deals} contacts={contacts} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
    </Layout>
  );
}

export default App;