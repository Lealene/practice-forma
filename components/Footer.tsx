import Link from "next/link";
import { FooterColumn } from "@/lib/site-data";

interface FooterProps {
  columns: FooterColumn[];
}

export default function Footer({ columns }: FooterProps) {
  return (
    <footer className="bg-foreground text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl tracking-[0.2em] sm:tracking-[0.3em] font-serif mb-4">
              FOR·MA
            </h2>

            <p className="text-gray-400 leading-7 max-w-xs">
              Considered furniture, made to order in Porto and shipped
              carbon-neutral across the world.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-4">
                {col.title}
              </h3>

              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 FORMA Studio. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Privacy · Terms · A demo build for learning Strapi
          </p>
        </div>
      </div>
    </footer>
  );
}
