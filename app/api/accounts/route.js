import { NextResponse } from 'next/server';
import { executeQuery, executeQuerySingle, mapToAccount } from '../../lib/db';
import { auth } from '@clerk/nextjs/server';

// export const runtime = "edge";

// GET /api/accounts - Get all accounts
export async function GET(request, context) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get a single account by ID
      const query = 'SELECT * FROM accounts WHERE id = $1 AND user_id = $2';
      const result = await executeQuerySingle(query, [id, userId]);
      
      if (!result) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }
      
      return NextResponse.json(mapToAccount(result));
    } else {
      // Get all accounts for the user
      const query = 'SELECT * FROM accounts WHERE user_id = $1 ORDER BY id DESC';
      const results = await executeQuery(query, [userId]);
      
      return NextResponse.json(results.map(row => mapToAccount(row)));
    }
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts: ' + error.message }, { status: 500 });
  }
}

// POST /api/accounts - Create a new account
export async function POST(request, context) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, sessionKey, isActive = true } = await request.json();
    
    // Validate required fields
    if (!name || !email || !sessionKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if email already exists for this user
    const checkQuery = 'SELECT id FROM accounts WHERE email = $1 AND user_id = $2';
    const existingAccount = await executeQuerySingle(checkQuery, [email, userId]);
    
    if (existingAccount) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    
    // Insert new account
    const insertQuery = `
      INSERT INTO accounts (name, email, session_key, is_active, user_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    
    const newAccount = await executeQuerySingle(insertQuery, [name, email, sessionKey, isActive, userId]);
    
    if (!newAccount) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
    
    return NextResponse.json(mapToAccount(newAccount), { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Failed to create account: ' + error.message }, { status: 500 });
  }
} 