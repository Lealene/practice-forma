"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "@/lib/site-data";
import { Category } from "@/types/product";

interface MobileMenuProps {
  categories: Category[];
  staticLinks: NavLink[];
  activeCategorySlug?: string;
}

export default function MobileMenu({
  categories,
  staticLinks,
  activeCategorySlug,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="text-foreground">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-gray-200 py-4 px-4 sm:px-8 flex flex-col gap-4">
          {categories.map((category) => {
            const isActive = activeCategorySlug === category.slug;
            return (
              <Link
                key={`mobile-${category.slug}`}
                href={`/products?category=${category.slug}`}
                onClick={() => setOpen(false)}
                className={
                  isActive
                    ? "text-foreground border-b border-foreground pb-0.5 w-fit"
                    : "text-gray-700"
                }
              >
                {category.name}
              </Link>
            );
          })}

          {staticLinks.map((link, index) => (
            <Link
              key={`mobile-${link.href}-${index}`}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
