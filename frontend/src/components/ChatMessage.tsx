/** Chat message component with user/AI styling and beautiful markdown rendering. */
import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types/chat';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 mb-6 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-primary-500 text-white'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
        }`}
      >
        {isUser ? (
          <User size={20} />
        ) : (
          <Bot size={20} />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-500 text-white rounded-br-sm'
            : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 rounded-bl-sm shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headers with colors
                h1: ({ node, ...props }) => (
                  <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-4 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mt-3 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-2 mb-1" {...props} />
                ),
                // Paragraphs
                p: ({ node, ...props }) => (
                  <p className="text-sm leading-relaxed mb-2 text-gray-800 dark:text-gray-200" {...props} />
                ),
                // Lists with colors
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1 text-gray-800 dark:text-gray-200" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-800 dark:text-gray-200" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-sm ml-2" {...props} />
                ),
                // Strong/Bold text
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-blue-700 dark:text-blue-300" {...props} />
                ),
                // Emphasis/Italic
                em: ({ node, ...props }) => (
                  <em className="italic text-purple-600 dark:text-purple-400" {...props} />
                ),
                // Code blocks
                code: ({ node, inline, ...props }: any) => {
                  if (inline) {
                    return (
                      <code className="bg-gray-200 dark:bg-gray-700 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                    );
                  }
                  return (
                    <code className="block bg-gray-900 dark:bg-gray-950 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2" {...props} />
                  );
                },
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-900 dark:bg-gray-950 p-3 rounded-lg overflow-x-auto mb-2" {...props} />
                ),
                // Links
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 dark:text-blue-400 hover:underline font-medium" {...props} />
                ),
                // Blockquotes
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic text-gray-700 dark:text-gray-300 my-2" {...props} />
                ),
                // Horizontal rule
                hr: ({ node, ...props }) => (
                  <hr className="border-t-2 border-gray-300 dark:border-gray-600 my-3" {...props} />
                ),
                // Tables
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="border border-gray-300 dark:border-gray-600 bg-blue-100 dark:bg-blue-900 px-3 py-2 font-semibold text-left" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <span
          className={`text-xs mt-2 block ${
            isUser
              ? 'text-primary-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  );
};

