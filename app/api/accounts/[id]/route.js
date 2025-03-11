import { NextResponse } from 'next/server';
import { executeQuery, executeQuerySingle, mapToAccount } from '../../../lib/db';
import { auth } from '@clerk/nextjs/server';

// export const runtime = "edge";

// PUT /api/accounts/[id] - Update an account
export async function PUT(request, context) {
  try {
    const { userId } =await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { name, email, sessionKey, isActive, prefixUrl } = await request.json();
    
    // Check if account exists and belongs to the user
    const checkQuery = 'SELECT * FROM accounts WHERE id = $1 AND user_id = $2';
    const existingAccount = await executeQuerySingle(checkQuery, [id, userId]);
    
    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      values.push(name);
      paramIndex++;
    }
    
    if (email !== undefined) {
      // Check if email is already used by another account
      if (email !== existingAccount.email) {
        const emailCheckQuery = 'SELECT id FROM accounts WHERE email = $1 AND id != $2 AND user_id = $3';
        const emailExists = await executeQuerySingle(emailCheckQuery, [email, id, userId]);
        if (emailExists) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
      }
      updates.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }
    
    if (sessionKey !== undefined) {
      updates.push(`session_key = $${paramIndex}`);
      values.push(sessionKey);
      paramIndex++;
    }
    
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      values.push(isActive);
      paramIndex++;
    }

    if (prefixUrl !== undefined) {
      updates.push(`prefix_url = $${paramIndex}`);
      values.push(prefixUrl);
      paramIndex++;
    }
    
    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    // If no updates, return the existing account
    if (updates.length === 0) {
      return NextResponse.json(mapToAccount(existingAccount));
    }
    
    // Execute update query
    const query = `UPDATE accounts SET ${updates.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;
    values.push(id);
    values.push(userId);
    
    const updatedAccount = await executeQuerySingle(query, values);
    
    if (!updatedAccount) {
      return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
    }
    
    return NextResponse.json(mapToAccount(updatedAccount));
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json({ error: 'Failed to update account: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/accounts/[id] - Delete an account
export async function DELETE(request, context) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    
    // Check if account exists and belongs to the user
    const checkQuery = 'SELECT id FROM accounts WHERE id = $1 AND user_id = $2';
    const existingAccount = await executeQuerySingle(checkQuery, [id, userId]);
    
    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    // Delete account
    const deleteQuery = 'DELETE FROM accounts WHERE id = $1 AND user_id = $2';
    await executeQuery(deleteQuery, [id, userId]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json({ error: 'Failed to delete account: ' + error.message }, { status: 500 });
  }
} 