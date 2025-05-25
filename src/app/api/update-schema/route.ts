import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Try to directly execute SQL to add the type column if it doesn't exist
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
      // If direct SQL execution fails, try alternate methods
      console.error('SQL error:', sqlError);

      // Try a simpler approach
      const { error: alterError } = await supabase
        .from('invoices')
        .update({ type: 'invoice' })
        .eq('id', '00000000-0000-0000-0000-000000000000'); // This ID likely doesn't exist, but will test if the column exists

      // Check if the column even exists
      if (alterError && alterError.message.includes('type')) {
        // Try another mechanism
        try {
          // Execute raw SQL to add the column (less safe, but may work with enough permissions)
          await fetch('/api/execute-sql', {
            method: 'POST',
            body: JSON.stringify({
              sql: `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS type text DEFAULT 'invoice';`
            })
          });
        } catch (e) {
          console.error('Error with fallback approach:', e);
        }
      }
    }

    // Verify the column exists now
    try {
      const { data, error: checkError } = await supabase
        .from('invoices')
        .select('id, type')
        .limit(1);

      if (checkError) {
        return NextResponse.json({ error: checkError.message }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Schema updated successfully',
        columnExists: true,
        sample: data
      });
    } catch (finalError) {
      return NextResponse.json({
        message: 'Schema update attempted, but verification failed',
        error: finalError
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating schema:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}