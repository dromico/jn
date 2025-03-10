import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

// Get environment variables (make sure these exist in your .env.local file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// For improved reliability in client components, use this instance which handles auth automatically
export const browserSupabase = createClientComponentClient<Database>();

// Export the client component creator for use in components
// This function creates a client that automatically handles auth session persistence in components
export const createBrowserClient = () => {
  return createClientComponentClient<Database>();
};

// Create a singleton instance for direct API calls or server-side operations
// IMPORTANT: This client does NOT handle auth session persistence automatically!
// Use browserSupabase for client components that need auth session handling
export const supabase = typeof window !== 'undefined'
  ? browserSupabase // Use the session-aware client in browser environments
  : createClient<Database>(supabaseUrl, supabaseAnonKey); // Use direct client in server contexts

// Error message enhancement for schema issues
export const enhanceErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error';
  
  const message = error.message || 'Unknown error';
  
  // Replace specific error messages with more helpful ones
  if (message.includes('type') && (message.includes('column') || message.includes('schema cache')) && message.includes('invoices')) {
    return 'Database schema needs to be updated - please see the README.md file for instructions on how to fix the "type" column issue.';
  }
  
  return message;
};

// Utility function to handle type-related database schema errors
export const handleInvoiceTypeError = async (error: any): Promise<boolean> => {
  // Check if the error is related to missing 'type' column
  if (error && error.message && (
    error.message.includes('column "type" does not exist') || 
    error.message.includes('column type of relation') ||
    error.message.includes('Could not find the \'type\' column')
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