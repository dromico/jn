import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

// Get environment variables (make sure these exist in your .env.local file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if required environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// For improved reliability in client components, use this instance which handles auth automatically
// Only create the client if environment variables are available
export const browserSupabase = isSupabaseConfigured
  ? createClientComponentClient<Database>()
  : null;

// Export the client component creator for use in components
// This function creates a client that automatically handles auth session persistence in components
export const createBrowserClient = () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase environment variables are missing. Authentication features will not work.');
    // Return a mock client to prevent runtime errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        // Add other methods as needed
      },
      from: () => ({
        select: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    } as any;
  }
  return createClientComponentClient<Database>();
};

// Create a singleton instance for direct API calls or server-side operations
// IMPORTANT: This client does NOT handle auth session persistence automatically!
// Use browserSupabase for client components that need auth session handling
export const supabase = typeof window !== 'undefined'
  ? browserSupabase || createMockClient() // Use the session-aware client in browser environments or a mock client
  : isSupabaseConfigured
    ? createClient<Database>(supabaseUrl, supabaseAnonKey) // Use direct client in server contexts if configured
    : createMockClient(); // Use mock client if not configured

// Create a mock client to prevent runtime errors when environment variables are missing
function createMockClient() {
  console.warn('Using mock Supabase client because environment variables are missing.');
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        order: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  } as any;
}

// Error message enhancement for schema issues
export const enhanceErrorMessage = (error: unknown): string => {
  if (!error) return 'Unknown error';

  const message = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
      ? error.message
      : 'Unknown error';

  // Replace specific error messages with more helpful ones
  if (message.includes('type') && (message.includes('column') || message.includes('schema cache')) && message.includes('invoices')) {
    return 'Database schema needs to be updated - please see the README.md file for instructions on how to fix the "type" column issue.';
  }

  return message;
};

// Utility function to handle type-related database schema errors
export const handleInvoiceTypeError = async (error: unknown): Promise<boolean> => {
  // Check if the error is related to missing 'type' column
  const errorMessage = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
      ? error.message
      : '';

  if (errorMessage && (
    errorMessage.includes('column "type" does not exist') ||
    errorMessage.includes('column type of relation') ||
    errorMessage.includes('Could not find the \'type\' column')
  )) {
    try {
      // Try to fix the schema by calling our update-schema endpoint
      await fetch('/api/update-schema');
      return true; // Schema update was attempted
    } catch (updateError) {
      console.error('Failed to update schema:', updateError);
      return false; // Schema update failed
    }
  }
  return false; // Not a type-related error
};