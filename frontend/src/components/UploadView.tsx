/** Upload/Documents view component. */
import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, X, Sparkles } from 'lucide-react';

interface UploadViewProps {
  onUpload: (files: File[]) => Promise<void>;
  isLoading: boolean;
  uploadedFiles?: Array<{ fileName: string; pages: number }>;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onUpload,
  isLoading,
  uploadedFiles = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Debug: Log when selectedFiles changes
  useEffect(() => {
    console.log('🔍 Selected files state updated:', selectedFiles.length, selectedFiles.map(f => f.name));
    console.log('🔍 Will render files section?', selectedFiles.length > 0);
  }, [selectedFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const allFiles = Array.from(e.dataTransfer.files);
        const pdfFiles = allFiles.filter(
          (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );
        
        if (pdfFiles.length === 0 && allFiles.length > 0) {
          alert('Please drop PDF files only. The dropped files are not PDFs.');
          return;
        }
        
        if (pdfFiles.length < allFiles.length) {
          alert(`${allFiles.length - pdfFiles.length} non-PDF file(s) were ignored. Only PDF files are supported.`);
        }
        
        // Add to existing files instead of replacing
        setSelectedFiles((prev) => {
          const newFiles = [...prev, ...pdfFiles];
          console.log('Files dropped:', newFiles.map(f => f.name));
          return newFiles;
        });
      }
    },
    []
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const allFiles = Array.from(e.target.files);
        const pdfFiles = allFiles.filter(
          (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );
        
        if (pdfFiles.length === 0 && allFiles.length > 0) {
          alert('Please select PDF files only. The selected files are not PDFs.');
          e.target.value = '';
          return;
        }
        
        if (pdfFiles.length < allFiles.length) {
          alert(`${allFiles.length - pdfFiles.length} non-PDF file(s) were ignored. Only PDF files are supported.`);
        }
        
        // Add to existing files instead of replacing
        setSelectedFiles((prev) => {
          const newFiles = [...prev, ...pdfFiles];
          console.log('✅ Files selected - adding to state:', pdfFiles.map(f => f.name));
          console.log('✅ Total files after add:', newFiles.length);
          // Force immediate update
          setTimeout(() => {
            console.log('✅ State should be updated now');
          }, 0);
          return newFiles;
        });
        
        // Reset input so same file can be selected again
        e.target.value = '';
      }
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length > 0) {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onUpload]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20">
      <div className="max-w-4xl mx-auto p-8 pb-16">
        {/* Hero section - Hide when files are selected to save space */}
        {uploadedFiles.length === 0 && selectedFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl">
                  <Sparkles className="text-white" size={48} />
                </div>
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent mb-3">
              Upload Clinical Protocol Documents
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Drag and drop your PDF files or click to browse
            </p>
          </motion.div>
        )}

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-105 shadow-2xl'
                : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
            }`}
          >
            <motion.div
              animate={dragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload
                className={`mx-auto mb-3 ${
                  dragActive
                    ? 'text-blue-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
                size={48}
              />
            </motion.div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {dragActive ? 'Drop files here' : 'Upload Clinical Protocol PDFs'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop PDF files here, or click to select
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={handleFileInput}
            />
            <label htmlFor="file-upload">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium cursor-pointer hover:shadow-lg transition-shadow"
              >
                Select Files
              </motion.div>
            </label>
          </div>
        </motion.div>

        {/* Selected Files Section - Outside upload area to prevent cutoff */}
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <div className="space-y-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-2xl p-5 border-4 border-blue-400 dark:border-blue-600 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      Selected Files ({selectedFiles.length})
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}-${file.size}`}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <FileText className="text-blue-500" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 p-1.5 rounded-lg transition-colors ml-2"
                        aria-label="Remove file"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={handleUpload}
                  disabled={isLoading || selectedFiles.length === 0}
                  whileHover={{ scale: isLoading || selectedFiles.length === 0 ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading || selectedFiles.length === 0 ? 1 : 0.98 }}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
                    </>
                  )}
                </motion.button>
            </div>
          </motion.div>
        )}

        {/* Uploaded files section */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Documents Uploaded Successfully
                </h3>
              </div>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="text-green-600 dark:text-green-400" size={18} />
                      <span className="text-sm text-green-800 dark:text-green-200">
                        {file.fileName}
                      </span>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                      {file.pages} pages
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-4">
                ✓ You can now switch to the Chat tab to ask questions about the protocol.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

