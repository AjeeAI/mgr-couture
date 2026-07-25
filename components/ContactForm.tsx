"use client";

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
// Note: Ensure you have these variables in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      event_date: formData.get('eventDate'),
      sku_reference: formData.get('sku'),
      special_requests: formData.get('requests'),
      created_at: new Date().toISOString(),
    };

    // Insert into your Supabase 'inquiries' table
    const { error } = await supabase.from('inquiries').insert([data]);

    if (error) {
      console.error('Supabase Error:', error);
      setStatus('error');
    } else {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative">
          <label htmlFor="fullName" className="block font-body text-[10px] text-on-surface-variant mb-4 uppercase tracking-[0.2em]">
            Full Name <span className="text-primary">*</span>
          </label>
          <input 
            type="text" 
            id="fullName"
            name="fullName" 
            required 
            placeholder="Evelyn Thorne"
            className="w-full bg-transparent border-0 border-b border-primary/30 focus:border-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-on-surface-variant/30 text-foreground font-body text-sm outline-none" 
          />
        </div>
        
        <div className="relative">
          <label htmlFor="email" className="block font-body text-[10px] text-on-surface-variant mb-4 uppercase tracking-[0.2em]">
            Email Address <span className="text-primary">*</span>
          </label>
          <input 
            type="email" 
            id="email"
            name="email" 
            required 
            placeholder="evelyn@domain.com"
            className="w-full bg-transparent border-0 border-b border-primary/30 focus:border-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-on-surface-variant/30 text-foreground font-body text-sm outline-none" 
          />
        </div>
      </div>

      {/* Phone and Event Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative">
          <label htmlFor="phone" className="block font-body text-[10px] text-on-surface-variant mb-4 uppercase tracking-[0.2em]">
            WhatsApp / Contact <span className="text-primary">*</span>
          </label>
          <input 
            type="tel" 
            id="phone"
            name="phone" 
            required 
            placeholder="+1 (555) 000-0000"
            className="w-full bg-transparent border-0 border-b border-primary/30 focus:border-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-on-surface-variant/30 text-foreground font-body text-sm outline-none" 
          />
        </div>
        
        <div className="relative">
          <label htmlFor="eventDate" className="block font-body text-[10px] text-on-surface-variant mb-4 uppercase tracking-[0.2em]">
            Event Date
          </label>
          <input 
            type="date" 
            id="eventDate"
            name="eventDate" 
            className="w-full bg-transparent border-0 border-b border-primary/30 focus:border-secondary focus:ring-0 px-0 py-3 transition-colors text-foreground font-body text-sm outline-none cursor-pointer" 
          />
        </div>
      </div>

      {/* SKU Reference */}
      <div className="relative">
        <label htmlFor="sku" className="block font-body text-[10px] text-on-surface-variant mb-4 uppercase tracking-[0.2em]">
          Design SKU or Vision
        </label>
        <input 
          type="text" 
          id="sku"
          name="sku" 
          placeholder="e.g. MGR-EVN-01 or custom request"
          className="w-full bg-transparent border-0 border-b border-primary/30 focus:border-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-on-surface-variant/30 text-foreground font-body text-sm outline-none" 
        />
      </div>

      {/* Special Requests Textarea */}
      <div className="relative">
        <label htmlFor="requests" className="block font-body text-[10px] text-on-surface-variant mb-4 uppercase tracking-[0.2em]">
          Special Requests
        </label>
        <textarea 
          id="requests"
          name="requests" 
          rows={4}
          placeholder="Details about your style, occasion, and specific requirements..."
          className="w-full bg-transparent border-0 border-b border-primary/30 focus:border-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-on-surface-variant/30 text-foreground font-body text-sm resize-none outline-none"
        ></textarea>
      </div>

      {/* Submit Button & Status Messages */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={status === 'loading' || status === 'success'}
          className={`w-full py-6 font-body text-xs uppercase tracking-[0.3em] transition-all duration-500 font-bold ${
            status === 'success' 
              ? 'bg-green-900/50 text-green-400 border border-green-500/50' 
              : 'bg-primary/10 text-primary border border-primary/40 hover:bg-primary hover:text-background gold-bloom'
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {status === 'idle' && 'Send Inquiry'}
          {status === 'loading' && 'Transmitting...'}
          {status === 'success' && 'Inquiry Received'}
          {status === 'error' && 'Error Sending. Try Again.'}
        </button>

        {status === 'error' && (
          <p className="mt-4 text-center font-body text-xs text-red-400">
            There was an issue sending your inquiry. Please ensure your database is connected.
          </p>
        )}
      </div>
    </form>
  );
}