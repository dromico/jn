import { AuthError } from '@supabase/supabase-js';

type ErrorResponse = {
  message: string;
  code?: string | number;
  isRateLimited?: boolean;
};

export function handleAuthError(error: unknown): ErrorResponse {
  console.error('Auth error:', error);
  
  // Handle rate limiting specifically
  if (error instanceof AuthError) {
    if (error.status === 429) {
      return {
        message: "Too many login attempts. Please wait a minute before trying again.",
        isRateLimited: true,
        code: error.status
      };
    }
    
    // Handle specific auth error codes
    switch (error.status) {
      case 400:
        return { 
          message: 'Invalid credentials or request format', 
          code: error.status 
        };
      case 401:
        return { 
          message: 'Your session has expired. Please log in again.', 
          code: error.status 
        };
      case 403:
        return { 
          message: 'You don\'t have permission to perform this action', 
          code: error.status 
        };
      case 404:
        return { 
          message: 'The requested resource was not found', 
          code: error.status 
        };
      case 422:
        return { 
          message: 'Validation failed. Please check your input.', 
          code: error.status 
        };
      default:
        return { 
          message: error.message || 'An authentication error occurred', 
          code: error.status 
        };
    }
  }
  
  // Handle non-AuthError exceptions
  return { 
    message: error instanceof Error ? error.message : 'An unexpected error occurred' 
  };
}
