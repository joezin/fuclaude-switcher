import { NextResponse } from 'next/server';
import { executeQuery, executeQuerySingle, mapToAccount } from '../../lib/db';

// export const runtime = "edge";

// POST /api/seed - Seed the database with initial data
export async function POST(request, context) {
  try {
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Seeding is not allowed in production' }, { status: 403 });
    }
    
    // Initial accounts data
    const initialAccounts = [
      { name: '账号1', email: 'account1@example.com', sessionKey: 'sk_test_123456', isActive: true },
      { name: '账号2', email: 'account2@example.com', sessionKey: 'sk_test_234567', isActive: true },
      { name: '账号3', email: 'account3@example.com', sessionKey: 'sk_test_345678', isActive: false },
    ];
    
    // Clear existing accounts
    await executeQuery('DELETE FROM accounts');
    
    // Insert initial accounts
    const results = [];
    
    for (const account of initialAccounts) {
      const query = `
        INSERT INTO accounts (name, email, session_key, is_active) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `;
      
      const newAccount = await executeQuerySingle(
        query,
        [account.name, account.email, account.sessionKey, account.isActive]
      );
      
      if (newAccount) {
        results.push(mapToAccount(newAccount));
      }
    }
    
    return NextResponse.json({ success: true, accounts: results });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database: ' + error.message }, { status: 500 });
  }
} 