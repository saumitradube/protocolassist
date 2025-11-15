/** Main App component with modern navigation. */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from './hooks/useChat';
import { ChatLayout } from './components/ChatLayout';
import { SourceCitationPanel } from './components/SourceCitationPanel';
import { NavigationBar } from './components/NavigationBar';
import { UploadView } from './components/UploadView';
import { LoginScreen } from './components/LoginScreen';

function App() {
  const [username, setUsername] = useState<string | null>(() => {
    // Check if user is already logged in
    return localStorage.getItem('username');
  });

  const {
    session,
    messages,
    sources,
    isLoading,
    error,
    handleUpload,
    handleSendMessage,
  } = useChat(username || undefined);

  const [activeTab, setActiveTab] = useState<'upload' | 'chat'>('upload');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Auto-switch to chat tab when session is created
  useEffect(() => {
    if (session && activeTab === 'upload') {
      setActiveTab('chat');
    }
  }, [session]);

  const handleLogin = (loggedInUsername: string) => {
    setUsername(loggedInUsername);
    localStorage.setItem('username', loggedInUsername);
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('username');
  };

  // Show login screen if not authenticated
  if (!username) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
      {/* Navigation Bar */}
      <NavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        hasSession={!!session}
        username={username}
        onLogout={handleLogout}
      />

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-6 py-3"
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Main content with smooth transitions */}
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <UploadView
                onUpload={handleUpload}
                isLoading={isLoading}
                uploadedFiles={session?.documents}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex overflow-hidden"
            >
              {/* Chat area */}
              <div className="flex-1 flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className="flex-1 overflow-hidden">
                  <div className="h-full max-w-4xl mx-auto flex flex-col">
                    <div className="flex-1 min-h-0">
                      <ChatLayout
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleSendMessage}
                        hasSession={!!session}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sources panel */}
              <div className="w-80 border-l border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex flex-col">
                <SourceCitationPanel sources={sources} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

