import Account from '../models/Account';
import {
  getAccountsFromNeon,
  getAccountByIdFromNeon,
  createAccountInNeon,
  updateAccountInNeon,
  updateSessionKeyInNeon,
  toggleAccountStatusInNeon,
  deleteAccountFromNeon,
  seedDatabaseNeon
} from './neonService';

// Export the Neon functions with the same interface as before
export const getAccounts = async () => {
  return await getAccountsFromNeon();
};

export const getAccountById = async (id) => {
  return await getAccountByIdFromNeon(id);
};

export const createAccount = async (accountData) => {
  return await createAccountInNeon(accountData);
};

export const updateAccount = async (id, accountData) => {
  return await updateAccountInNeon(id, accountData);
};

export const updateSessionKey = async (id, sessionKey) => {
  return await updateSessionKeyInNeon(id, sessionKey);
};

export const toggleAccountStatus = async (id) => {
  return await toggleAccountStatusInNeon(id);
};

export const deleteAccount = async (id) => {
  return await deleteAccountFromNeon(id);
};

// Seed function to populate the database with initial data (for development)
export const seedDatabase = async () => {
  return await seedDatabaseNeon();
}; 