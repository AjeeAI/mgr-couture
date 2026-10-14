"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- MOCK DATA LOOKUP ---
// In a full production app, you might fetch this from Supabase, 
// but since we have a mock array, we can look it up here.
const catalogItems = [
  { sku: "MGR-EVN-01", title: "The Royal Gown", image: "https://res.cloudinary.com/hewpj3ti/image/upload/v1785046898/dress1_ywli2j.png" },
  { sku: "MGR-MN-01", title: "The Signature Blazer", image: "https://res.cloudinary.com/hewpj3ti/image/upload/v1785046905/suit1_ihwsty.png" },
  { sku: "MGR-EVN-02", title: "Midnight Silhouette", image: "https://res.cloudinary.com/hewpj3ti/image/upload/v1785046898/dress1_ywli2j.png" },
  { sku: "MGR-MN-02", title: "Sovereign Tuxedo", image: "https://res.cloudinary.com/hewpj3ti/image/upload/v1785046905/suit1_ihwsty.png" },
  { sku: "MGR-CST-01", title: "The Signature Ensemble", image: "https://res.cloudinary.com/hewpj3ti/image/upload/v1785268022/IMG-20260728-WA0086_ron9ol.jpg" },
];

function FormContent() {
  const searchParams = useSearchParams();
  const prefilledSku = searchParams.get('sku') || ''; 
  
  // Look up the full details using the SKU
  const matchedItem = catalogItems.find(item => item.sku === prefilledSku);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const submittedSku = formData.get('sku') as string;
    
    // Check if they manually typed a SKU or used the prefilled one
    const itemDetails = catalogItems.find(item => item.sku === submittedSku);

    const eventDateRaw = formData.get('eventDate') as string;

    const data = {
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      event_date: eventDateRaw ? eventDateRaw : null,
      sku_reference: submittedSku || null,
      special_requests: formData.get('requests') || null,
      // Add the extra details if we found a match
      item_title: itemDetails ? itemDetails.title : null,
      item_image_url: itemDetails ? itemDetails.image : null,
      created_at: new Date().toISOString(),
    };

    // Insert into your Supabase 'inquiries' table
    // *NOTE: Make sure to add `item_title` and `item_image_url` columns to your Supabase table!
    const { error } = await supabase.from('inquiries').insert([data]);

    if (error) {
      console.error('Supabase Error:', error);
      setStatus('error');
    } else {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      
      // Build a highly detailed WhatsApp Message
      const whatsappNumber = "2349065440091"; 
      
      let message = `Hello MGR Couture! I am *${data.full_name}*.\n\nI would like to book a bespoke consultation.`;
      
      if (itemDetails) {
        message += `\n\n*Inquiry Details:*\nPiece: ${itemDetails.title}\nSKU: ${data.sku_reference}\nReference Image: ${itemDetails.image}`;
      } else if (data.sku_reference) {
        message += `\n\n*Inquiry Details:*\nCustom Request / SKU: ${data.sku_reference}`;
      }

      if (data.special_requests) {
        message += `\n\n*My Notes:*\n${data.special_requests}`;
      }
      
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        setStatus('idle');
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl mx-auto relative z-10">
      
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative">
          <label htmlFor="fullName" className="block font-body text-[10px] text-mgr-text-neutral mb-4 uppercase tracking-[0.2em]">
            Full Name <span className="text-mgr-primary">*</span>
          </label>
          <input 
            type="text" 
            id="fullName"
            name="fullName" 
            required 
            placeholder="Evelyn Thorne"
            className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none" 
          />
        </div>
        
        <div className="relative">
          <label htmlFor="email" className="block font-body text-[10px] text-mgr-text-neutral mb-4 uppercase tracking-[0.2em]">
            Email Address <span className="text-mgr-primary">*</span>
          </label>
          <input 
            type="email" 
            id="email"
            name="email" 
            required 
            placeholder="evelyn@domain.com"
            className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none" 
          />
        </div>
      </div>

      {/* Phone and Event Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative">
          <label htmlFor="phone" className="block font-body text-[10px] text-mgr-text-neutral mb-4 uppercase tracking-[0.2em]">
            WhatsApp / Contact <span className="text-mgr-primary">*</span>
          </label>
          <input 
            type="tel" 
            id="phone"
            name="phone" 
            required 
            placeholder="+1 (555) 000-0000"
            className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none" 
          />
        </div>
        
        <div className="relative">
          <label htmlFor="eventDate" className="block font-body text-[10px] text-mgr-text-neutral mb-4 uppercase tracking-[0.2em]">
            Event Date
          </label>
          <input 
            type="date" 
            id="eventDate"
            name="eventDate" 
            className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors text-mgr-foreground font-body text-sm outline-none cursor-pointer" 
          />
        </div>
      </div>

      {/* SKU Reference */}
      <div className="relative">
        <label htmlFor="sku" className="block font-body text-[10px] text-mgr-text-neutral mb-4 uppercase tracking-[0.2em]">
          Design SKU or Vision
        </label>
        <input 
          type="text" 
          id="sku"
          name="sku" 
          defaultValue={prefilledSku}
          placeholder="e.g. MGR-EVN-01 or custom request"
          className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none" 
        />
        {/* UX Bonus: Show the user which dress they selected */}
        {matchedItem && (
          <p className="mt-2 text-xs text-mgr-primary font-body tracking-wider">
            Selected: {matchedItem.title}
          </p>
        )}
      </div>

      {/* Special Requests Textarea */}
      <div className="relative">
        <label htmlFor="requests" className="block font-body text-[10px] text-mgr-text-neutral mb-4 uppercase tracking-[0.2em]">
          Special Requests
        </label>
        <textarea 
          id="requests"
          name="requests" 
          rows={4}
          placeholder="Details about your style, occasion, and specific requirements..."
          className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm resize-none outline-none"
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
              : 'bg-mgr-primary/10 text-mgr-primary border border-mgr-primary/40 hover:bg-mgr-primary hover:text-mgr-background gold-bloom'
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {status === 'idle' && 'Send Inquiry'}
          {status === 'loading' && 'Transmitting...'}
          {status === 'success' && 'Redirecting to WhatsApp...'}
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

export default function ContactForm() {
  return (
    <Suspense fallback={
      <div className="w-full py-20 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-mgr-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <FormContent />
    </Suspense>
  );
}