import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface py-[80px] border-t border-primary/10">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-20 max-w-[1440px] mx-auto gap-12">
        
        {/* Footer Brand */}
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <Link href="/" className="font-display text-3xl text-primary tracking-[0.2em] block mb-2 text-shadow-gold">
            MGR COUTURE
          </Link>
          <span className="font-body text-xs text-on-surface-variant tracking-widest uppercase block">
            Bespoke Elegance
          </span>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6">
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body text-[10px] uppercase tracking-[0.2em]">
            Privacy Policy
          </Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body text-[10px] uppercase tracking-[0.2em]">
            Terms of Service
          </Link>
          <Link href="mailto:bbankmgr@gmail.com" className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-body text-[10px] uppercase tracking-[0.2em]">
            Contact
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-16 text-center border-t border-primary/5 pt-8 mx-6 md:mx-20 max-w-[1440px] md:mx-auto">
        <p className="text-on-surface-variant/60 font-body text-[10px] tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} MGR COUTURE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}