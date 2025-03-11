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
      const nextNumber = accounts.length +1;
      
      setFormData(prev => ({
        ...prev,
        name: nextNumber.toString(),
      }));
    }
  }, [account, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      
      onClose();
    } catch (err) {
      console.error('Error saving account:', err);
      setError('Failed to save account. Please try again.');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  账号名称
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  sessionKey
                </label>
                <input
                  type="text"
                  name="sessionKey"
                  value={formData.sessionKey}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  placeholder="sk-ant-sid01......"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={isViewOnly || mode === 'edit'}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  账号启用
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isViewOnly ? '关闭' : '取消'}
              </button>
              
              {!isViewOnly && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
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