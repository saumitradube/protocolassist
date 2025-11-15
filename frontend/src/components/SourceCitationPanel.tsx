/** Source citation panel showing document references. */
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen } from 'lucide-react';
import { Source } from '../types/chat';

interface SourceCitationPanelProps {
  sources: Source[];
}

export const SourceCitationPanel: React.FC<SourceCitationPanelProps> = ({
  sources,
}) => {
  if (sources.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Sources will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText size={18} />
          Sources ({sources.length})
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {sources.map((source, index) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {source.fileName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                Page {source.pageNumber}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
              {source.snippet}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

