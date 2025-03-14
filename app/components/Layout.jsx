'use client';

import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [isMobileView, setIsMobileView] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    // Initial check
    checkIfMobile();
    updateWindowHeight();
    
    // Add listeners
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('resize', updateWindowHeight);
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('resize', updateWindowHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 计算 main 元素的最小高度，减去 header 和 footer 的高度
  const mainMinHeight = windowHeight ? `${windowHeight - 120}px` : 'calc(100vh - 120px)';

  return (
    <div className="min-h-screen flex flex-col ">
      <main style={{ minHeight: mainMinHeight }} className="flex-grow lg:pt-6 ">
        <div className={`max-w-7xl mx-auto transition-all duration-500 ease-out ${isMobileView ? 'px-0' : 'px-4'}`}>
          {children}
        </div>
      </main>
      
      <footer className={`mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5 flex justify-center items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Fuclaude 账号管理系统
            </span>
            <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              简洁 · 高效 · 安全
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}