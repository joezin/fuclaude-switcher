import { NextResponse } from 'next/server';

// POST /api/seed - Seed the database with initial data
export async function POST(request) {
  try {
    // Get D1 database from environment
    const db = request.env.DB;
    
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
    await db.prepare('DELETE FROM accounts').run();
    
    // Reset auto-increment
    await db.prepare('DELETE FROM sqlite_sequence WHERE name = ?').bind('accounts').run();
    
    // Insert initial accounts
    const results = [];
    
    for (const account of initialAccounts) {
      const result = await db.prepare(
        'INSERT INTO accounts (name, email, session_key, is_active) VALUES (?, ?, ?, ?) RETURNING *'
      ).bind(
        account.name,
        account.email,
        account.sessionKey,
        account.isActive ? 1 : 0
      ).run();
      
      if (result.results && result.results.length > 0) {
        const newAccount = result.results[0];
        results.push({
          id: newAccount.id,
          name: newAccount.name,
          email: newAccount.email,
          sessionKey: newAccount.session_key,
          isActive: newAccount.is_active === 1,
          createdAt: newAccount.created_at,
          updatedAt: newAccount.updated_at
        });
      }
    }
    
    return NextResponse.json({ success: true, accounts: results });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
} 