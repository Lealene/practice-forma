import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturesBar from "@/components/FeaturesBar";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import ScrollReveal from "@/components/ScrollReveal";
import Editorial from "@/components/Editorial";
import Newsletter from "@/components/Newsletter";
import { getProducts, getCategories, filterProductsByCategory } from "@/lib/api";
import {
  announcements,
  features,
  stats,
  editorialImage,
  footerColumns,
} from "@/lib/site-data";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category: selectedCategory } = await searchParams;
  const selectedSlug =
    typeof selectedCategory === "string" ? selectedCategory : undefined;

  const products = await getProducts();
  const categories = await getCategories();
  const firstProduct = products[0];

  const productCounts: Record<string, number> = {};
  for (const product of products) {
    const slug = product.category?.slug;
    if (slug) {
      productCounts[slug] = (productCounts[slug] ?? 0) + 1;
    }
  }

  const { products: filteredProducts, selectedCategoryName } =
    filterProductsByCategory(products, categories, selectedSlug);

  return (
    <>
      <Navbar
        categories={categories}
        announcements={announcements}
        activeCategorySlug={selectedSlug}
      />

      <Hero
        href={firstProduct ? `/products/${firstProduct.slug}` : "/"}
        product={firstProduct}
      />

      <FeaturesBar features={features} />

      <CategorySection categories={categories} productCounts={productCounts} />

      <ProductSection
        products={filteredProducts}
        categories={categories}
        selectedCategoryName={selectedCategoryName}
      />

      <ScrollReveal duration={800} offset={32}>
        <Editorial stats={stats} image={editorialImage} />
      </ScrollReveal>

      <ScrollReveal duration={700} offset={24}>
        <Newsletter />
      </ScrollReveal>

      <ScrollReveal duration={700} offset={20}>
        <Footer columns={footerColumns} />
      </ScrollReveal>
    </>
  );
}
