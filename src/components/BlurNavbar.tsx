"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface BlurNavbarProps {
  logo?: React.ReactNode;
  items?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

const defaultItems: NavItem[] = [
  { label: "Home", href: "#" },
  { label: "Proyectos", href: "#projects" },
  { label: "Blog", href: "/blog" },
];

export function BlurNavbar({
  logo,
  items = defaultItems,
  ctaLabel = "Contacto",
  ctaHref = "#contact",
}: BlurNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700/50 rounded-full px-4 sm:px-6"
        >
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              {logo || (
                <span className="text-white font-medium text-sm sm:text-base">
                  Diego Cancino
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={ctaHref}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                {ctaLabel}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white text-xl font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={ctaHref}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-8 py-3 bg-white text-black text-base font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                {ctaLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BlurNavbar;
