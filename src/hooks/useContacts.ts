import { useState, useCallback } from 'react';
import { Contact } from '../types';
import { mockContacts } from '../data/mockData';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);

  const addContact = useCallback((newContactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...newContactData,
      id: Date.now().toString(),
    };

    setContacts(prevContacts => [newContact, ...prevContacts]);
    return newContact;
  }, []);

  const updateContact = useCallback((contactId: string, updates: Partial<Contact>) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId
          ? { ...contact, ...updates }
          : contact
      )
    );
  }, []);

  const deleteContact = useCallback((contactId: string) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
  }, []);

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
  };
};