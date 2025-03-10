'use client';

import { useState } from 'react';

export default function AccountCard({ 
  account, 
  onUpdateSessionKey, 
  onToggleStatus, 
  onViewDetails, 
  onEdit, 
  onDelete 
}) {
  const [isEditingSessionKey, setIsEditingSessionKey] = useState(false);
  const [sessionKey, setSessionKey] = useState(account.sessionKey);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{account.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{account.email}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            account.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}
        >
          {account.isActive ? '有效' : '无效'}
        </span>
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
            onClick={() => onToggleStatus(account.id)}
            className={`px-3 py-1 text-xs rounded-md ${
              account.isActive
                ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
            }`}
          >
            {account.isActive ? '停用' : '启用'}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(account)}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md"
          >
            详情
          </button>
          <button
            onClick={() => onEdit(account)}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-md"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="px-3 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 rounded-md"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
} 