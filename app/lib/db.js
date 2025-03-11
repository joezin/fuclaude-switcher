import { neon } from '@neondatabase/serverless';

// Initialize the Neon client
export function getNeonClient() {
  const connectionString = process.env.NEON_DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('NEON_DATABASE_URL environment variable is not set');
  }
  
  return neon(connectionString);
}

// Helper function to execute a query
export async function executeQuery(query, params = []) {
  const sql = getNeonClient();
  return await sql(query, params);
}

// Helper function to execute a query and return a single row
export async function executeQuerySingle(query, params = []) {
  const result = await executeQuery(query, params);
  return result.length > 0 ? result[0] : null;
}

// Helper function to map database row to account object
export function mapToAccount(row) {
  if (!row) return null;
  
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    sessionKey: row.session_key,
    prefixUrl: row.prefix_url,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
} 