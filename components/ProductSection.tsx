import Link from "next/link";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";
import ScrollReveal from "./ScrollReveal";
import { Product, Category } from "@/types/product";

interface ProductSectionProps {
  products: Product[];
  categories: Category[];
  selectedCategoryName?: string;
}

export default function ProductSection({
  products,
  categories,
  selectedCategoryName,
}: ProductSectionProps) {
  return (
    <main id="products" className="bg-background p-4 sm:p-6 lg:p-8 scroll-mt-32">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
        <div>
          <p className="uppercase tracking-[0.2em] text-xs text-gray-500">
            {selectedCategoryName ? selectedCategoryName : "The collection"}
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mt-3 max-w-2xl text-foreground">
            {selectedCategoryName
              ? `${products.length} ${products.length === 1 ? "piece" : "pieces"} in ${selectedCategoryName}`
              : "Best sellers, chosen by people who keep things for years."}
          </h2>
        </div>

        <Link href="/#products" className="border-b border-black text-foreground w-fit">
          View all products
        </Link>
      </div>

      <CategoryFilter categories={categories} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product, i: number) => (
          <ScrollReveal
            key={product.id}
            delay={(i % 3) * 110}
            duration={650}
            offset={28}
          >
            <ProductCard product={product} collection={products} />
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
