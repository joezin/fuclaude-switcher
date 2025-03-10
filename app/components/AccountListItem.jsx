'use client';

import { useState } from 'react';
import { generateFuclaudeUrl, copyToClipboard } from '../lib/utils';

export default function AccountListItem({ 
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
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {account.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {account.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {account.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {isEditingSessionKey ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={sessionKey}
              onChange={handleSessionKeyChange}
              onKeyDown={handleSessionKeyKeyDown}
              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <button
              onClick={handleSessionKeySubmit}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              ✓
            </button>
            <button
              onClick={handleSessionKeyCancel}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="font-mono">{account.sessionKey}</span>
            <button
              onClick={() => setIsEditingSessionKey(true)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ✎
            </button>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={() => onToggleStatus(account.id)}
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            account.isActive
              ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800 dark:bg-green-800 dark:text-green-100 dark:hover:bg-red-800 dark:hover:text-red-100'
              : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800 dark:bg-red-800 dark:text-red-100 dark:hover:bg-green-800 dark:hover:text-green-100'
          }`}
        >
          {account.isActive ? '已生效' : '已失效'}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={handleVisitFuclaude}
            className="text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
          >
            访问fuclaude
          </button>
          <button
            onClick={handleCopyLink}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded"
          >
            复制链接
          </button>
          <button
            onClick={() => onEdit(account)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          >
            编辑
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            删除
          </button>
        </div>
      </td>

      {showCopiedToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
          链接已复制到剪贴板
        </div>
      )}
    </tr>
  );
} 