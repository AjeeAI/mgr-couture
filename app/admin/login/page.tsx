"use client";

import { useState } from "react";
import Image from "next/image";
import { createBrowserClient } from '@supabase/ssr';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus('error');
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        // Force a slight delay to ensure cookie is written, then redirect
        setTimeout(() => {
          window.location.href = "/admin/dashboard"; // Hard redirect avoids router caching bugs
        }, 500);
      }
    } catch (err) {
      console.error("Unexpected login exception:", err);
      setStatus('error');
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mgr-background selection:bg-mgr-primary/30 selection:text-white relative overflow-hidden px-6">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mgr-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-mgr-surface border border-mgr-primary/20 p-10 md:p-14 relative z-10 shadow-2xl">
        
        <div className="flex flex-col items-center mb-12">
          <Image 
            src="https://res.cloudinary.com/hewpj3ti/image/upload/v1785046551/mgr_logo_cropped_tua45d.png"
            alt="MGR Couture Admin"
            width={160}
            height={45}
            unoptimized
            className="mb-6 opacity-90 h-8 w-auto"
          />
          <h1 className="font-display text-2xl text-mgr-foreground text-center">
            Command Center
          </h1>
          <p className="font-body text-xs text-mgr-text-neutral mt-2 tracking-widest uppercase">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="relative">
            <label className="block font-body text-[10px] text-mgr-text-neutral mb-3 uppercase tracking-[0.2em]">
              Admin Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="admin@mgrcouture.com"
              className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-2 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none" 
            />
          </div>

          <div className="relative">
            <label className="block font-body text-[10px] text-mgr-text-neutral mb-3 uppercase tracking-[0.2em]">
              Passcode
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              placeholder="••••••••"
              className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-2 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none tracking-widest" 
            />
          </div>

          {errorMessage && (
            <p className="text-red-400 font-body text-xs text-center">
              {errorMessage}
            </p>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full py-5 font-body text-xs uppercase tracking-[0.3em] transition-all duration-500 font-bold bg-mgr-primary/10 text-mgr-primary border border-mgr-primary/40 hover:bg-mgr-primary hover:text-mgr-background gold-bloom disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Authenticating...' : 'Access Terminal'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}