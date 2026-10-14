import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // Fetch total inquiries count
  const { count: inquiriesCount, error } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("Error fetching dashboard metrics:", error);
  }

  // Fetch total archive pieces count dynamically from catalog_items
  const { count: catalogCount } = await supabase
    .from('catalog_items')
    .select('*', { count: 'exact', head: true });

  // Fetch the 5 most recent inquiries for a quick-glance feed
  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-mgr-foreground mb-2">
            Command Center
          </h1>
          <p className="font-body text-sm text-mgr-text-neutral">
            Welcome back. Here is the real-time overview of MGR Couture&apos;s operations.
          </p>
        </div>

        <Link 
          href="/admin/inquiries"
          className="px-6 py-3 bg-mgr-primary/10 text-mgr-primary border border-mgr-primary/30 font-body text-xs uppercase tracking-widest hover:bg-mgr-primary hover:text-mgr-background transition-all text-center"
        >
          Manage All Inquiries &rarr;
        </Link>
      </header>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        {/* Inquiries Metric */}
        <div className="bg-mgr-surface border border-mgr-primary/10 p-8 flex flex-col justify-between">
          <p className="font-body text-[10px] text-mgr-primary tracking-[0.2em] uppercase mb-4">
            Total Inquiries
          </p>
          <p className="font-display text-5xl text-mgr-foreground">
            {inquiriesCount ?? 0}
          </p>
        </div>

        {/* Active Orders Metric (Placeholder for upcoming orders table) */}
        <div className="bg-mgr-surface border border-mgr-primary/10 p-8 flex flex-col justify-between">
          <p className="font-body text-[10px] text-mgr-primary tracking-[0.2em] uppercase mb-4">
            Active Atelier Orders
          </p>
          <p className="font-display text-5xl text-mgr-foreground">
            0
          </p>
        </div>

        {/* Catalog Pieces Metric */}
        <div className="bg-mgr-surface border border-mgr-primary/10 p-8 flex flex-col justify-between">
          <p className="font-body text-[10px] text-mgr-primary tracking-[0.2em] uppercase mb-4">
            Archive Pieces
          </p>
          <p className="font-display text-5xl text-mgr-foreground">
            {catalogCount ?? 0}
          </p>
        </div>

      </div>

      {/* Recent Leads Feed */}
      <div className="bg-mgr-surface border border-mgr-primary/10 p-8">
        <h2 className="font-display text-xl text-mgr-foreground mb-6 pb-4 border-b border-mgr-primary/10">
          Recent Inquiries Feed
        </h2>

        {!recentInquiries || recentInquiries.length === 0 ? (
          <p className="font-body text-xs text-mgr-text-neutral py-6 text-center">
            No leads captured yet. Your public site is ready for submissions.
          </p>
        ) : (
          <div className="space-y-4">
            {recentInquiries.map((lead) => (
              <div key={lead.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-mgr-background/40 border border-mgr-primary/10 gap-4">
                <div>
                  <p className="font-display text-base text-mgr-foreground">{lead.full_name}</p>
                  <p className="font-body text-xs text-mgr-text-neutral mt-0.5">
                    {lead.email} • {lead.phone}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {lead.sku_reference && (
                    <span className="font-body text-[10px] border border-mgr-primary/30 px-3 py-1 text-mgr-primary uppercase tracking-wider">
                      {lead.sku_reference}
                    </span>
                  )}
                  <span className="font-body text-[10px] text-mgr-text-neutral">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}