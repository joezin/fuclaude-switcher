'use client';

import { useState } from 'react';
import { bulkImportAccounts } from '../lib/accountService';

export default function BulkImportModal({ isOpen, onClose, onImportComplete }) {
  const [importText, setImportText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextImport = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      let accounts;
      try {
        accounts = JSON.parse(importText);
      } catch (e) {
        throw new Error('Invalid JSON format');
      }

      const results = await bulkImportAccounts(accounts);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      onImportComplete();
      onClose();
      
      // The parent component will show this message in its toast
      if (failed > 0) {
        throw new Error(`导入完成：${successful} 个成功，${failed} 个失败`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError('');
      
      const text = await file.text();
      let accounts;
      try {
        accounts = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON format in file');
      }
      const results = await bulkImportAccounts(accounts);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      onImportComplete();
      onClose();
      
      if (failed > 0) {
        throw new Error(`导入完成：${successful} 个成功，${failed} 个失败`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">批量导入账号</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文件导入
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                dark:file:bg-blue-900/50 dark:file:text-blue-300
                hover:file:bg-blue-100 dark:hover:file:bg-blue-900
                transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">或</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              文本导入
            </label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='[{
  "account": "example@outlook.com",
  "pwd": "password",
  "cookie": "session-key"
}]'
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                transition-colors duration-200"
              disabled={isLoading}
            >
              取消
            </button>
            <button
              onClick={handleTextImport}
              disabled={!importText.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  导入中...
                </>
              ) : (
                '导入'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 