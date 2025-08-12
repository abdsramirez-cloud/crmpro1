import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, DollarSign, Calendar, User } from 'lucide-react';
import { Deal, PipelineStage, Contact } from '../types';
import { pipelineStages } from '../data/mockData';
import { DealForm } from './DealForm';

const DealCard: React.FC<{ deal: Deal; index: number }> = ({ deal, index }) => (
  <Draggable draggableId={deal.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
          snapshot.isDragging ? 'shadow-lg rotate-2' : ''
        }`}
      >
        <h3 className="font-medium text-gray-900 mb-2">{deal.title}</h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            ${deal.value.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-1" />
            {deal.contact.name}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(deal.closeDate).toLocaleDateString()}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {deal.probability}%
          </span>
          <div className="text-xs text-gray-500">
            {deal.contact.company}
          </div>
        </div>
      </div>
    )}
  </Draggable>
);

const KanbanColumn: React.FC<{
  stage: PipelineStage;
  deals: Deal[];
  onAddDeal: (stageId: string) => void;
}> = ({ stage, deals, onAddDeal }) => {
  const columnValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h2 className="font-semibold text-gray-900">{stage.name}</h2>
          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            {deals.length}
          </span>
        </div>
        <button 
          onClick={() => onAddDeal(stage.id)}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        Total: ${(columnValue / 1000).toFixed(0)}K
      </div>
      
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-24 ${
              snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg' : ''
            }`}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

interface KanbanBoardProps {
  deals: Deal[];
  contacts: Contact[];
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ deals, contacts, updateDeal, addDeal }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    
    const newStage = pipelineStages.find(stage => stage.id === destination.droppableId);
    
    if (newStage) {
      updateDeal(draggableId, {
        stage: newStage,
      });
    }
  };
  
  const handleAddDeal = (stageId: string) => {
    setSelectedStageId(stageId);
    setIsFormOpen(true);
  };
  
  const handleFormSubmit = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>) => {
    if (selectedStageId) {
      const selectedStage = pipelineStages.find(stage => stage.id === selectedStageId);
      if (selectedStage) {
        addDeal({
          ...dealData,
          stage: selectedStage,
        });
      }
    } else {
      addDeal(dealData);
    }
    setSelectedStageId('');
  };
  
  return (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">Drag and drop deals to update their stage</p>
        </div>
        <button 
          onClick={() => handleAddDeal('')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Deal
        </button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => {
            const stageDeals = deals.filter(deal => deal.stage.id === stage.id);
            return (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                deals={stageDeals}
                onAddDeal={handleAddDeal}
              />
            );
          })}
        </div>
      </DragDropContext>
      </div>
      
      <DealForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedStageId('');
        }}
        onSubmit={handleFormSubmit}
        contacts={contacts}
      />
    </>
  );
};