'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Birthday } from '@/types/Birthday';
import { dbService } from '@/lib/db';
import { useToast } from '@/components/ui/use-toast';

interface BirthdayContextType {
  birthdays: Birthday[];
  loading: boolean;
  error: string | null;
  addBirthday: (birthday: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateBirthday: (id: string, birthday: Partial<Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteBirthday: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export function BirthdayProvider({ children }: { children: React.ReactNode }) {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      const data = await dbService.getAllBirthdays();
      setBirthdays(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load birthdays:', err);
      setError('Failed to load birthdays');
      toast({
        title: "Error",
        description: "Failed to load birthdays. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBirthdays();
  }, []);

  const addBirthday = async (birthday: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await dbService.addBirthday(birthday);
      await loadBirthdays();
      toast({
        title: "Birthday added",
        description: "Birthday has been added successfully.",
      });
      return id;
    } catch (err) {
      console.error('Failed to add birthday:', err);
      toast({
        title: "Error",
        description: "Failed to add birthday. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateBirthday = async (id: string, birthday: Partial<Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      await dbService.updateBirthday(id, birthday);
      await loadBirthdays();
      toast({
        title: "Birthday updated",
        description: "Birthday has been updated successfully.",
      });
    } catch (err) {
      console.error('Failed to update birthday:', err);
      toast({
        title: "Error",
        description: "Failed to update birthday. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteBirthday = async (id: string) => {
    try {
      await dbService.deleteBirthday(id);
      await loadBirthdays();
      toast({
        title: "Birthday deleted",
        description: "Birthday has been deleted successfully.",
      });
    } catch (err) {
      console.error('Failed to delete birthday:', err);
      toast({
        title: "Error",
        description: "Failed to delete birthday. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return (
    <BirthdayContext.Provider 
      value={{ 
        birthdays, 
        loading, 
        error, 
        addBirthday, 
        updateBirthday, 
        deleteBirthday,
        refresh: loadBirthdays
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
}

export function useBirthday() {
  const context = useContext(BirthdayContext);
  if (context === undefined) {
    throw new Error('useBirthday must be used within a BirthdayProvider');
  }
  return context;
}
