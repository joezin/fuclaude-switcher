import { useState, useEffect } from 'react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isLoading }) {
  const [animateClose, setAnimateClose] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimateClose(false);
    } else if (visible) {
      setAnimateClose(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, visible]);

  if (!visible) return null;

  const handleCancel = () => {
    if (isLoading) return;
    setAnimateClose(true);
    setTimeout(() => {
      onCancel();
    }, 200);
  };

  return (
    <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
      animateClose ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full transition-all duration-300 ${
        animateClose ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <div className="p-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {message}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-5 py-2.5 bg-red-600 border border-transparent rounded-xl shadow-sm shadow-red-500/30 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  删除中...
                </div>
              ) : (
                '确认删除'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}