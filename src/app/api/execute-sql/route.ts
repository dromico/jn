import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Create a Supabase client with admin privileges
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    const body = await request.json();
    const { sql } = body;

    // Safety check - only allow ALTER TABLE operations that add columns
    if (!sql || typeof sql !== 'string' || !sql.toLowerCase().includes('alter table') ||
        !sql.toLowerCase().includes('add column')) {
      return NextResponse.json({ error: 'Invalid SQL command' }, { status: 400 });
    }

    // Execute SQL with admin permissions
    const { error } = await supabase.rpc('execute_sql', { sql_query: sql });

    if (error) {
      console.error('Error executing SQL:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'SQL executed successfully' });
  } catch (error: unknown) {
    console.error('Error in execute-sql API:', error);
    const errorMessage = error instanceof Error
      ? error.message
      : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}