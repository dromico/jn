import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a Supabase client with admin privileges
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    // Since we have admin access, try to add the type column to the invoices table if needed
    try {
      // Execute SQL to add the type column if it doesn't exist
      const { error: sqlError } = await supabase.rpc('execute_sql', {
        sql_query: `
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'invoices'
              AND column_name = 'type'
            ) THEN
              ALTER TABLE invoices
              ADD COLUMN type text check (type in ('invoice', 'quotation')) default 'invoice';
            END IF;
          END $$;
        `
      });

      if (sqlError) {
        console.error('Error updating schema:', sqlError);
      }
    } catch (schemaError) {
      console.error('Error updating schema:', schemaError);
      // Continue with user creation anyway
    }

    // Use admin access to create a user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'password123',
      email_confirm: true, // Skip email verification
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the created user
    return NextResponse.json({
      message: 'Test user created successfully',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}