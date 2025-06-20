import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

  // Sign out (clear session)
  await supabase.auth.signOut();

  return NextResponse.json({
    success: true,
    message: 'Successfully signed out',
  });
}