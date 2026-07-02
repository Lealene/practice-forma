import Link from "next/link";
import { Search } from "lucide-react";
import CartCounter from "./CartCounter";
import MobileMenu from "./MobileMenu";
import { staticNavLinks } from "@/lib/site-data";
import { Category } from "@/types/product";

interface NavbarProps {
  categories: Category[];
  announcements: string[];
  activeCategorySlug?: string;
}

export default function Navbar({
  categories,
  announcements,
  activeCategorySlug,
}: NavbarProps) {
  return (
    <header className="animate-nav sticky top-0 z-30">
      {/* Announcement Bar */}
      <div className="bg-[#233329] text-white text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-center">
          {announcements.map((text, i) => (
            <span key={i} className="flex items-center gap-4">
              {i > 0 && <span className="hidden sm:inline">•</span>}
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-background border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">

          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-[0.2em] sm:tracking-[0.3em] font-serif">
              FOR·MA
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 lg:gap-10 text-gray-700">
            {categories.map((category) => {
              const isActive = activeCategorySlug === category.slug;
              return (
                <Link
                  key={`nav-${category.slug}`}
                  href={`/products?category=${category.slug}`}
                  className={
                    isActive
                      ? "text-foreground border-b border-foreground pb-0.5"
                      : "hover:text-foreground transition"
                  }
                >
                  {category.name}
                </Link>
              );
            })}

            {staticNavLinks.map((link, index) => (
              <Link
                key={`nav-${link.href}-${index}`}
                href={link.href}
                className="hover:text-foreground transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-5">
            <Search size={20} />

            <CartCounter />

            <MobileMenu
              categories={categories}
              staticLinks={staticNavLinks}
              activeCategorySlug={activeCategorySlug}
            />
          </div>

        </div>
      </nav>
    </header>
  );
}
