"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

type CatalogItem = {
  id: string;
  sku: string;
  title: string;
  category: string;
  images: string[];
  price?: string;
};

export default function Showcase() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    const fetchShowcaseItems = async () => {
      setLoading(true);
      // Fetch the entire catalog for pagination
      const { data, error } = await supabase
        .from('catalog_items')
        .select('id, sku, title, category, images')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching showcase items:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchShowcaseItems();
  }, [supabase]);

  // Pagination logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const visibleItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  return (
    <section className="py-[120px] px-6 md:px-20 bg-mgr-background overflow-hidden" id="showcase">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-24">
          <div>
            <p className="font-body text-xs text-mgr-primary mb-4 tracking-[0.3em] uppercase font-semibold">
              Curated Selection
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-mgr-foreground">
              The Showcase
            </h2>
          </div>
          
          {/* Aesthetic Navigation Arrows */}
          <div className="hidden md:flex gap-4">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="group w-14 h-14 border border-mgr-primary/30 rounded-full flex items-center justify-center hover:bg-mgr-primary/5 transition-all duration-500 text-mgr-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Previous item"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transform transition-transform duration-500 ${currentPage === 0 ? '' : 'group-hover:-translate-x-1'}`}
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button 
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className="group w-14 h-14 border border-mgr-primary/30 rounded-full flex items-center justify-center hover:bg-mgr-primary/5 transition-all duration-500 text-mgr-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Next item"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`transform transition-transform duration-500 ${currentPage >= totalPages - 1 ? '' : 'group-hover:translate-x-1'}`}
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center font-body text-xs text-mgr-text-neutral tracking-widest uppercase">
            Curating the showcase...
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center font-body text-xs text-mgr-text-neutral tracking-widest uppercase border border-mgr-primary/10">
            Archive is currently empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {visibleItems.map((item, idx) => (
              <Link 
                href={`/collections?sku=${item.sku}`}
                key={item.id} 
                className={`group cursor-pointer block ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
              >
                
                {/* Image Container with Hover Effects */}
                <div className="relative overflow-hidden mb-8 aspect-[4/5] bg-mgr-surface rounded-2xl border border-mgr-primary/15 shadow-xl transition-all duration-500 group-hover:border-mgr-primary/40">
                  <Image
                    src={item.images?.[0] || "https://res.cloudinary.com/hewpj3ti/image/upload/v1785046898/dress1_ywli2j.png"}
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                  
                  {/* High-Contrast Darkened SKU Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-black/80 backdrop-blur-md text-mgr-primary border border-mgr-primary/40 px-3.5 py-1.5 font-body text-[10px] font-semibold tracking-widest rounded-full uppercase shadow-lg">
                      {item.sku}
                    </span>
                  </div>
                  
                  {/* Gradient Overlay & Reveal Text */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-mgr-background/90 via-mgr-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8 md:p-12">
                    <span className="text-mgr-primary font-body text-xs tracking-[0.2em] border-b border-mgr-primary pb-2 uppercase hover:text-white transition-colors">
                      View in Archive
                    </span>
                  </div>
                </div>
                
                {/* Item Details */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-2xl text-mgr-foreground mb-2 group-hover:text-mgr-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-body text-[11px] text-mgr-text-neutral uppercase tracking-[0.2em]">
                      {item.category} Collection
                    </p>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}