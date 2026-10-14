import Link from "next/link";

export default function AdminOrdersPage() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl text-mgr-foreground mb-2">
          Atelier Orders
        </h1>
        <p className="font-body text-sm text-mgr-text-neutral">
          Track bespoke commissions, measurements, client fittings, and completion schedules.
        </p>
      </header>

      <div className="bg-mgr-surface border border-mgr-primary/10 p-16 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-mgr-primary/10 border border-mgr-primary/30 flex items-center justify-center mx-auto mb-6 text-mgr-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <h2 className="font-display text-2xl text-mgr-foreground mb-3">
          Order Management Pipeline
        </h2>
        <p className="font-body text-xs text-mgr-text-neutral leading-relaxed mb-8 max-w-md mx-auto">
          Active commission tracking is in preparation. Incoming inquiries can be reviewed and converted in the inquiries terminal.
        </p>
        <Link
          href="/admin/inquiries"
          className="inline-block px-8 py-3 bg-mgr-primary/10 text-mgr-primary border border-mgr-primary/40 font-body text-xs uppercase tracking-widest hover:bg-mgr-primary hover:text-mgr-background transition-all"
        >
          View Client Inquiries &rarr;
        </Link>
      </div>
    </div>
  );
}
