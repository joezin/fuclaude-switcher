import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!message || !isVisible) return null;

  return (
    <div className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ease-out transform ${
      isExiting ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
    }`}>
      <div className={`backdrop-blur-xl ${
        type === 'success'
          ? 'bg-white/80 dark:bg-gray-800/90 border-green-200 dark:border-green-800/40'
          : 'bg-white/80 dark:bg-gray-800/90 border-red-200 dark:border-red-800/40'
      } px-4 py-3 rounded-2xl shadow-lg border flex items-center max-w-xs sm:max-w-sm`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${
          type === 'success'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400'
        } flex items-center justify-center mr-3`}>
          {type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`font-medium ${
            type === 'success'
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="ml-3 flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// 在你的全局CSS中添加这些动画，或者在Tailwind配置中定义
// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(1rem);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-up {
//   animation: fadeInUp 0.3s ease-out;
// }