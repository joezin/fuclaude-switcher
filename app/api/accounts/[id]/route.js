import { NextResponse } from 'next/server';

// PUT /api/accounts/[id] - Update an account
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, email, sessionKey, isActive } = await request.json();
    
    // Get D1 database from environment
    const db = request.env.DB;
    
    // Check if account exists
    const existingAccount = await db.prepare('SELECT * FROM accounts WHERE id = ?').bind(id).first();
    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    // Build update query
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (email !== undefined) {
      // Check if email is already used by another account
      if (email !== existingAccount.email) {
        const emailExists = await db.prepare('SELECT id FROM accounts WHERE email = ? AND id != ?').bind(email, id).first();
        if (emailExists) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
      }
      updates.push('email = ?');
      values.push(email);
    }
    
    if (sessionKey !== undefined) {
      updates.push('session_key = ?');
      values.push(sessionKey);
    }
    
    if (isActive !== undefined) {
      updates.push('is_active = ?');
      values.push(isActive ? 1 : 0);
    }
    
    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    // If no updates, return the existing account
    if (updates.length === 0) {
      return NextResponse.json({
        id: existingAccount.id,
        name: existingAccount.name,
        email: existingAccount.email,
        sessionKey: existingAccount.session_key,
        isActive: existingAccount.is_active === 1,
        createdAt: existingAccount.created_at,
        updatedAt: existingAccount.updated_at
      });
    }
    
    // Execute update query
    const query = `UPDATE accounts SET ${updates.join(', ')} WHERE id = ? RETURNING *`;
    values.push(id);
    
    const result = await db.prepare(query).bind(...values).run();
    
    if (!result.results || result.results.length === 0) {
      return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
    
    const updatedAccount = result.results[0];
    
    return NextResponse.json({
      id: updatedAccount.id,
      name: updatedAccount.name,
      email: updatedAccount.email,
      sessionKey: updatedAccount.session_key,
      isActive: updatedAccount.is_active === 1,
      createdAt: updatedAccount.created_at,
      updatedAt: updatedAccount.updated_at
    });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

// DELETE /api/accounts/[id] - Delete an account
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Get D1 database from environment
    const db = request.env.DB;
    
    // Check if account exists
    const existingAccount = await db.prepare('SELECT id FROM accounts WHERE id = ?').bind(id).first();
    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    // Delete account
    const result = await db.prepare('DELETE FROM accounts WHERE id = ?').bind(id).run();
    
    if (!result.meta || result.meta.changes === 0) {
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
} 