"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createBrowserClient } from '@supabase/ssr';

type CatalogItem = {
  id: string;
  sku: string;
  title: string;
  category: string;
  images: string[];
  description: string;
  price?: string;
};

const categories = ["All", "Gowns", "Suits", "Traditional"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

function CollectionsContent() {
  const searchParams = useSearchParams();
  const preselectedSku = searchParams.get('sku');

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Inquiry form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch catalog items from Supabase database on load
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching public catalog:", error);
      } else {
        const catalogItems = data || [];
        setItems(catalogItems);

        // Auto-select garment if SKU was passed in query params (e.g. from homepage showcase)
        if (preselectedSku) {
          const match = catalogItems.find(
            (it) => it.sku.toLowerCase() === preselectedSku.toLowerCase()
          );
          if (match) {
            setSelectedItem(match);
          }
        }
      }
      setLoading(false);
    };

    fetchCatalog();
  }, [preselectedSku]);

  // Prevent background scrolling when the slide-over is open & reset form
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentImageIndex(0); 
      setFullName("");
      setEmail("");
      setPhone("");
      setEventDate("");
      setSpecialRequests("");
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedItem]);

  // Auto-scroll carousel logic
  useEffect(() => {
    if (!selectedItem || !selectedItem.images || selectedItem.images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedItem.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedItem]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem && selectedItem.images) {
      setCurrentImageIndex((prev) => prev === selectedItem.images.length - 1 ? 0 : prev + 1);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem && selectedItem.images) {
      setCurrentImageIndex((prev) => prev === 0 ? selectedItem.images.length - 1 : prev - 1);
    }
  };

  // Handle Form Submission, Database Logging, and WhatsApp Handoff
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);

    try {
      const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString() : "Not specified";

      // 1. Save lead securely to Supabase inquiries table
      const { error } = await supabase.from('inquiries').insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          event_date: eventDate || null,
          sku_reference: selectedItem.sku,
          item_title: selectedItem.title,
          special_requests: `Event / Collection Date: ${formattedDate}\nNotes: ${specialRequests || "None"}`,
        }
      ]);

      if (error) {
        console.error("Database log error:", error.message);
      }

      // 2. Format pre-filled WhatsApp message including image link, event date, and client details
      const primaryImage = selectedItem.images?.[0] || "";
      const message = encodeURIComponent(
        `Hello MGR Couture, I have submitted an inquiry on your website and would like to proceed.\n\n` +
        `*Piece:* ${selectedItem.title} (${selectedItem.sku})\n` +
        `*Category:* ${selectedItem.category}\n\n` +
        `*Client Name:* ${fullName}\n` +
        `*Phone / WhatsApp:* ${phone}\n` +
        `*Email:* ${email}\n` +
        `*Event / Collection Date:* ${formattedDate}\n` +
        `*Notes:* ${specialRequests || "None"}\n\n` +
        `*Lookbook Image Preview:* ${primaryImage}`
      );

      const whatsappUrl = `https://wa.me/2349065440091?text=${message}`;

      // 3. Close slide-over and open WhatsApp handoff
      setSelectedItem(null);
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error("Submission failed:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-mgr-background selection:bg-mgr-primary/30 selection:text-white">
      <Header />

      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          
          {/* Page Header */}
          <div className="mb-16 text-center">
            <p className="font-body text-xs text-mgr-primary mb-4 tracking-[0.3em] uppercase font-semibold">
              The Archive
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-mgr-foreground mb-6">
              Our Collections
            </h1>
            <p className="font-body text-mgr-text-neutral max-w-xl mx-auto">
              Explore our curated selection of bespoke garments. Each piece is a testament to meticulous craftsmanship and timeless design.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-mgr-primary/10 pb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`font-body text-xs tracking-widest uppercase transition-colors duration-300 ${
                  activeCategory === category 
                    ? "text-mgr-primary border-b border-mgr-primary pb-1" 
                    : "text-mgr-text-neutral hover:text-mgr-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="py-24 text-center font-body text-xs text-mgr-text-neutral tracking-widest uppercase">
              Loading collections from archive...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-24 text-center font-body text-xs text-mgr-text-neutral tracking-widest uppercase">
              No garments found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-mgr-surface rounded-2xl border border-mgr-primary/15 shadow-xl transition-all duration-500 group-hover:border-mgr-primary/40">
                    <Image
                      src={item.images?.[0] || "https://res.cloudinary.com/hewpj3ti/image/upload/v1785046898/dress1_ywli2j.png"}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />

                    {/* Darkened High-Contrast SKU Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-black/80 backdrop-blur-md text-mgr-primary border border-mgr-primary/40 px-3 py-1 font-body text-[10px] font-semibold tracking-widest rounded-full uppercase shadow-lg">
                        {item.sku}
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 bg-mgr-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="bg-mgr-background/90 backdrop-blur-md border border-mgr-primary/40 text-mgr-primary font-body text-[10px] tracking-widest px-6 py-3 uppercase rounded-full gold-bloom">
                        View Details
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <p className="font-body text-[10px] text-mgr-text-neutral tracking-widest uppercase mb-1">
                      {item.category}
                    </p>
                    <h3 className="font-display text-xl text-mgr-foreground transition-colors group-hover:text-mgr-primary mb-2">
                      {item.title}
                    </h3>
                    {item.price && (
                      <p className="font-body text-sm text-mgr-primary tracking-wider">
                        {item.price}
                      </p>
                    )}
                  </div>
                  
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* --- SLIDE-OVER OVERLAY & PANEL --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          selectedItem ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSelectedItem(null)}
      ></div>

      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-mgr-surface z-[101] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col border-l border-mgr-primary/20 overflow-y-auto ${
          selectedItem ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedItem && (
          <div className="flex flex-col min-h-full">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-mgr-background/50 backdrop-blur-md rounded-full flex items-center justify-center text-mgr-foreground hover:text-mgr-primary hover:bg-mgr-background transition-colors border border-mgr-primary/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Feature Image Carousel */}
            <div className="relative w-full aspect-[4/5] bg-mgr-background group flex-shrink-0">
              {selectedItem.images?.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`${selectedItem.title} - Image ${idx + 1}`}
                  fill
                  unoptimized
                  className={`object-cover transition-opacity duration-700 ease-in-out ${
                    idx === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                />
              ))}

              {/* Carousel Navigation */}
              {selectedItem.images && selectedItem.images.length > 1 && (
                <>
                  <div className="absolute inset-0 flex items-center justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={handlePrevImage}
                      className="w-10 h-10 rounded-full bg-mgr-background/30 backdrop-blur-sm border border-mgr-primary/30 flex items-center justify-center text-white hover:bg-mgr-primary/20 hover:text-mgr-primary transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="w-10 h-10 rounded-full bg-mgr-background/30 backdrop-blur-sm border border-mgr-primary/30 flex items-center justify-center text-white hover:bg-mgr-primary/20 hover:text-mgr-primary transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                    {selectedItem.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`h-1 transition-all duration-500 rounded-full ${
                          idx === currentImageIndex 
                            ? "w-6 bg-mgr-primary" 
                            : "w-2 bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Details & Inquiry Form Content */}
            <div className="p-8 md:p-12 flex-grow">
              <p className="font-body text-[10px] text-mgr-primary tracking-widest uppercase mb-4">
                {selectedItem.sku} • {selectedItem.category}
              </p>
              <h2 className="font-display text-3xl text-mgr-foreground mb-2">
                {selectedItem.title}
              </h2>
              {selectedItem.price && (
                <p className="font-body text-xl text-mgr-primary tracking-wider mb-4">
                  {selectedItem.price}
                </p>
              )}
              
              <div className="space-y-4 font-body text-sm text-mgr-text-neutral leading-relaxed mb-8">
                <p>{selectedItem.description}</p>
              </div>

              {/* Inquiry Form */}
              <form onSubmit={handleInquirySubmit} className="space-y-6 pt-6 border-t border-mgr-primary/25">
                <h3 className="font-display text-xl text-mgr-foreground">
                  Consultation & Inquiry
                </h3>
                <p className="font-body text-xs text-mgr-text-neutral">
                  Fill out your details below to log your inquiry and proceed directly to WhatsApp with your lookbook request.
                </p>

                <div>
                  <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Victoria Sterling"
                    className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. victoria@example.com"
                    className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none"
                  />
                </div>

                {/* Phone and Event Date Row (Using Preferred Design) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label htmlFor="phone" className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-[0.2em]">
                      WhatsApp / Contact <span className="text-mgr-primary">*</span>
                    </label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none" 
                    />
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="eventDate" className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-[0.2em]">
                      Event / Collection Date
                    </label>
                    <input 
                      type="date" 
                      id="eventDate"
                      name="eventDate" 
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors text-mgr-foreground font-body text-sm outline-none cursor-pointer" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-[10px] text-mgr-text-neutral mb-2 uppercase tracking-widest">Special Requests / Timeline Notes</label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Mention any custom measurements or event details..."
                    className="w-full bg-transparent border-0 border-b border-mgr-primary/30 focus:border-mgr-secondary focus:ring-0 px-0 py-3 transition-colors placeholder:text-mgr-text-neutral/30 text-mgr-foreground font-body text-sm outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 flex items-center justify-center bg-mgr-primary/10 text-mgr-primary border border-mgr-primary/40 hover:bg-mgr-primary hover:text-mgr-background transition-all duration-300 font-body text-xs uppercase tracking-widest font-bold gold-bloom disabled:opacity-50 cursor-pointer mt-4"
                >
                  {isSubmitting ? "Logging Lead..." : "Submit & Continue to WhatsApp ➔"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-mgr-background">
          <div className="w-8 h-8 border-2 border-mgr-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}