import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de';
export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'sales' | 'user';
  avatar?: string;
  department: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  avatar?: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    deals: boolean;
    tasks: boolean;
  };
}

interface AppContextType {
  language: Language;
  theme: Theme;
  currentUser: UserProfile;
  users: User[];
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    pipeline: 'Pipeline',
    contacts: 'Contacts',
    deals: 'Deals',
    tasks: 'Tasks',
    settings: 'Settings',
    profile: 'Profile',
    users: 'User Management',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    general: 'General',
    security: 'Security',
    appearance: 'Appearance',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company',
    position: 'Position',
    department: 'Department',
    role: 'Role',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    admin: 'Admin',
    manager: 'Manager',
    sales: 'Sales',
    user: 'User',
    light: 'Light',
    dark: 'Dark',
    blue: 'Blue',
    green: 'Green',
    purple: 'Purple',
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
    timezone: 'Timezone',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    dealNotifications: 'Deal Notifications',
    taskNotifications: 'Task Notifications',
    profileUpdated: 'Profile updated successfully',
    userAdded: 'User added successfully',
    userUpdated: 'User updated successfully',
    userDeleted: 'User deleted successfully',
  },
  es: {
    dashboard: 'Panel',
    pipeline: 'Pipeline',
    contacts: 'Contactos',
    deals: 'Ofertas',
    tasks: 'Tareas',
    settings: 'Configuración',
    profile: 'Perfil',
    users: 'Gestión de Usuarios',
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificaciones',
    general: 'General',
    security: 'Seguridad',
    appearance: 'Apariencia',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Añadir',
    search: 'Buscar',
    filter: 'Filtrar',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono',
    company: 'Empresa',
    position: 'Posición',
    department: 'Departamento',
    role: 'Rol',
    status: 'Estado',
    active: 'Activo',
    inactive: 'Inactivo',
    admin: 'Administrador',
    manager: 'Gerente',
    sales: 'Ventas',
    user: 'Usuario',
    light: 'Claro',
    dark: 'Oscuro',
    blue: 'Azul',
    green: 'Verde',
    purple: 'Morado',
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
    german: 'Alemán',
    timezone: 'Zona Horaria',
    emailNotifications: 'Notificaciones por Email',
    pushNotifications: 'Notificaciones Push',
    dealNotifications: 'Notificaciones de Ofertas',
    taskNotifications: 'Notificaciones de Tareas',
    profileUpdated: 'Perfil actualizado exitosamente',
    userAdded: 'Usuario añadido exitosamente',
    userUpdated: 'Usuario actualizado exitosamente',
    userDeleted: 'Usuario eliminado exitosamente',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    pipeline: 'Pipeline',
    contacts: 'Contacts',
    deals: 'Affaires',
    tasks: 'Tâches',
    settings: 'Paramètres',
    profile: 'Profil',
    users: 'Gestion des Utilisateurs',
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
    general: 'Général',
    security: 'Sécurité',
    appearance: 'Apparence',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    company: 'Entreprise',
    position: 'Position',
    department: 'Département',
    role: 'Rôle',
    status: 'Statut',
    active: 'Actif',
    inactive: 'Inactif',
    admin: 'Administrateur',
    manager: 'Gestionnaire',
    sales: 'Ventes',
    user: 'Utilisateur',
    light: 'Clair',
    dark: 'Sombre',
    blue: 'Bleu',
    green: 'Vert',
    purple: 'Violet',
    english: 'Anglais',
    spanish: 'Espagnol',
    french: 'Français',
    german: 'Allemand',
    timezone: 'Fuseau Horaire',
    emailNotifications: 'Notifications Email',
    pushNotifications: 'Notifications Push',
    dealNotifications: 'Notifications d\'Affaires',
    taskNotifications: 'Notifications de Tâches',
    profileUpdated: 'Profil mis à jour avec succès',
    userAdded: 'Utilisateur ajouté avec succès',
    userUpdated: 'Utilisateur mis à jour avec succès',
    userDeleted: 'Utilisateur supprimé avec succès',
  },
  de: {
    dashboard: 'Dashboard',
    pipeline: 'Pipeline',
    contacts: 'Kontakte',
    deals: 'Geschäfte',
    tasks: 'Aufgaben',
    settings: 'Einstellungen',
    profile: 'Profil',
    users: 'Benutzerverwaltung',
    language: 'Sprache',
    theme: 'Design',
    notifications: 'Benachrichtigungen',
    general: 'Allgemein',
    security: 'Sicherheit',
    appearance: 'Erscheinungsbild',
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    add: 'Hinzufügen',
    search: 'Suchen',
    filter: 'Filtern',
    name: 'Name',
    email: 'E-Mail',
    phone: 'Telefon',
    company: 'Unternehmen',
    position: 'Position',
    department: 'Abteilung',
    role: 'Rolle',
    status: 'Status',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    admin: 'Administrator',
    manager: 'Manager',
    sales: 'Vertrieb',
    user: 'Benutzer',
    light: 'Hell',
    dark: 'Dunkel',
    blue: 'Blau',
    green: 'Grün',
    purple: 'Lila',
    english: 'Englisch',
    spanish: 'Spanisch',
    french: 'Französisch',
    german: 'Deutsch',
    timezone: 'Zeitzone',
    emailNotifications: 'E-Mail-Benachrichtigungen',
    pushNotifications: 'Push-Benachrichtigungen',
    dealNotifications: 'Geschäfts-Benachrichtigungen',
    taskNotifications: 'Aufgaben-Benachrichtigungen',
    profileUpdated: 'Profil erfolgreich aktualisiert',
    userAdded: 'Benutzer erfolgreich hinzugefügt',
    userUpdated: 'Benutzer erfolgreich aktualisiert',
    userDeleted: 'Benutzer erfolgreich gelöscht',
  },
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    department: 'Sales',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15',
    status: 'active',
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'manager',
    department: 'Sales',
    phone: '+1 (555) 234-5678',
    joinDate: '2023-03-20',
    status: 'active',
    permissions: ['deals', 'contacts', 'tasks'],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'sales',
    department: 'Sales',
    phone: '+1 (555) 345-6789',
    joinDate: '2023-06-10',
    status: 'active',
    permissions: ['deals', 'contacts'],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Sales',
    position: 'Sales Manager',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      push: true,
      deals: true,
      tasks: true,
    },
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('crm-language') as Language;
    const savedTheme = localStorage.getItem('crm-theme') as Theme;
    const savedProfile = localStorage.getItem('crm-profile');

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) setTheme(savedTheme);
    if (savedProfile) {
      try {
        setCurrentUser(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error parsing saved profile:', e);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Apply theme colors
    const themeColors = {
      light: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: '#111827',
      },
      dark: {
        primary: '#60A5FA',
        secondary: '#9CA3AF',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
      },
      blue: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#EFF6FF',
        surface: '#FFFFFF',
        text: '#1E3A8A',
      },
      green: {
        primary: '#059669',
        secondary: '#10B981',
        success: '#34D399',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#ECFDF5',
        surface: '#FFFFFF',
        text: '#064E3B',
      },
      purple: {
        primary: '#7C3AED',
        secondary: '#A78BFA',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F3E8FF',
        surface: '#FFFFFF',
        text: '#581C87',
      },
    };

    const colors = themeColors[theme];
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('crm-language', lang);
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('crm-theme', newTheme);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...currentUser, ...updates };
    setCurrentUser(updatedProfile);
    localStorage.setItem('crm-profile', JSON.stringify(updatedProfile));
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        currentUser,
        users,
        setLanguage: handleSetLanguage,
        setTheme: handleSetTheme,
        updateProfile,
        addUser,
        updateUser,
        deleteUser,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};