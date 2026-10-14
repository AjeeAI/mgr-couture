import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is set in environment, require it (Vercel automatically sends this header)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const keyParam = request.nextUrl.searchParams.get('key');
    if (keyParam !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase environment variables are missing' },
      { status: 500 }
    );
  }

  const startTime = Date.now();
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Perform a lightweight query to register database engine activity and prevent pause
    const { count, error } = await supabase
      .from('catalog_items')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'success',
      message: 'Supabase keep-alive ping successful. Project remains active.',
      timestamp: new Date().toISOString(),
      durationMs,
      totalCatalogPieces: count ?? 0,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Database ping error';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Keep-alive ping encountered a database error.',
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
