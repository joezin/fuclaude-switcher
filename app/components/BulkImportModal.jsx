'use client';

import { useState, useEffect } from 'react';
import { bulkImportAccounts } from '../lib/accountService';

export default function BulkImportModal({ isOpen, onClose, onImportComplete }) {
  const [importText, setImportText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateClose, setAnimateClose] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setImportText('');
      setFile(null);
      setError('');
      setAnimateClose(false);
    }
  }, [isOpen]);

  const handleTextImport = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      let accounts;
      try {
        accounts = JSON.parse(importText);
      } catch (e) {
        throw new Error('无效的JSON格式');
      }

      const results = await bulkImportAccounts(accounts);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      onImportComplete();
      handleCloseWithAnimation();
      
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
    const selectedFile = e.target.files ? e.target.files[0] : e;
    if (!selectedFile) return;
    setFile(selectedFile);

    try {
      setIsLoading(true);
      setError('');
      
      const text = await selectedFile.text();
      let accounts;
      try {
        accounts = JSON.parse(text);
      } catch (e) {
        throw new Error('文件中的JSON格式无效');
      }
      const results = await bulkImportAccounts(accounts);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      onImportComplete();
      handleCloseWithAnimation();
      
      if (failed > 0) {
        throw new Error(`导入完成：${successful} 个成功，${failed} 个失败`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/json') {
      await handleFileImport(droppedFile);
    } else {
      setError('请上传有效的JSON文件');
    }
  };

  const handleCloseWithAnimation = () => {
    setAnimateClose(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div
        className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full p-6 shadow-2xl transition-all duration-300 ease-out ${
          animateClose ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">批量导入账号</h3>
          <button
            onClick={handleCloseWithAnimation}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 ${
              dragOver
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                : 'bg-gray-50 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg className={`w-12 h-12 mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
              拖放JSON文件到此处，或者
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                disabled={isLoading}
              />
              <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors duration-200">
                选择文件
              </span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              支持JSON格式文件导入
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">或直接粘贴JSON文本</span>
            </div>
          </div>

          <div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">
                JSON文本
              </label>
              <div className="relative rounded-xl overflow-hidden group-focus-within:ring-2 group-focus-within:ring-blue-500 dark:group-focus-within:ring-blue-400 transition-all duration-200">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='[{
  "account": "example@outlook.com",
  "pwd": "password",
  "cookie": "session-key"
}]'
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-700/70 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-colors duration-200 font-mono text-sm"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                请确保JSON格式正确，每个账号需包含account、pwd和cookie字段
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl animate-fade-in" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCloseWithAnimation}
              className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-all duration-200"
              disabled={isLoading}
            >
              取消
            </button>
            <button
              onClick={handleTextImport}
              disabled={!importText.trim() || isLoading}
              className="px-5 py-2.5 bg-blue-600 border border-transparent rounded-xl shadow-sm shadow-blue-500/30 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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