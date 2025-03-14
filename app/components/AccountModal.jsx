'use client';

import { useState, useEffect } from 'react';
import { createAccount, updateAccount } from '../lib/accountService';
import { generateRandomString } from '../lib/utils';

export default function AccountModal({ account, mode, onClose, onSave, accounts }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sessionKey: '',
    prefixUrl: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [animateClose, setAnimateClose] = useState(false);

  useEffect(() => {
    if (account && (mode === 'view' || mode === 'edit')) {
      setFormData({
        name: account.name,
        email: account.email,
        sessionKey: account.sessionKey,
        prefixUrl: account.prefixUrl,
        isActive: true
      });
    } else if (mode === 'create') {
      const nextNumber = accounts.length + 1;
      
      setFormData(prev => ({
        ...prev,
        name: nextNumber.toString(),
      }));
    }
  }, [account, mode, accounts]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCloseWithAnimation = () => {
    setAnimateClose(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const updatedFormData = {
        ...formData,
        prefixUrl: generateRandomString(4),
        isActive: true
      };

      if (mode === 'create') {
        await createAccount(updatedFormData);
      } else if (mode === 'edit' && account) {
        await updateAccount(account.id, updatedFormData);
      }
      
      if (onSave) {
        await onSave();
      }
      
      handleCloseWithAnimation();
    } catch (err) {
      console.error('Error saving account:', err);
      setError('保存账号失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isViewOnly = mode === 'view';
  const title = {
    'view': '账号详情',
    'edit': '编辑账号',
    'create': '创建新账号'
  }[mode];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
      <div
        className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${
          animateClose ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">{title}</h2>
            <button
              onClick={handleCloseWithAnimation}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 animate-fade-in" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">
                  账号名称
                </label>
                <div className="relative rounded-xl overflow-hidden group-focus-within:ring-2 group-focus-within:ring-blue-500 dark:group-focus-within:ring-blue-400 transition-all duration-200">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-700/70 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-colors duration-200"
                    required
                    placeholder="请输入账号名称"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">
                  邮箱
                </label>
                <div className="relative rounded-xl overflow-hidden group-focus-within:ring-2 group-focus-within:ring-blue-500 dark:group-focus-within:ring-blue-400 transition-all duration-200">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-700/70 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-colors duration-200"
                    required
                    placeholder="请输入账号邮箱"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-200">
                  会话密钥
                </label>
                <div className="relative rounded-xl overflow-hidden group-focus-within:ring-2 group-focus-within:ring-blue-500 dark:group-focus-within:ring-blue-400 transition-all duration-200">
                  <input
                    type="text"
                    name="sessionKey"
                    value={formData.sessionKey}
                    onChange={handleChange}
                    disabled={isViewOnly}
                    placeholder="sk-ant-sid01......"
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-700/70 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-colors duration-200 font-mono"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isViewOnly || mode === 'edit'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 dark:peer-focus:ring-blue-800/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    账号启用
                  </span>
                </label>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseWithAnimation}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-all duration-200"
              >
                {isViewOnly ? '关闭' : '取消'}
              </button>
              
              {!isViewOnly && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 shadow-sm shadow-blue-500/30 transition-all duration-200 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      保存中...
                    </div>
                  ) : (
                    '保存'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}