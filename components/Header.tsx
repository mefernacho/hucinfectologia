

import React, { useState } from 'react';
import { Tab } from '../core/types';
import { TABS } from '../core/constants';
import { LogoutIcon } from './icons/LogoutIcon';
import { StethoscopeIcon } from './icons/StethoscopeIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, isLoggedIn, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-brand-gray shadow-md relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <StethoscopeIcon className="h-8 w-8 text-brand-red" />
            <span className="ml-3 text-white font-bold text-xl hidden sm:inline-block">
              Servicio de Infectología
            </span>
          </div>
          <div className="flex items-center">
            <nav className="hidden md:flex space-x-1">
              {TABS.map((tab) => {
                  const isDisabled = !isLoggedIn && tab !== 'Inicio';
                  return (
                    <button
                      key={tab}
                      onClick={() => !isDisabled && handleTabClick(tab)}
                      disabled={isDisabled}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        activeTab === tab
                          ? 'bg-brand-blue text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {tab}
                    </button>
                  );
              })}
            </nav>
            {isLoggedIn && (
                <button
                    onClick={onLogout}
                    className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-brand-red hover:text-white transition-colors duration-200"
                    title="Cerrar Sesión"
                >
                    <LogoutIcon className="h-5 w-5" />
                    <span className="hidden lg:inline ml-2">Salir</span>
                </button>
            )}
            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
                {isLoggedIn && (
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Abrir menú principal</span>
                        {isMobileMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu panel */}
      {isMobileMenuOpen && isLoggedIn && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-brand-gray z-20 shadow-lg">
              <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {TABS.map((tab) => {
                       const isDisabled = !isLoggedIn && tab !== 'Inicio';
                       return (
                           <button
                            key={tab}
                            onClick={() => !isDisabled && handleTabClick(tab)}
                            disabled={isDisabled}
                            className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                                activeTab === tab
                                ? 'bg-brand-blue text-white'
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {tab}
                            </button>
                       )
                  })}
              </nav>
          </div>
      )}
    </header>
  );
}