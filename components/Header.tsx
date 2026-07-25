import Link from "next/link";

export default function Header() {
  const navLinks = [
    { name: "Collections", href: "#collections" },
    { name: "The Story", href: "#story" },
    { name: "The Showcase", href: "#showcase" },
    { name: "Atelier", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-primary/20 transition-all">
      <nav className="flex justify-between items-center px-6 md:px-20 py-4 max-w-[1440px] mx-auto h-20">
        
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="font-display text-2xl text-primary tracking-[0.2em] leading-none hover:text-white transition-colors duration-300 text-shadow-gold"
          >
            MGR COUTURE
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-on-surface-variant hover:text-secondary transition-colors duration-300 font-body text-xs uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Utility Icons (Cart & Account) */}
        <div className="flex items-center gap-6">
          <button 
            aria-label="Shopping Bag"
            className="text-primary hover:text-secondary transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </button>
          
          <button 
            aria-label="Account"
            className="text-primary hover:text-secondary transition-all duration-300 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {/* Mobile Menu Toggle (Visible only on small screens) */}
          <button className="md:hidden text-primary hover:text-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
        
      </nav>
    </header>
  );
}