"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedSlug = searchParams.get("category") ?? undefined;
  const isHome = pathname === "/";

  const buttons = [
    { name: "All", slug: undefined },
    ...categories.map((c) => ({ name: c.name, slug: c.slug })),
  ];

  const buildHref = (slug?: string) => {
    if (isHome) {
      return slug ? `/?category=${slug}#products` : "/#products";
    }
    return slug ? `${pathname}?category=${slug}` : pathname;
  };

  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {buttons.map((btn) => {
        const isActive =
          (btn.slug === undefined && !selectedSlug) ||
          btn.slug === selectedSlug;

        const href = buildHref(btn.slug);

        return (
          <Link
            key={btn.name}
            href={href}
            className={
              isActive
                ? "bg-green-deep text-white px-5 py-2 rounded-sm text-sm transition"
                : "border border-cream-border text-foreground px-5 py-2 rounded-sm text-sm hover:bg-white transition"
            }
          >
            {btn.name}
          </Link>
        );
      })}
    </div>
  );
}
