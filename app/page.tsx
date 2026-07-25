import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Showcase from "@/components/Showcase";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Story />
        <Showcase />
        
        {/* Contact & Inquiries Section */}
        <section className="py-[120px] px-6 md:px-20 bg-surface relative overflow-hidden" id="contact">
          
          {/* Ambient Glow Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] -ml-24 -mb-24"></div>
          </div>

          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Contact Information */}
              <div className="lg:col-span-5">
                <p className="font-body text-xs text-primary mb-6 tracking-[0.3em] uppercase">
                  Let's Create
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8">
                  Begin Your Consultation
                </h2>
                <p className="font-body text-lg text-on-surface-variant mb-12 leading-[1.8]">
                  From red carpet events to corporate signature pieces, we are ready to bring your vision to life. Share your requirements and let our atelier guide you.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-foreground group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:text-secondary transition-colors"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <a href="mailto:bbankmgr@gmail.com" className="font-body text-sm tracking-widest hover:text-primary transition-colors">
                      bbankmgr@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="font-body text-sm tracking-widest">
                      Global Bespoke Service | Timely Worldwide Delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Form Wrapper */}
              <div className="lg:col-span-6 lg:col-start-7 mt-12 lg:mt-0">
                <ContactForm />
              </div>
              
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}