'use client';

import { useState } from 'react';
import { generateFuclaudeUrl, copyToClipboard } from '../lib/utils';

export default function AccountListItem({
  account,
  onUpdateSessionKey,
  onToggleStatus,
  onEdit,
  onDelete,
  apiUrl
}) {
  const [isEditingSessionKey, setIsEditingSessionKey] = useState(false);
  const [sessionKey, setSessionKey] = useState(account.sessionKey);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isHovering, setIsHovering] = useState(false);

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

  const handleCopySessionKey = async () => {
    const success = await copyToClipboard(account.sessionKey);
    if (success) {
      setToastMessage('会话密钥已复制到剪贴板');
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    const url = generateFuclaudeUrl(account.sessionKey, apiUrl);
    const success = await copyToClipboard(url);
    if (success) {
      setToastMessage('链接已复制到剪贴板');
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleVisitFuclaude = () => {
    const url = generateFuclaudeUrl(account.sessionKey, apiUrl);
    window.open(url, '_blank');
  };

  return (
    <tr
      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-9 h-9 bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-medium transition-transform duration-300 group-hover:scale-110">
          {account.id}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-base font-medium text-gray-900 dark:text-gray-100">{account.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{account.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2 max-w-md">
          <div className="flex-1 overflow-hidden">
            <code
              onClick={handleCopySessionKey}
              className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-900/80 px-3 py-2 rounded-xl border border-gray-200/50 dark:border-gray-800/50 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition-colors duration-200 block truncate"
            >
              {account.sessionKey}
            </code>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleCopySessionKey}
              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 rounded-full transition-all duration-200"
              aria-label="复制会话密钥"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => onToggleStatus(account.id)}
          className={`flex items-center px-3 py-1.5 rounded-full transition-all duration-300 ${
            account.isActive
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
          }`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${account.isActive ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-500'}`}></div>
          <span className="text-xs font-medium">{account.isActive ? '已生效' : '已失效'}</span>
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleVisitFuclaude}
            className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 rounded-xl transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            访问
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              aria-label="复制链接"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(account)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              aria-label="编辑"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(account.id)}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              aria-label="删除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </td>

      {showCopiedToast && (
        <div className="fixed bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg text-gray-900 dark:text-white px-4 py-2.5 rounded-xl shadow-lg animate-fade-in-up">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {toastMessage}
          </div>
        </div>
      )}
    </tr>
  );
}