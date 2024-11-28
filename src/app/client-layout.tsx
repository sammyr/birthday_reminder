'use client';

import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { db } from '@/lib/birthday-db';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (db) {
      db.open().catch((err) => {
        console.error('Failed to open database:', err);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        {children}
      </main>
    </div>
  );
}
