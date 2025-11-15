/** API Configuration Modal - allows users to set backend URL at runtime. */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Check, X, AlertCircle } from 'lucide-react';
import { updateApiBaseUrl, getCurrentApiBaseUrl } from '../api/client';
import { healthCheck } from '../api/chatApi';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [apiUrl, setApiUrl] = useState(getCurrentApiBaseUrl() || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiUrl(getCurrentApiBaseUrl() || '');
      setTestResult(null);
    }
  }, [isOpen]);

  const handleTest = async () => {
    if (!apiUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter an API URL',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Temporarily update the API URL for testing
      const originalUrl = getCurrentApiBaseUrl();
      updateApiBaseUrl(apiUrl.trim());

      // Test the connection
      await healthCheck();

      setTestResult({
        success: true,
        message: 'Connection successful!',
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.response?.data?.detail || error.message || 'Connection failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (apiUrl.trim()) {
      updateApiBaseUrl(apiUrl.trim());
      onSave();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Configure Backend API
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enter your backend API URL. The app will automatically use localhost:8000 when running locally.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Base URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => {
                  setApiUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://your-backend-url.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Example: https://your-app.railway.app or https://your-app.onrender.com
              </p>
            </div>

            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                }`}
              >
                {testResult.success ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{testResult.message}</span>
              </motion.div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleTest}
                disabled={isTesting || !apiUrl.trim()}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                onClick={handleSave}
                disabled={!apiUrl.trim() || !testResult?.success}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

