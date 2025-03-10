import { NextResponse } from 'next/server';

// GET /api/accounts - Get all accounts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Get D1 database from environment
    const db = request.env.DB;
    
    if (id) {
      // Get a single account by ID
      const result = await db.prepare('SELECT * FROM accounts WHERE id = ?').bind(id).first();
      
      if (!result) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        id: result.id,
        name: result.name,
        email: result.email,
        sessionKey: result.session_key,
        isActive: result.is_active === 1,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      });
    } else {
      // Get all accounts
      const { results } = await db.prepare('SELECT * FROM accounts ORDER BY id DESC').all();
      
      return NextResponse.json(results.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        sessionKey: row.session_key,
        isActive: row.is_active === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })));
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST /api/accounts - Create a new account
export async function POST(request) {
  try {
    const { name, email, sessionKey, isActive = true } = await request.json();
    
    // Validate required fields
    if (!name || !email || !sessionKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get D1 database from environment
    const db = request.env.DB;
    
    // Check if email already exists
    const existingAccount = await db.prepare('SELECT id FROM accounts WHERE email = ?').bind(email).first();
    if (existingAccount) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    // Insert new account
    const result = await db.prepare(
      'INSERT INTO accounts (name, email, session_key, is_active) VALUES (?, ?, ?, ?) RETURNING *'
    ).bind(name, email, sessionKey, isActive ? 1 : 0).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
    
    const newAccount = result.results[0];
    
    return NextResponse.json({
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      sessionKey: newAccount.session_key,
      isActive: newAccount.is_active === 1,
      createdAt: newAccount.created_at,
      updatedAt: newAccount.updated_at
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
} 