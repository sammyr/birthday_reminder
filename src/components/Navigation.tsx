'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdHome, MdSettings, MdMenu, MdClose, MdCake, MdNotifications } from 'react-icons/md';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: '/', icon: MdHome, label: 'Home' },
    { href: '/checkup', icon: MdNotifications, label: 'Checkup' },
    { href: '/settings', icon: MdSettings, label: 'Settings' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white text-gray-800 shadow-md' 
        : 'bg-transparent text-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              <MdCake className={`h-8 w-8 ${isScrolled ? 'text-pink-500' : 'text-pink-600'}`} />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Birthday Reminder
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-pink-600'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-pink-600' : ''
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-pink-500 to-purple-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isOpen ? 'bg-pink-50 text-pink-600' : 'hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <MdClose className="h-6 w-6" />
              ) : (
                <MdMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-pink-600' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
