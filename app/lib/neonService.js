/**
 * Neon PostgreSQL Database Service
 * This service provides functions to interact with the Neon PostgreSQL database via API routes
 */

import { generateRandomString } from './utils';
// Get all accounts
export async function getAccountsFromNeon() {
  try {
    const response = await fetch('/api/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch accounts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}

// Get account by ID
export async function getAccountByIdFromNeon(id) {
  try {
    const response = await fetch(`/api/accounts?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch account');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching account with ID ${id}:`, error);
    throw error;
  }
}

// Create a new account
export async function createAccountInNeon(accountData) {
  try {
    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create account');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

// Update an account
export async function updateAccountInNeon(id, accountData) {
  try {
    const response = await fetch(`/api/accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update account');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating account with ID ${id}:`, error);
    throw error;
  }
}

// Update session key
export async function updateSessionKeyInNeon(id, sessionKey) {
  return updateAccountInNeon(id, { sessionKey });
}

// Toggle account status
export async function toggleAccountStatusInNeon(id) {
  try {
    // First get the current account to know its status
    const account = await getAccountByIdFromNeon(id);
    
    // Then update with the opposite status
    return updateAccountInNeon(id, { isActive: !account.isActive });
  } catch (error) {
    console.error(`Error toggling status for account with ID ${id}:`, error);
    throw error;
  }
}

// Delete an account
export async function deleteAccountFromNeon(id) {
  try {
    const response = await fetch(`/api/accounts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete account');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting account with ID ${id}:`, error);
    throw error;
  }
}

// Seed the database with initial data
export async function seedDatabaseNeon() {
  try {
    const response = await fetch('/api/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to seed database');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 

// Refresh prefix
export async function refreshPrefixInNeon(id) {
  return updateAccountInNeon(id, { prefixUrl: generateRandomString(4) });
}
