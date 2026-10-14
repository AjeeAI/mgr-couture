import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div>
      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl text-mgr-foreground mb-2">
          Terminal Settings
        </h1>
        <p className="font-body text-sm text-mgr-text-neutral">
          Manage brand configuration, WhatsApp integration routing, and admin access.
        </p>
      </header>

      <div className="space-y-8 max-w-3xl">
        {/* WhatsApp Integration Card */}
        <div className="bg-mgr-surface border border-mgr-primary/10 p-8">
          <h2 className="font-display text-xl text-mgr-foreground mb-2">
            WhatsApp Concierge Routing
          </h2>
          <p className="font-body text-xs text-mgr-text-neutral mb-6 leading-relaxed">
            Client inquiries and consultation requests automatically prefill and redirect to the configured WhatsApp concierge number.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-mgr-primary/10">
            <div>
              <span className="block font-body text-[10px] text-mgr-text-neutral uppercase tracking-widest mb-1">
                Active WhatsApp Endpoint
              </span>
              <span className="font-body text-sm text-mgr-foreground tracking-wider font-mono">
                +234 906 544 0091
              </span>
            </div>
            <div>
              <span className="block font-body text-[10px] text-mgr-text-neutral uppercase tracking-widest mb-1">
                Status
              </span>
              <span className="inline-flex items-center gap-2 font-body text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Cloudinary Integration Card */}
        <div className="bg-mgr-surface border border-mgr-primary/10 p-8">
          <h2 className="font-display text-xl text-mgr-foreground mb-2">
            Media Storage (Cloudinary)
          </h2>
          <p className="font-body text-xs text-mgr-text-neutral mb-6 leading-relaxed">
            High-resolution lookbook assets and boutique photography are served and stored via Cloudinary.
          </p>

          <div className="pt-4 border-t border-mgr-primary/10">
            <Link
              href="/admin/catalog"
              className="inline-block px-6 py-2.5 bg-mgr-primary/10 text-mgr-primary border border-mgr-primary/30 font-body text-xs uppercase tracking-widest hover:bg-mgr-primary hover:text-mgr-background transition-all"
            >
              Manage Lookbook & Catalog &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
