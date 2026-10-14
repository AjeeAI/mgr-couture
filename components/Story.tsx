import Image from "next/image";

export default function Story() {
  return (
    <section className="py-[120px] px-6 md:px-20 bg-mgr-surface" id="story">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="md:col-span-6 mb-16 md:mb-0">
            <p className="font-body text-xs text-mgr-primary mb-4 tracking-[0.3em] uppercase">
              The Origin
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-mgr-foreground mb-8">
              Who is MGR?
            </h2>
            
            <div className="space-y-6 font-body text-lg text-mgr-text-neutral leading-[1.8]">
              <p>
                MGR Couture was born out of a personal necessity—the desire to put an end to the frustrating delays and sudden, unspoken style changes that often come with traditional tailors. 
              </p>
              <p>
                I am a fashion designer with an uncompromising eye for detail and precise sewing. My sense of color brings modern styles to life, while my creative artistry ensures every single piece carries its own distinct character. 
              </p>
              <p>
                My ultimate goal is to make sure your outfits match your personality perfectly, ensuring that your style speaks for you before you even say a word. You deserve garments that fit your body, your taste, and your occasion flawlessly, without waiting on anyone else&apos;s timeline.
              </p>
            </div>

            {/* Brand Pillars / Stats */}
            <div className="mt-12 pt-12 border-t border-mgr-primary/20 flex flex-wrap gap-12">
              <div>
                <span className="font-display text-4xl text-mgr-primary block mb-2">100%</span>
                <span className="font-body text-xs text-mgr-text-neutral uppercase tracking-widest">Timely Delivery</span>
              </div>
              <div>
                <span className="font-display text-4xl text-mgr-primary block mb-2">Bespoke</span>
                <span className="font-body text-xs text-mgr-text-neutral uppercase tracking-widest">To Your Personality</span>
              </div>
            </div>
          </div>

          {/* Image / Headshot Section */}
          <div className="md:col-span-5 md:col-start-8 relative group">
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm">
              <Image 
                src="https://res.cloudinary.com/hewpj3ti/image/upload/v1785047281/about_image_zuooi6.png" 
                alt="MGR Couture Founder"
                fill
                unoptimized
                className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
              />
              
              {/* Subtle Sky Blue Glow hidden behind the image */}
              <div className="absolute inset-0 bg-mgr-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay"></div>
            </div>
            
            {/* Gold Accent Frame */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-mgr-primary/30 z-[-1] transition-transform duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-mgr-secondary/20 z-[-1] transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2"></div>
          </div>

        </div>
      </div>
    </section>
  );
}