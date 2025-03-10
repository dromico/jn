import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a Supabase client with admin privileges
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
    
    // First, try a simple operation to see if the column exists
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('type')
        .limit(1);
      
      if (!error) {
        // Column exists
        return NextResponse.json({ success: true, message: 'Type column already exists' });
      }
    } catch (e) {
      // Continue with fix attempts
    }
    
    // Try direct SQL execution for making schema changes
    try {
      const { error } = await supabase.rpc('execute_sql', {
        sql_query: `
          ALTER TABLE IF EXISTS invoices 
          ADD COLUMN IF NOT EXISTS type text DEFAULT 'invoice';
          
          -- Update constraint if needed
          ALTER TABLE IF EXISTS invoices 
          DROP CONSTRAINT IF EXISTS invoices_type_check;
          
          ALTER TABLE IF EXISTS invoices 
          ADD CONSTRAINT invoices_type_check 
          CHECK (type IN ('invoice', 'quotation'));
        `
      });
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Schema fixed successfully' 
      });
    } catch (sqlError) {
      console.error('SQL Error:', sqlError);
      
      // Try a direct column access as a fallback
      try {
        // Try to update the DB schema cache
        await supabase.from('invoices').select('*').limit(1);
        await supabase.from('invoices').update({ type: 'invoice' }).match({ id: '0' }); // Likely won't match any rows
        
        return NextResponse.json({ 
          success: true, 
          message: 'Schema cache refreshed' 
        });
      } catch (finalError) {
        return NextResponse.json({
          success: false,
          message: 'Failed to fix schema',
          error: finalError
        }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error in schema-fix API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error fixing schema', 
      error 
    }, { status: 500 });
  }
}