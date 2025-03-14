'use client';

import { useState } from 'react';

export default function EmptyState({ onAddAccount }) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div
      className="text-center py-16 px-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-700/40 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`mx-auto h-24 w-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 transition-transform duration-500 ease-out ${isHovering ? 'scale-110' : 'scale-100'}`}>
        <svg
          className="h-14 w-14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 className="mt-6 text-xl font-medium text-gray-900 dark:text-white">暂无账号</h3>
      <p className="mt-2 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        创建您的第一个账号开始使用Fuclaude账号管理系统。
      </p>
      <div className="mt-8">
        <button
          onClick={onAddAccount}
          className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 group"
        >
          <span className="relative inline-flex items-center">
            <span className={`absolute transition-transform duration-300 ${isHovering ? 'scale-0' : 'scale-100'}`}>
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className={`transition-all duration-300 ${isHovering ? 'pl-0' : 'pl-7'}`}>
              添加账号
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}