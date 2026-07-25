import Image from "next/image";

export default function Showcase() {
  // Temporary mock data. You will eventually fetch this from Supabase.
  const galleryItems = [
    {
      id: "mgr_001",
      sku: "MGR-EVN-01",
      title: "The Royal Gown",
      collection: "Midnight Gold Collection",
      image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1200&auto=format&fit=crop", 
      actionText: "Request Fitting",
    },
    {
      id: "mgr_002",
      sku: "MGR-MN-01",
      title: "The Signature Blazer",
      collection: "Sovereign Navy Collection",
      image: "https://images.unsplash.com/photo-1593030761757-71fae4630bd1?q=80&w=1200&auto=format&fit=crop", 
      actionText: "Order Bespoke",
    },
  ];

  return (
    <section className="py-[120px] px-6 md:px-20 bg-background overflow-hidden" id="showcase">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-24">
          <div>
            <p className="font-body text-xs text-primary mb-4 tracking-[0.3em] uppercase">
              Curated Selection
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              The Showcase
            </h2>
          </div>
          
          {/* Optional Navigation Arrows (for future carousel implementation) */}
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="w-12 h-12 border border-primary/20 flex items-center justify-center hover:bg-primary/10 transition-colors text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {galleryItems.map((item, idx) => (
            <div key={item.id} className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}>
              
              {/* Image Container with Hover Effects */}
              <div className="relative overflow-hidden mb-8 aspect-[4/5] bg-surface">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                
                {/* Sky Blue SKU Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-secondary/10 backdrop-blur-md text-secondary border border-secondary/20 px-4 py-1.5 font-body text-[10px] tracking-widest rounded-full uppercase">
                    {item.sku}
                  </span>
                </div>
                
                {/* Gradient Overlay & Reveal Text */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8 md:p-12">
                  <span className="text-primary font-body text-xs tracking-[0.2em] border-b border-primary pb-2 uppercase hover:text-white transition-colors">
                    {item.actionText}
                  </span>
                </div>
              </div>
              
              {/* Item Details */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-2xl text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-[11px] text-on-surface-variant uppercase tracking-[0.2em]">
                    {item.collection}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}