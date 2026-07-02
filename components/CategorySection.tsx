import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { Category } from "@/types/product";

interface CategorySectionProps {
  categories: Category[];
  productCounts?: Record<string, number>;
}

export default function CategorySection({
  categories,
  productCounts = {},
}: CategorySectionProps) {
  return (
    <section id="categories" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-background scroll-mt-32">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-gray-500">
            Shop by Room
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mt-3 max-w-2xl text-foreground">
            Everything has a place, and a reason for being there.
          </h2>
        </div>

        <Link href="/?#categories" className="border-b border-black text-foreground w-fit">
          View all categories
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, i) => {
          const imageUrl = category.image?.[0]?.url;
          const count = productCounts[category.slug] ?? 0;

          return (
            <ScrollReveal key={category.id} delay={i * 110} duration={750} offset={28}>
            <Link href={`/?category=${category.slug}#products`}>
              <div className="hover-lift relative h-56 sm:h-64 lg:h-[280px] overflow-hidden group">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}

                <div className="absolute inset-0 bg-black/20" />

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{category.name}</h3>

                  <p className="text-sm">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </p>
                </div>
              </div>
            </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
