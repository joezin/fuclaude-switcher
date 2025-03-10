import Account from '../models/Account';
import {
  getAccountsFromD1,
  getAccountByIdFromD1,
  createAccountInD1,
  updateAccountInD1,
  updateSessionKeyInD1,
  toggleAccountStatusInD1,
  deleteAccountFromD1,
  seedDatabaseD1
} from './d1ServiceNew';

// Export the D1 functions with the same interface as before
export const getAccounts = async () => {
  return await getAccountsFromD1();
};

export const getAccountById = async (id) => {
  return await getAccountByIdFromD1(id);
};

export const createAccount = async (accountData) => {
  return await createAccountInD1(accountData);
};

export const updateAccount = async (id, accountData) => {
  return await updateAccountInD1(id, accountData);
};

export const updateSessionKey = async (id, sessionKey) => {
  return await updateSessionKeyInD1(id, sessionKey);
};

export const toggleAccountStatus = async (id) => {
  return await toggleAccountStatusInD1(id);
};

export const deleteAccount = async (id) => {
  return await deleteAccountFromD1(id);
};

// Seed function to populate the database with initial data (for development)
export const seedDatabase = async () => {
  return await seedDatabaseD1();
}; 