"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const navLinks = [
    { 
      name: "Dashboard", 
      href: "/admin/dashboard",
      icon: <path d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />
    },
    { 
      name: "Inquiries", 
      href: "/admin/inquiries",
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    },
    { 
      name: "Catalog", 
      href: "/admin/catalog",
      icon: <path d="M4 3h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M4 13h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />
    },
    { 
      name: "Orders", 
      href: "/admin/orders",
      icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
    },
    { 
      name: "Settings", 
      href: "/admin/settings",
      icon: <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    }
  ];

  return (
    <div className="min-h-screen bg-mgr-background flex">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-mgr-surface border-r border-mgr-primary/10 flex flex-col fixed h-full z-20">
        
        {/* Brand Area */}
        <div className="h-24 flex items-center justify-center border-b border-mgr-primary/10 px-6">
          <Image 
            src="https://res.cloudinary.com/hewpj3ti/image/upload/v1785046551/mgr_logo_cropped_tua45d.png"
            alt="MGR Admin"
            width={120}
            height={30}
            unoptimized
            className="opacity-90 h-6 w-auto"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 transition-all duration-300 ${
                  isActive 
                    ? "bg-mgr-primary/10 text-mgr-primary border-l-2 border-mgr-primary" 
                    : "text-mgr-text-neutral hover:bg-mgr-primary/5 hover:text-mgr-foreground border-l-2 border-transparent"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {link.icon}
                </svg>
                <span className="font-body text-xs tracking-widest uppercase mt-0.5">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-mgr-primary/10 bg-mgr-background/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 text-mgr-text-neutral hover:text-red-400 transition-colors group"
          >
            <span className="font-body text-xs tracking-widest uppercase">Sign Out</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
            </svg>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10 md:p-16 relative">
        {/* Subtle background glow for the whole portal */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mgr-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}