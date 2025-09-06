import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  currentScreen: string;
}

export default function Header({ currentScreen }: HeaderProps) {
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return 'Dashboard';
      case 'workouts': return 'Workouts';
      case 'progress': return 'Progress';
      case 'profile': return 'Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Turbostride
              </h1>
            </div>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-gray-800">{getScreenTitle()}</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">AJ</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}