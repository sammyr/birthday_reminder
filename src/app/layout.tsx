import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SettingsProvider } from '@/contexts/SettingsContext'
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
    <html lang="de">
      <body className={inter.className}>
        <SettingsProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster />
        </SettingsProvider>
      </body>
    </html>
  )
}
