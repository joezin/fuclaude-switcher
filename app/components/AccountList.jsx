'use client';

import { useState, useEffect } from 'react';
import { getAccounts, updateSessionKey, toggleAccountStatus, deleteAccount, seedDatabase } from '../lib/accountService';
import AccountListItem from './AccountListItem';
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

  const handleSeedDatabase = async () => {
    try {
      setIsLoading(true);
      await seedDatabase();
      await refreshAccounts();
      showToast('数据初始化成功');
    } catch (err) {
      console.error('Error seeding database:', err);
      setError('Failed to seed database. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && accounts.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">账号管理</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              添加账号
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && accounts.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">账号管理</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              添加账号
            </button>
            <button
              onClick={handleSeedDatabase}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              初始化数据
            </button>
          </div>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={refreshAccounts}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          重试
        </button>
      </div>
    );
  }

  // Show empty state
  if (accounts.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">账号管理</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              添加账号
            </button>
            <button
              onClick={handleSeedDatabase}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              初始化数据
            </button>
          </div>
        </div>
        <EmptyState onAddAccount={handleCreate} />
      </div>
    );
  }

  // Show accounts
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">账号管理</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            添加账号
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center items-center h-12 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            onToggleStatus={handleToggleStatus}
            onUpdateSessionKey={handleUpdateSessionKey}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

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
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认删除"
        message="确定要删除这个账号吗？此操作无法撤销。"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
} 