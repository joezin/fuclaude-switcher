'use client';

import { useState } from 'react';
import { generateFuclaudeUrl, copyToClipboard } from '../lib/utils';

export default function AccountCard({
  account,
  onUpdateSessionKey,
  onToggleStatus,
  onEdit,
  onDelete,
  onRefreshPrefix,
  index,
  apiUrl,
}) {
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const handleCopySessionKey = async () => {
    const success = await copyToClipboard(account.sessionKey);
    if (success) {
      setShowCopiedToast(true);
      setToastMessage('会话密钥已复制到剪贴板');
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    const url = generateFuclaudeUrl(account.sessionKey, apiUrl);
    const success = await copyToClipboard(url);
    if (success) {
      setShowCopiedToast(true);
      setToastMessage('链接已复制到剪贴板');
      setTimeout(() => setShowCopiedToast(false), 2000);
    }
  };

  const handleVisitFuclaude = () => {
    const url = generateFuclaudeUrl(account.sessionKey, apiUrl);
    window.open(url, '_blank');
  };

  return (
    <div
      className="bg-white/85 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 mb-5 overflow-hidden transition-all duration-300 group hover:shadow-md hover:-translate-y-0.5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-medium mr-4 group-hover:scale-105 transition-all duration-300 ease-out">
            {index + 1}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 max-w-[120px] truncate">{account.email}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
        <div className={`flex items-center px-3 py-1 rounded-full ${
          account.isActive
            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${account.isActive ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-500'}`}></div>
          <span className="text-xs font-medium">{account.isActive ? '已生效' : '已失效'}</span>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <div className="group/key flex bg-gray-50/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-blue-200/50 dark:hover:border-blue-800/50">
          <div
            onClick={handleCopySessionKey}
            className="flex-1 p-3.5 overflow-hidden cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <code className="font-mono text-sm text-gray-600 dark:text-gray-400 overflow-hidden overflow-ellipsis whitespace-nowrap block">
              {account.sessionKey}
            </code>
          </div>
          <button
            onClick={handleCopySessionKey}
            className="px-3.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50/70 dark:hover:bg-blue-900/30 transition-all duration-200 rounded-r-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400"
            aria-label="复制会话密钥"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 overflow-hidden">
        <button
          onClick={handleVisitFuclaude}
          className="bg-white/90 dark:bg-gray-900/90 py-4 text-center font-medium text-blue-600 dark:text-blue-400 transition-colors duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center group/btn"
        >
          <svg className="w-4 h-4 mr-2 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">访问fuclaude</span>
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-white/90 dark:bg-gray-900/90 py-4 text-center font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex items-center justify-center group/btn border-l border-gray-100 dark:border-gray-800/50"
        >
          <svg className="w-4 h-4 mr-2 transition-transform duration-300 ease-out group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          复制链接
        </button>
      </div>

      <div className="flex justify-end py-3 px-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200/40 dark:border-gray-800/40">
        <div className="flex space-x-1">
          <button
            onClick={() => onRefreshPrefix(account.id)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
            aria-label="刷新前缀URL"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => onToggleStatus(account.id)}
            className={`p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 ${
              account.isActive
                ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'
            }`}
            aria-label="切换状态"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(account)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
            aria-label="编辑"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
            aria-label="删除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

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
    </div>
  );
}
