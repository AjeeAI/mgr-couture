import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-mgr-surface py-[80px] border-t border-mgr-primary/10">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-20 max-w-[1440px] mx-auto gap-12">
        
        {/* Footer Brand */}
        <div className="mb-8 md:mb-0 text-center md:text-left flex flex-col items-center md:items-start">
          <Link href="/" className="block mb-4 transition-opacity hover:opacity-80 duration-300">
            <Image 
              src="https://res.cloudinary.com/hewpj3ti/image/upload/v1785046551/mgr_logo_cropped_tua45d.png"
              alt="MGR Couture"
              width={180}
              height={50}
              unoptimized
              className="h-8 w-auto md:h-10"
            />
          </Link>
          <span className="font-body text-xs text-mgr-text-neutral tracking-widest uppercase block">
            Bespoke Elegance
          </span>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-6">
          <Link href="#" className="text-mgr-text-neutral hover:text-mgr-primary transition-colors duration-300 font-body text-[10px] uppercase tracking-[0.2em]">
            Privacy Policy
          </Link>
          <Link href="#" className="text-mgr-text-neutral hover:text-mgr-primary transition-colors duration-300 font-body text-[10px] uppercase tracking-[0.2em]">
            Terms of Service
          </Link>
          <Link href="mailto:bbankmgr@gmail.com" className="text-mgr-text-neutral hover:text-mgr-primary transition-colors duration-300 font-body text-[10px] uppercase tracking-[0.2em]">
            Contact
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-16 text-center border-t border-mgr-primary/5 pt-8 mx-6 md:mx-20 max-w-[1440px] md:mx-auto">
        <p className="text-mgr-text-neutral/60 font-body text-[10px] tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} MGR COUTURE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}