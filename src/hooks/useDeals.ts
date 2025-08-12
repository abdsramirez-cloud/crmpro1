import { useState, useCallback } from 'react';
import { Deal } from '../types';
import { mockDeals } from '../data/mockData';

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  const addDeal = useCallback((newDealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>) => {
    const newDeal: Deal = {
      ...newDealData,
      id: Date.now().toString(),
      activities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDeals(prevDeals => [newDeal, ...prevDeals]);
    return newDeal;
  }, []);

  const updateDeal = useCallback((dealId: string, updates: Partial<Deal>) => {
    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId
          ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
          : deal
      )
    );
  }, []);

  const deleteDeal = useCallback((dealId: string) => {
    setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
  }, []);

  return {
    deals,
    addDeal,
    updateDeal,
    deleteDeal,
  };
};