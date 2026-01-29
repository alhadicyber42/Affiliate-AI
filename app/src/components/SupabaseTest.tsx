import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function SupabaseTest() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const testConnection = async () => {
        setStatus('loading');
        setMessage('Testing Supabase connection...');

        try {
            // Test basic connection by querying products table
            const { data, error } = await supabase
                .from('products')
                .select('id')
                .limit(1);

            if (error) {
                throw error;
            }

            setStatus('success');
            setMessage(`✅ Supabase connected successfully! Found ${data?.length || 0} products.`);
        } catch (error: any) {
            setStatus('error');
            setMessage(`❌ Connection failed: ${error.message}`);
            console.error('Supabase connection error:', error);
        }
    };

    useEffect(() => {
        // Auto-test on mount
        testConnection();
    }, []);

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 max-w-sm">
            <h3 className="text-white font-semibold mb-2">Supabase Status</h3>
            <p className={`text-sm mb-3 ${status === 'success' ? 'text-green-400' :
                    status === 'error' ? 'text-red-400' :
                        'text-gray-400'
                }`}>
                {message}
            </p>
            <Button
                onClick={testConnection}
                disabled={status === 'loading'}
                size="sm"
                variant="outline"
                className="w-full"
            >
                {status === 'loading' ? 'Testing...' : 'Test Again'}
            </Button>
        </div>
    );
}
