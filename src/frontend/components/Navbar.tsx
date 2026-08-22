'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  siteName: string;
}

export default function Navbar({ siteName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-primary-white/80 backdrop-blur-md border-b border-primary-beige">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl tracking-widest uppercase hover:opacity-80 transition-opacity">
            {siteName}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/#portfolio" className="text-sm tracking-widest uppercase hover:text-soft-clay transition-colors">
              Portfolio
            </Link>
            <Link href="/#about" className="text-sm tracking-widest uppercase hover:text-soft-clay transition-colors">
              About
            </Link>
            <Link href="/#services" className="text-sm tracking-widest uppercase hover:text-soft-clay transition-colors">
              Services
            </Link>
            <Link href="/#contact" className="text-sm tracking-widest uppercase hover:text-soft-clay transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-charcoal hover:text-soft-clay focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-primary-white border-b border-primary-beige px-6 py-8 space-y-6 flex flex-col items-center shadow-lg transition-all duration-300">
          <Link
            href="/#portfolio"
            onClick={() => setIsOpen(false)}
            className="text-base tracking-widest uppercase hover:text-soft-clay transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="text-base tracking-widest uppercase hover:text-soft-clay transition-colors"
          >
            About
          </Link>
          <Link
            href="/#services"
            onClick={() => setIsOpen(false)}
            className="text-base tracking-widest uppercase hover:text-soft-clay transition-colors"
          >
            Services
          </Link>
          <Link
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="text-base tracking-widest uppercase hover:text-soft-clay transition-colors"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
