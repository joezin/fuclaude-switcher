'use client';

import { useState } from 'react';
import { generateFuclaudeUrl, copyToClipboard } from '../lib/utils';

export default function AccountCard({ 
  account, 
  onUpdateSessionKey, 
  onToggleStatus, 
  onEdit, 
  onDelete,
  onRefreshPrefix ,
  index
}) {
  const [sessionKey, setSessionKey] = useState(account.sessionKey);
  const [showCopiedToast, setShowCopiedToast] = useState(false);


  const handleSessionKeySubmit = () => {
    onUpdateSessionKey(account.id, sessionKey);
    setIsEditingSessionKey(false);
  };

  const handleSessionKeyCancel = () => {
    setSessionKey(account.sessionKey);
    setIsEditingSessionKey(false);
  };

  const handleSessionKeyKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSessionKeySubmit();
    } else if (e.key === 'Escape') {
      handleSessionKeyCancel();
    }
  };

  const handleCopySessionKey = async () => {
    const url = generateFuclaudeUrl(account.sessionKey, account.prefixUrl);
    const success = await copyToClipboard(url);
    if (success) {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleVisitFuclaude = () => {
    const url = generateFuclaudeUrl(account.sessionKey, account.prefixUrl);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 mb-5 overflow-hidden hover:border-gray-300/50 dark:hover:border-gray-700/50 transition-all duration-300 group">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center font-bold mr-3 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors duration-300">
            {index + 1}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 max-w-[160px] truncate">{account.email}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {(() => {
                const date = new Date(account.updatedAt);
                // 添加8小时的毫秒数
                const utc8Date = new Date(date.getTime() + (8 * 60 * 60 * 1000));
                return utc8Date.toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: false
                });
              })()}
            </p>
          </div>
        </div>
        <div className={`flex items-center ${
          account.isActive
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${account.isActive ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-500'}`}></div>
          <span className="text-xs font-medium">{account.isActive ? '已生效' : '已失效'}</span>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        <div className="flex bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200/70 dark:border-gray-800/70 group-hover:border-gray-300/70 dark:group-hover:border-gray-700/70 transition-all duration-300">
          <div 
            onClick={handleCopySessionKey}
            className="flex-1 p-3 overflow-hidden cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-900/50 transition-colors duration-200"
          >
            <code className="font-mono text-sm text-gray-600 dark:text-gray-400 overflow-hidden overflow-ellipsis whitespace-nowrap block">
              {account.sessionKey}
            </code>
          </div>
          <button
            onClick={handleCopySessionKey}
            className="px-3 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 rounded-r-lg focus:outline-none focus:bg-blue-100/30 dark:focus:bg-blue-900/30"
            aria-label="Copy session key"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800">
        <button
          onClick={handleVisitFuclaude}
          className="bg-white hover:bg-blue-600 dark:bg-gray-900 dark:hover:bg-blue-600 py-3.5 text-center font-medium transition-colors duration-300 text-gray-700 hover:text-white dark:text-gray-200 dark:hover:text-white flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          访问fuclaude
        </button>
        <button
          onClick={handleCopySessionKey}
          className="bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 py-3.5 text-center font-medium transition-colors duration-300 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          复制链接
        </button>
      </div>

      <div className="flex justify-end bg-white/70 dark:bg-gray-900/70 px-3 py-2 border-t border-gray-200/50 dark:border-gray-800/50">
        <button
          onClick={() => onRefreshPrefix(account.id)}
          className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 rounded transition-colors duration-200 mr-1"
          aria-label="Refresh Prefix URL"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={() => onToggleStatus(account.id)}
          className={`p-2 rounded transition-colors duration-200 mr-1 ${
            account.isActive
              ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
          }`}
          aria-label="Toggle Status"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
        <button
          onClick={() => onEdit(account)}
          className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 rounded transition-colors duration-200 mr-1"
          aria-label="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(account.id)}
          className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 rounded transition-colors duration-200"
          aria-label="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {showCopiedToast && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded shadow-lg">
          链接已复制到剪贴板
        </div>
      )}
    </div>
  );
} 