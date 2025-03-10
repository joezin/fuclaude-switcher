'use client';

import { useState } from 'react';
import { generateFuclaudeUrl, copyToClipboard } from '../lib/utils';

export default function AccountCard({ 
  account, 
  onUpdateSessionKey, 
  onToggleStatus, 
  onEdit, 
  onDelete 
}) {
  const [isEditingSessionKey, setIsEditingSessionKey] = useState(false);
  const [sessionKey, setSessionKey] = useState(account.sessionKey);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleSessionKeyChange = (e) => {
    setSessionKey(e.target.value);
  };

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

  const handleCopyLink = async () => {
    const url = generateFuclaudeUrl(account.sessionKey);
    const success = await copyToClipboard(url);
    if (success) {
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleVisitFuclaude = () => {
    const url = generateFuclaudeUrl(account.sessionKey);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{account.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{account.email}</p>
        </div>
        <button
          onClick={() => onToggleStatus(account.id)}
          className={`px-3 py-1 text-xs rounded-full ${
            account.isActive
              ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800 dark:bg-green-800 dark:text-green-100 dark:hover:bg-red-800 dark:hover:text-red-100'
              : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800 dark:bg-red-800 dark:text-red-100 dark:hover:bg-green-800 dark:hover:text-green-100'
          }`}
        >
          {account.isActive ? '已生效' : '已失效'}
        </button>
      </div>
      
      <div className="mb-3">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">会话密钥</div>
        {isEditingSessionKey ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={sessionKey}
              onChange={handleSessionKeyChange}
              onKeyDown={handleSessionKeyKeyDown}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <button
              onClick={handleSessionKeySubmit}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1"
            >
              ✓
            </button>
            <button
              onClick={handleSessionKeyCancel}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm truncate mr-2">{account.sessionKey}</span>
            <button
              onClick={() => setIsEditingSessionKey(true)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
            >
              ✎
            </button>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <button
            onClick={handleVisitFuclaude}
            className="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-md"
          >
            访问fuclaude
          </button>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md"
          >
            复制链接
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(account)}
            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50"
            title="编辑"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
            title="删除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {showCopiedToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
          链接已复制到剪贴板
        </div>
      )}
    </div>
  );
} 