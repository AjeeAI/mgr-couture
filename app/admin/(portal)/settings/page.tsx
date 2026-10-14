"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const [pingStatus, setPingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pingResult, setPingResult] = useState<{
    durationMs?: number;
    timestamp?: string;
    message?: string;
    error?: string;
  } | null>(null);

  const handleTestPing = async () => {
    setPingStatus("loading");
    setPingResult(null);

    try {
      const res = await fetch("/api/cron/keep-alive");
      const data = await res.json();

      if (res.ok) {
        setPingStatus("success");
        setPingResult({
          durationMs: data.durationMs,
          timestamp: data.timestamp,
          message: data.message,
        });
      } else {
        setPingStatus("error");
        setPingResult({
          error: data.error || data.message || "Failed to reach database",
        });
      }
    } catch (err: unknown) {
      setPingStatus("error");
      const errMsg = err instanceof Error ? err.message : "Network error during ping";
      setPingResult({ error: errMsg });
    }
  };

  return (
    <div>
      <header className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl text-mgr-foreground mb-2">
          Terminal Settings
        </h1>
        <p className="font-body text-sm text-mgr-text-neutral">
          Manage brand configuration, database telemetry, and WhatsApp concierge routing.
        </p>
      </header>

      <div className="space-y-8 max-w-3xl">
        {/* Supabase Keep-Alive & Database Telemetry Card */}
        <div className="bg-mgr-surface border border-mgr-primary/10 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display text-xl text-mgr-foreground mb-1">
                Database Heartbeat & Anti-Pause Pinger
              </h2>
              <p className="font-body text-xs text-mgr-text-neutral leading-relaxed">
                Supabase free projects automatically pause after 7 days of inactivity. An automated daily heartbeat cron job keeps your database engine active and responsive.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-mgr-primary/10 mt-4">
            <div>
              <span className="block font-body text-[10px] text-mgr-text-neutral uppercase tracking-widest mb-1">
                Automated Schedule
              </span>
              <span className="font-body text-xs text-mgr-foreground font-mono">
                Daily at 08:00 UTC (Vercel Cron)
              </span>
            </div>
            <div>
              <span className="block font-body text-[10px] text-mgr-text-neutral uppercase tracking-widest mb-1">
                Heartbeat Endpoint
              </span>
              <span className="font-body text-xs text-mgr-foreground font-mono">
                /api/cron/keep-alive
              </span>
            </div>
            <div>
              <span className="block font-body text-[10px] text-mgr-text-neutral uppercase tracking-widest mb-1">
                Engine Status
              </span>
              <span className="inline-flex items-center gap-2 font-body text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active & Warming
              </span>
            </div>
          </div>

          {/* Manual Ping Trigger */}
          <div className="mt-6 pt-6 border-t border-mgr-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={handleTestPing}
              disabled={pingStatus === "loading"}
              className="px-6 py-2.5 bg-mgr-primary/15 text-mgr-primary border border-mgr-primary/40 font-body text-xs uppercase tracking-widest hover:bg-mgr-primary hover:text-mgr-background transition-all font-semibold disabled:opacity-50 cursor-pointer"
            >
              {pingStatus === "loading" ? "Pinging Supabase Engine..." : "⚡ Test Ping Database Now"}
            </button>

            {pingResult && (
              <div className="font-body text-xs">
                {pingStatus === "success" && (
                  <p className="text-emerald-400 flex items-center gap-2">
                    <span>✓ Active ({pingResult.durationMs}ms)</span>
                    <span className="text-mgr-text-neutral/60 text-[10px]">
                      {new Date(pingResult.timestamp || "").toLocaleTimeString()}
                    </span>
                  </p>
                )}
                {pingStatus === "error" && (
                  <p className="text-red-400">
                    ✕ Ping failed: {pingResult.error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

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
