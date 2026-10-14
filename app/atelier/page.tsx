import Image from "next/image";
import ContactForm from "@/components/ContactForm"; // Adjust path if your component is elsewhere
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AtelierPage() {
  return (
    <div className="min-h-screen flex flex-col bg-mgr-background selection:bg-mgr-primary/30 selection:text-white">
      <Header />

      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          
          {/* Page Header */}
          <div className="mb-16 md:mb-24 text-center md:text-left">
            <p className="font-body text-xs text-mgr-primary mb-4 tracking-[0.3em] uppercase font-semibold">
              The Studio
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-mgr-foreground">
              Book Your Consultation
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column: The Bespoke Process & Imagery */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="font-body text-lg text-mgr-text-neutral mb-8 leading-relaxed">
                  Every MGR Couture garment is a dialogue between our craftsmanship and your distinct personality. Step into the atelier and let us bring your vision to reality with uncompromising precision.
                </p>
                
                <div className="space-y-8 mt-12 border-t border-mgr-primary/10 pt-12">
                  <div className="flex gap-6">
                    <span className="font-display text-2xl text-mgr-primary">01</span>
                    <div>
                      <h3 className="font-display text-xl text-mgr-foreground mb-2">The Vision</h3>
                      <p className="font-body text-sm text-mgr-text-neutral leading-relaxed">
                        Share your ideas, event details, and style preferences. We will advise on fabrics, cuts, and the perfect silhouette for your frame.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <span className="font-display text-2xl text-mgr-primary">02</span>
                    <div>
                      <h3 className="font-display text-xl text-mgr-foreground mb-2">The Canvas</h3>
                      <p className="font-body text-sm text-mgr-text-neutral leading-relaxed">
                        Precise measurements are taken to construct your unique pattern. No two bodies are the same, and neither are our blocks.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <span className="font-display text-2xl text-mgr-primary">03</span>
                    <div>
                      <h3 className="font-display text-xl text-mgr-foreground mb-2">The Masterpiece</h3>
                      <p className="font-body text-sm text-mgr-text-neutral leading-relaxed">
                        Following your fitting and final adjustments, your bespoke garment is delivered strictly on your timeline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aesthetic Image Filler */}
              <div className="relative w-full aspect-[4/3] mt-16 overflow-hidden hidden lg:block border border-mgr-primary/10">
                <Image 
                  src="https://res.cloudinary.com/hewpj3ti/image/upload/v1784989461/bg_image_zwjcjc.png"
                  alt="MGR Couture Atelier"
                  fill
                  unoptimized
                  className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-mgr-background/40 mix-blend-overlay"></div>
              </div>
            </div>

            {/* Right Column: The Contact Form */}
            <div className="lg:col-span-7 bg-mgr-surface border border-mgr-primary/10 p-8 md:p-12 relative overflow-hidden">
              {/* Subtle background glow inside the form container */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-mgr-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <h2 className="font-display text-3xl text-mgr-foreground mb-10 relative z-10">
                Submit an Inquiry
              </h2>
              
              <ContactForm />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}