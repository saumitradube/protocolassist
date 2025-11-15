/** File upload area component. */
import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadAreaProps {
  onUpload: (files: File[]) => Promise<void>;
  isLoading: boolean;
  uploadedFiles?: Array<{ fileName: string; pages: number }>;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onUpload,
  isLoading,
  uploadedFiles = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
        const files = Array.from(e.dataTransfer.files).filter((file) =>
          file.type === 'application/pdf'
        );
        setSelectedFiles(files);
      }
    },
    []
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files).filter((file) =>
          file.type === 'application/pdf'
        );
        setSelectedFiles(files);
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

  if (uploadedFiles.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText className="text-green-600 dark:text-green-400" size={20} />
          <h3 className="font-semibold text-green-900 dark:text-green-100">
            Protocol Uploaded Successfully
          </h3>
        </div>
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="text-sm text-green-800 dark:text-green-200"
            >
              • {file.fileName} ({file.pages} pages)
            </div>
          ))}
        </div>
        <p className="text-sm text-green-700 dark:text-green-300 mt-3">
          You can now ask questions about the protocol.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
        }`}
      >
        <Upload
          className={`mx-auto mb-4 ${
            dragActive
              ? 'text-primary-500'
              : 'text-gray-400 dark:text-gray-500'
          }`}
          size={48}
        />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Clinical Protocol PDFs
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
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
        <label
          htmlFor="file-upload"
          className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors"
        >
          Select Files
        </label>

        {selectedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected Files:
            </p>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

