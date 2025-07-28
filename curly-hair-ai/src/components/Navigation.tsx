'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-surface-primary/95 backdrop-blur-md border-b border-border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition-all duration-200 hover:opacity-90"
          >
            {/* Curly Hair Silhouette SVG */}
            <div className="relative">
              <Image src="/curly-hair-silhouette.png" alt="Curly Hair Silhouette" width={32} height={32} />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-accent/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-text-primary leading-tight">
                curly-hair-ai
              </h1>
              <p className="text-xs text-text-muted font-medium tracking-wide">
                Expert Hair Analysis
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" active={pathname === '/'}>
              Analyze
            </NavLink>
            <NavLink href="/about" active={pathname === '/about'}>
              About
            </NavLink>
            <a href="https://www.kerastase.com/kerastase-club/most-asked/hair-guide/the-scientific-truth-behind-curly-hair" target="_blank" rel="noopener noreferrer">
              Science
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-success text-text-inverse text-sm font-medium rounded-lg hover:bg-success-hover transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Start Analysis
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-surface-secondary transition-colors duration-200">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ 
  href, 
  active, 
  children 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode; 
}) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md group ${
        active 
          ? 'text-primary' 
          : 'text-text-muted hover:text-text-primary'
      }`}
    >
      {children}
      
      {/* Active indicator */}
      {active && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
      )}
      
      {/* Hover effect */}
      <span className="absolute inset-0 bg-hover-overlay rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></span>
    </Link>
  );
}