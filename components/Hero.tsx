import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-background">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1594938298596-70f56fb3cecb?q=80&w=2000&auto=format&fit=crop" // Temporary placeholder
          alt="MGR Couture Bespoke Tailoring"
          fill
          priority
          className="object-cover brightness-[0.4] scale-105" // Darkened to let text pop
        />
        {/* Subtle radial gradient to blend the image into the deep navy */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/50 to-background"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 md:px-20 max-w-[1440px] mx-auto w-full">
        <div className="max-w-2xl">
          <p className="font-body text-xs text-primary mb-6 tracking-[0.3em] uppercase">
            Bespoke Artistry
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-8 leading-[1.1]">
            Own Your Style.<br />
            <span className="italic font-normal text-slate-300">On Your Terms.</span>
          </h1>
          <p className="font-body text-lg text-on-surface-variant mb-12 max-w-lg leading-relaxed">
            Bespoke elegance, precise tailoring, and timely delivery. Let your style speak before you do in garments crafted to mirror your distinct character.
          </p>
          
          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="#showcase" 
              className="bg-primary text-background px-10 py-5 font-body text-xs uppercase tracking-widest text-center transition-all duration-300 hover:bg-white gold-bloom"
            >
              View Collections
            </Link>
            <Link 
              href="#contact" 
              className="border border-primary/40 text-primary px-10 py-5 font-body text-xs uppercase tracking-widest text-center transition-all duration-300 hover:bg-secondary/10 hover:border-secondary hover:text-secondary"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent"></div>
      </div>
    </section>
  );
}