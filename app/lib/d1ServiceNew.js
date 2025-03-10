/**
 * Cloudflare D1 Database Service
 * This service provides functions to interact with the Cloudflare D1 database via API routes
 */

// Get all accounts
export async function getAccountsFromD1() {
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
export async function getAccountByIdFromD1(id) {
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
export async function createAccountInD1(accountData) {
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
export async function updateAccountInD1(id, accountData) {
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
export async function updateSessionKeyInD1(id, sessionKey) {
  return updateAccountInD1(id, { sessionKey });
}

// Toggle account status
export async function toggleAccountStatusInD1(id) {
  try {
    // First get the current account to know its status
    const account = await getAccountByIdFromD1(id);
    
    // Then update with the opposite status
    return updateAccountInD1(id, { isActive: !account.isActive });
  } catch (error) {
    console.error(`Error toggling status for account with ID ${id}:`, error);
    throw error;
  }
}

// Delete an account
export async function deleteAccountFromD1(id) {
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
export async function seedDatabaseD1() {
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