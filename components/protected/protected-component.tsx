import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { browserSupabase } from '@/lib/supabase';
import { handleAuthError } from '@/utils/auth-error-handler';

export function ProtectedComponent() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await browserSupabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          router.push('/login');
        }
      } catch (err) {
        const { message } = handleAuthError(err);
        console.error('Auth check failed:', message);
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router]);

  return (
    <div>
      {/* ...existing code... */}
    </div>
  );
}
