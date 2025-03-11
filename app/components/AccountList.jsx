'use client';

import { useState, useEffect } from 'react';
import { getAccounts, updateSessionKey, toggleAccountStatus, deleteAccount, refreshPrefix } from '../lib/accountService';
import AccountCard from './AccountCard';
import AccountModal from './AccountModal';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, accountId: null });
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    // Load accounts when component mounts
    refreshAccounts();
    
    // Check if we're on mobile
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const refreshAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSessionKey = async (id, newSessionKey) => {
    try {
      await updateSessionKey(id, newSessionKey);
      await refreshAccounts();
      showToast('会话密钥更新成功');
    } catch (err) {
      console.error('Error updating session key:', err);
      setError('Failed to update session key. Please try again.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleAccountStatus(id);
      await refreshAccounts();
      const account = accounts.find(a => a.id === id);
      showToast(`账号${account.isActive ? '停用' : '启用'}成功`);
    } catch (err) {
      console.error('Error toggling account status:', err);
      setError('Failed to update account status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    setConfirmDialog({ isOpen: true, accountId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccount(confirmDialog.accountId);
      await refreshAccounts();
      showToast('账号删除成功');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setConfirmDialog({ isOpen: false, accountId: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, accountId: null });
  };

  const handleEdit = (account) => {
    setCurrentAccount(account);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentAccount(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };

  const handleRefreshPrefix = async (id) => {
    try {
      await refreshPrefix(id);
      await refreshAccounts();
      showToast('前缀URL刷新成功');
    } catch (err) {
      console.error('Error refreshing prefix:', err);
      setError('Failed to refresh prefix. Please try again.');
    }
  };

  // Show accounts
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-row justify-between items-center gap-4 mb-8">
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">总账号数</h2>
            <div className="ml-3 bg-blue-500/10 dark:bg-blue-500/20 px-3 py-1 rounded-full">
              <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">{accounts.length}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">管理您的 Fuclaude 账号</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-4 py-2.5 rounded-lg font-medium text-sm text-white shadow-md shadow-blue-900/20 hover:shadow-blue-800/30 group flex items-center flex-shrink-0"
        >
          <span className="mr-1.5 text-lg transition-transform duration-300 group-hover:rotate-90">+</span> 
          添加账号
        </button>
      </div>
      
      {error && accounts.length === 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium">{error}</p>
            </div>
            <button
              onClick={refreshAccounts}
              className="inline-flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-800/50 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200"
            >
              重试
            </button>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="relative">
            <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      )}

      {!isLoading && accounts.length === 0 ? (
        <EmptyState onAddAccount={handleCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              onToggleStatus={handleToggleStatus}
              onUpdateSessionKey={handleUpdateSessionKey}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onRefreshPrefix={handleRefreshPrefix}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AccountModal
          account={currentAccount}
          mode={modalMode}
          onClose={handleCloseModal}
          onSave={async () => {
            await refreshAccounts();
            showToast(`账号${modalMode === 'create' ? '创建' : '更新'}成功`);
            handleCloseModal();
          }}
          accounts={accounts}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认删除"
        message="确定要删除这个账号吗？此操作无法撤销。"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {toast.message && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' 
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white' 
              : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300'
          }`}>
            <div className="flex items-center space-x-2">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 