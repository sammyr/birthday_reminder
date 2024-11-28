'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '@/lib/db';

interface Settings {
  reminderDays: number;
  emailNotifications: boolean;
  emailTemplate: string;
  emailAddress: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  loading: boolean;
}

const defaultSettings: Settings = {
  reminderDays: 7,
  emailNotifications: false,
  emailTemplate: 'Erinnerung: {name} hat in {days} Geburtstag!\n\nHallo,\n\nich möchte Sie daran erinnern, dass {name} in {days} {age} Jahre alt wird.\n\nViele Grüße\n{sender}',
  emailAddress: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const dbSettings = await dbService.getSettings();
        if (dbSettings) {
          setSettings(dbSettings);
        }
      } catch (error) {
        console.error('Failed to load settings from database:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    try {
      // Update database
      await dbService.updateSettings(updatedSettings);
      
      // Update local state
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
