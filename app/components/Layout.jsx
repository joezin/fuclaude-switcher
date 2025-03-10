'use client';

import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [isMobileView, setIsMobileView] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    // Initial check
    checkIfMobile();
    updateWindowHeight();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('resize', updateWindowHeight);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  // 计算 main 元素的最小高度，减去 header 和 footer 的高度
  // header 高度为 64px (h-16)，footer 大约 60px，再加上一些边距
  const mainMinHeight = windowHeight ? `${windowHeight - 140}px` : 'calc(100vh - 140px)';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">账号管理系统</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main style={{ minHeight: mainMinHeight }} className="flex-grow">
        <div className={`max-w-7xl mx-auto py-6 ${isMobileView ? 'px-4' : 'sm:px-6 lg:px-8'}`}>
          {children}
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} 账号管理系统
          </div>
        </div>
      </footer>
    </div>
  );
} 