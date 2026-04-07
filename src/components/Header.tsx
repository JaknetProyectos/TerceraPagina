"use client";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import { Menu, X, ShoppingBagIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  // Definimos los items dentro para usar la función 't'
  const navItems = [
    { href: "/#", label: t('nav.home') },
    { href: "/#asistencia", label: t('nav.assistance') },
    { href: "/#eligenos", label: t('nav.why_us') },
    { href: "/#contacto", label: t('nav.contact') },
    { href: "/experiencias", label: t('nav.book_now') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white elevation-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/wondermx.png"
              alt="WonderMx Logo"
              width={50}
              height={50}
              priority
            />
            <span className="font-medium text-[var(--md-on-surface)] text-lg hidden sm:block">
              Wonder Mx
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-[var(--md-on-surface-medium)] hover:text-[var(--md-primary)] hover:bg-[var(--md-primary)]/5 rounded transition-colors font-medium text-sm uppercase tracking-wide"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart Link */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ShoppingBagIcon className="w-6 h-6" />

              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 text-[var(--md-on-surface-medium)] hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-[var(--md-on-surface)] hover:bg-gray-50 rounded font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}