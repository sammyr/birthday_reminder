import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { BirthdayProvider } from '@/contexts/BirthdayContext'
import ClientLayout from './client-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Birthday Reminder',
  description: 'Never forget a birthday again!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          <BirthdayProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
            <Toaster />
          </BirthdayProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
