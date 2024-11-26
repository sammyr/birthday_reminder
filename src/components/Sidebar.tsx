'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ClockIcon,
  ArrowLeftOnRectangleIcon,
  CogIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Arbeitsplan', href: '/workplan', icon: CalendarIcon },
  { name: 'Filialen', href: '/stores', icon: BuildingOfficeIcon },
  { name: 'Mitarbeiter', href: '/employees', icon: UserGroupIcon },
  { name: 'Arbeitsschichten', href: '/shifts', icon: ClockIcon },
  { name: 'Logbuch', href: '/logbuch', icon: ClipboardDocumentListIcon },
  { name: 'Einstellungen', href: '/settings', icon: CogIcon },
  { name: 'Hilfe', href: '/help', icon: QuestionMarkCircleIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    router.push('/login');
  };

  const NavigationContent = () => (
    <>
      {/* Logo and App Name */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-6">
        <h1 className="text-xl font-semibold text-gray-900">Arbeitsplan</h1>
        <button
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0 transition-colors
                  ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <ArrowLeftOnRectangleIcon
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600"
            aria-hidden="true"
          />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center z-50">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        </button>
        <h1 className="ml-4 text-lg font-semibold text-gray-900">Arbeitsplan</h1>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 w-72 flex-col bg-white border-r border-gray-200 z-30">
        <NavigationContent />
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile menu content */}
          <div className="fixed inset-y-0 left-0 w-72 flex flex-col bg-white shadow-xl">
            <NavigationContent />
          </div>
        </div>
      )}
    </>
  );
}
