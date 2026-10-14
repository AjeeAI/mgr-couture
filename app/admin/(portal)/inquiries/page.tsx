import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  // FIX: Await the cookies() function for Next.js 15+
  const cookieStore = await cookies();
  
  // Initialize the Supabase server client
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

  // Fetch the data directly from the 'inquiries' table
  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching inquiries:", error);
  }

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div>
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-mgr-foreground mb-2">
            Inquiries & Leads
          </h1>
          <p className="font-body text-sm text-mgr-text-neutral">
            Review and manage incoming bespoke requests and client consultations.
          </p>
        </div>
        
        {/* Total Count Badge */}
        <div className="bg-mgr-surface border border-mgr-primary/20 px-6 py-3 flex items-center gap-4">
          <span className="font-body text-[10px] text-mgr-primary tracking-[0.2em] uppercase">Total Leads</span>
          <span className="font-display text-2xl text-mgr-foreground">{inquiries?.length || 0}</span>
        </div>
      </header>

      {/* Data Table */}
      <div className="bg-mgr-surface border border-mgr-primary/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-mgr-primary/20 bg-mgr-background/50">
                <th className="p-6 font-body text-[10px] text-mgr-text-neutral tracking-[0.2em] uppercase whitespace-nowrap">Date Received</th>
                <th className="p-6 font-body text-[10px] text-mgr-text-neutral tracking-[0.2em] uppercase whitespace-nowrap">Client Details</th>
                <th className="p-6 font-body text-[10px] text-mgr-text-neutral tracking-[0.2em] uppercase whitespace-nowrap">Inquiry / SKU</th>
                <th className="p-6 font-body text-[10px] text-mgr-text-neutral tracking-[0.2em] uppercase min-w-[300px]">Special Requests</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-mgr-primary/10">
              {!inquiries || inquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <p className="font-body text-mgr-text-neutral mb-2">No inquiries found in the database.</p>
                    <p className="font-body text-xs text-mgr-primary tracking-widest uppercase">Awaiting your first client.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-mgr-primary/5 transition-colors group">
                    
                    {/* Date */}
                    <td className="p-6 align-top">
                      <p className="font-body text-sm text-mgr-foreground">
                        {formatDate(inquiry.created_at)}
                      </p>
                      {inquiry.event_date && (
                        <p className="font-body text-[10px] text-mgr-primary tracking-widest uppercase mt-2 flex flex-col">
                          <span className="text-mgr-text-neutral/50">Event Date:</span>
                          {formatDate(inquiry.event_date)}
                        </p>
                      )}
                    </td>

                    {/* Client Details */}
                    <td className="p-6 align-top">
                      <p className="font-display text-lg text-mgr-foreground mb-1">{inquiry.full_name}</p>
                      <div className="flex flex-col gap-1 font-body text-xs text-mgr-text-neutral">
                        {inquiry.email && (
                          <a href={`mailto:${inquiry.email}`} className="hover:text-mgr-primary transition-colors">
                            {inquiry.email}
                          </a>
                        )}
                        {inquiry.phone ? (
                          <a href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-mgr-primary transition-colors">
                            {inquiry.phone}
                          </a>
                        ) : (
                          <span className="text-mgr-text-neutral/50 italic">No phone</span>
                        )}
                      </div>
                    </td>

                    {/* Inquiry / SKU */}
                    <td className="p-6 align-top">
                      {inquiry.item_title ? (
                        <div>
                          <p className="font-body text-sm text-mgr-foreground mb-1">{inquiry.item_title}</p>
                          <p className="font-body text-[10px] text-mgr-primary tracking-widest uppercase">
                            {inquiry.sku_reference}
                          </p>
                        </div>
                      ) : inquiry.sku_reference ? (
                        <span className="font-body text-xs border border-mgr-primary/30 px-3 py-1 text-mgr-primary">
                          {inquiry.sku_reference}
                        </span>
                      ) : (
                        <span className="font-body text-[10px] text-mgr-text-neutral tracking-widest uppercase italic">
                          General Inquiry
                        </span>
                      )}
                    </td>

                    {/* Special Requests */}
                    <td className="p-6 align-top">
                      <p className="font-body text-sm text-mgr-text-neutral leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                        {inquiry.special_requests || <span className="italic opacity-50">No additional notes provided.</span>}
                      </p>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}