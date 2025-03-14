'use client';

import { useState, useEffect } from 'react';
import { getAccounts, updateSessionKey, toggleAccountStatus, deleteAccount, refreshPrefix } from '../lib/accountService';
import AccountCard from './AccountCard';
import AccountModal from './AccountModal';
import EmptyState from './EmptyState';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';
import BulkImportModal from './BulkImportModal';

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, accountId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [useCommonDomain, setUseCommonDomain] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

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

  useEffect(() => {
    // Filter accounts when search query or accounts change
    if (!accounts) return;
    
    const filtered = accounts.filter(account => 
      account.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      account.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.sessionKey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.apiPrefix?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredAccounts(filtered);
  }, [searchQuery, accounts]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const refreshAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      setFilteredAccounts(data);
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
      setIsDeleting(true);
      await deleteAccount(confirmDialog.accountId);
      await refreshAccounts();
      showToast('账号删除成功');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
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

  const handleBulkImport = () => {
    setIsBulkImportModalOpen(true);
  };

  const handleToggleDomainType = () => {
    setUseCommonDomain(!useCommonDomain);
    showToast(`已切换至${!useCommonDomain ? '通用' : '隔离'}域名模式`);
  };

  const getApiUrl = (account) => {
    if (useCommonDomain) {
      return `https://demo.fuclaude.com`;
    } else {
      return `https://${account.apiPrefix||'default'}.fuclaude.oaifree.com`;
    }
  };

  // Show accounts
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-5 mb-8">
        {/* 标题和账号信息行 */}
        <div className="flex flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex items-center">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">总账号数</h2>
            <div className="ml-3 bg-blue-500/10 dark:bg-blue-500/20 px-4 py-1.5 rounded-full flex items-center">
              <span className="text-xl font-semibold text-blue-600 dark:text-blue-400">{accounts.length}</span>
              <span className="ml-1 text-sm text-blue-500 dark:text-blue-300">个</span>
            </div>
          </div>
          <div className="flex relative justify-end  sm:w-64">
            {isSearchVisible ? (
              <div className="w-32 relative group animate-fade-in">
                <input
                  type="search"
                  id="search"
                  className="block w-full p-3 text-base text-gray-900 dark:text-gray-100 border border-gray-200/70 dark:border-gray-700/70 rounded-xl bg-gray-50/70 dark:bg-gray-900/70 focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 backdrop-blur-sm transition-all duration-200"
                  placeholder="搜索账号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!searchQuery) {
                      setIsSearchVisible(false);
                    }
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchVisible(true);
                }}
                className=" p-3 rounded-xl bg-gray-50/70 dark:bg-gray-900/70 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 border border-gray-200/70 dark:border-gray-700/70 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 flex items-center justify-center"
                title="搜索账号"
              >
                <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 搜索和操作按钮行 */}
        <div className="flex flex-row gap-4  items-center">
          {/* 搜索框 */}
          

            <div className="flex items-center  sm:flex-none bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur-sm py-2 px-4 rounded-xl border border-gray-200/70 dark:border-gray-700/70">
              <label className="inline-flex relative items-center cursor-pointer mx-1">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={useCommonDomain}
                  onChange={handleToggleDomainType}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300/30 dark:peer-focus:ring-blue-800/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border dark:after:border-gray-600 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
              </label>
              <span className={`text-sm mr-2 whitespace-nowrap transition-colors text-gray-500 dark:text-gray-400`}>{useCommonDomain ? '通用域名' : '隔离域名'}</span>
            </div>
            
            {/* 按钮组 */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkImport}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 text-white shadow-sm shadow-emerald-900/10 hover:shadow-lg hover:shadow-emerald-800/20 flex items-center justify-center group"
                title="批量导入"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
              <button
                onClick={handleCreate}
                className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white shadow-sm shadow-blue-900/10 hover:shadow-lg hover:shadow-blue-800/20 flex items-center justify-center group"
                title="添加账号"
              >
                <svg className="w-5 h-5 transition-transform duration-300 ease-out group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
                </svg>
              </button>
            </div>
          </div>
      </div>
      
      {error && accounts.length === 0 && (
        <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl relative mb-8 animate-fade-in" role="alert">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-base">{error}</p>
              <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">请检查网络连接并尝试重新加载</p>
            </div>
            <button
              onClick={refreshAccounts}
              className="flex-shrink-0 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-sm shadow-red-800/10"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重试
            </button>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 rounded-full absolute border-4 border-gray-200/60 dark:border-gray-700/60"></div>
            <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-blue-500 border-t-transparent"></div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 animate-pulse">加载账号数据...</p>
        </div>
      )}

      {!isLoading && accounts.length === 0 ? (
        <EmptyState onAddAccount={handleCreate} />
      ) : !isLoading && filteredAccounts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/90 dark:bg-gray-800/90 rounded-2xl border border-gray-200/40 dark:border-gray-700/40 backdrop-blur-sm shadow-sm">
          <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-gray-100">无搜索结果</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            没有找到与 "<span className="text-blue-600 dark:text-blue-400 font-medium">{searchQuery}</span>" 匹配的账号，请尝试其他搜索关键词。
          </p>
          <div className="mt-8">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-200"
              onClick={() => setSearchQuery('')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              清除搜索
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredAccounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              onToggleStatus={handleToggleStatus}
              onUpdateSessionKey={handleUpdateSessionKey}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onRefreshPrefix={handleRefreshPrefix}
              index={index}
              apiUrl={getApiUrl(account)}
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

      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onImportComplete={async () => {
          await refreshAccounts();
        }}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="确认删除"
        message="确定要删除这个账号吗？此操作无法撤销。"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
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
