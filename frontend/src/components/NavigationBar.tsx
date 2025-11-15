/** Modern navigation bar component with Upload and Chat sections. */
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, MessageSquare, Activity, Moon, Sun, LogOut, User } from 'lucide-react';

interface NavigationBarProps {
  activeTab: 'upload' | 'chat';
  onTabChange: (tab: 'upload' | 'chat') => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  hasSession: boolean;
  username?: string;
  onLogout?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
  darkMode,
  onDarkModeToggle,
  hasSession,
  username,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top bar with logo and dark mode */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-50"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Clinical Protocol Assistant
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI-powered protocol assistant
              </p>
            </div>
          </div>
          
          {/* User Info and Actions */}
          <div className="flex items-center gap-3">
            {username && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                <User className="text-gray-600 dark:text-gray-400" size={16} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {username}
                </span>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={onDarkModeToggle}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-gray-700 dark:text-gray-300" size={20} />
              )}
            </motion.button>

            {/* Logout Button */}
            {onLogout && (
              <motion.button
                onClick={onLogout}
                className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="text-red-600 dark:text-red-400" size={20} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-2 pb-3">
          <motion.button
            onClick={() => onTabChange('upload')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === 'upload'
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeTab === 'upload' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <Upload
              size={18}
              className={`relative z-10 ${
                activeTab === 'upload' ? 'text-white' : ''
              }`}
            />
            <span className="relative z-10">Documents</span>
            {hasSession && activeTab !== 'upload' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative z-10 w-2 h-2 bg-green-500 rounded-full"
              />
            )}
          </motion.button>

          <motion.button
            onClick={() => onTabChange('chat')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
              activeTab === 'chat'
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!hasSession}
          >
            {activeTab === 'chat' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <MessageSquare
              size={18}
              className={`relative z-10 ${
                activeTab === 'chat' ? 'text-white' : ''
              } ${!hasSession ? 'opacity-50' : ''}`}
            />
            <span className="relative z-10">Chat</span>
            {!hasSession && (
              <span className="relative z-10 text-xs text-gray-400 ml-1">
                (Upload docs first)
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

