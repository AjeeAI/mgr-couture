"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();

  const navLinks = [
    { name: "Collections", href: "/collections" },
    { name: "The Story", href: "/#story" },
    { name: "The Showcase", href: "/#showcase" },
    { name: "Atelier", href: "/atelier" },
  ];

  // Scrollspy logic to detect active hash section on the homepage
  useEffect(() => {
    // Only run intersection observer if we are on the homepage
    if (pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveHash("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`/#${entry.target.id}`);
          }
        });
      },
      // Triggers when the section crosses the middle 40% of the viewport
      { rootMargin: "-40% 0px -40% 0px" } 
    );

    // Observe the specific sections
    const sections = ["story", "showcase"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  // Helper function to determine if a link is currently active
  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && activeHash === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-mgr-background/90 backdrop-blur-xl border-b border-mgr-primary/20 transition-all">
      <nav className="flex justify-between items-center px-6 md:px-20 py-4 max-w-[1440px] mx-auto h-20">
        
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center transition-opacity hover:opacity-80 duration-300"
          >
            <Image 
              src="https://res.cloudinary.com/hewpj3ti/image/upload/v1785046551/mgr_logo_cropped_tua45d.png"
              alt="MGR Couture"
              width={180}
              height={50}
              unoptimized
              priority
              className="h-8 w-auto md:h-10"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`font-body text-xs uppercase tracking-widest transition-all duration-300 border-b pb-1 ${
                isActive(link.href)
                  ? "text-mgr-primary border-mgr-primary"
                  : "text-mgr-text-neutral border-transparent hover:text-mgr-foreground hover:border-mgr-primary/40"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Utility Icons (Cart & Account & Mobile Menu Toggle) */}
        <div className="flex items-center gap-6">
          <button 
            aria-label="Shopping Bag"
            className="text-mgr-primary hover:text-mgr-secondary transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
          
          <button 
            aria-label="Account"
            className="text-mgr-primary hover:text-mgr-secondary transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
            className="md:hidden text-mgr-primary hover:text-mgr-secondary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
        
      </nav>

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      
      {/* Dark Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] transition-opacity duration-500 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Slide-over Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-mgr-surface z-[201] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col border-l border-mgr-primary/20 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header & Close Button */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-mgr-primary/10 bg-mgr-surface">
          <span className="font-display text-sm tracking-widest uppercase text-mgr-primary">Menu</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close Mobile Menu"
            className="w-10 h-10 bg-mgr-background rounded-full flex items-center justify-center text-mgr-foreground hover:text-mgr-primary transition-colors border border-mgr-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex flex-col px-8 py-12 space-y-8 flex-grow bg-mgr-surface">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className={`transition-colors duration-300 font-display text-2xl tracking-wide uppercase ${
                isActive(link.href)
                  ? "text-mgr-primary"
                  : "text-mgr-foreground hover:text-mgr-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-8 border-t border-mgr-primary/10 text-center bg-mgr-surface">
          <p className="font-body text-[10px] text-mgr-text-neutral tracking-widest uppercase">
            MGR Couture • Bespoke Atelier
          </p>
        </div>
      </div>

    </header>
  );
}