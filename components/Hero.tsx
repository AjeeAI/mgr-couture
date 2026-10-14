import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-mgr-background mt-10">
      
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://res.cloudinary.com/hewpj3ti/image/upload/v1784989461/bg_image_zwjcjc.png"
          alt="MGR Couture"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.7]" 
        />
        <div className="absolute inset-0 bg-mgr-background/60"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 md:px-20 max-w-[1440px] mx-auto w-full">
        <div className="max-w-2xl">
          <p className="font-body text-xs text-mgr-primary mb-6 tracking-[0.3em] uppercase">
            Bespoke Artistry
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-mgr-foreground mb-8 leading-[1.1]">
            Own Your Style.<br />
            <span className="italic font-normal text-slate-300">On Your Terms.</span>
          </h1>
          <p className="font-body text-lg text-mgr-text-neutral mb-12 max-w-lg leading-relaxed">
            Bespoke elegance, precise tailoring, and timely delivery. Let your style speak before you do in garments crafted to mirror your distinct character.
          </p>
          
          {/* Call to Actions - Fixed Layout */}
          <div className="flex flex-wrap items-start gap-6 mt-4">
            <Link 
              href="#showcase" 
              className="w-max bg-mgr-primary text-mgr-background px-10 py-5 font-body text-xs uppercase tracking-widest text-center transition-all duration-300 hover:bg-white gold-bloom"
            >
              View Collections
            </Link>
            <Link 
              href="#contact" 
              className="w-max border border-mgr-primary text-mgr-primary px-10 py-5 font-body text-xs uppercase tracking-widest text-center transition-all duration-300 hover:bg-mgr-secondary/10 hover:border-mgr-secondary hover:text-white opacity-80 hover:opacity-100"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <div className="w-[1px] h-16 bg-gradient-to-b from-mgr-primary to-transparent"></div>
      </div>
    </section>
  );
}