import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";
import { getProducts, getCategories, filterProductsByCategory } from "@/lib/api";
import { announcements, footerColumns } from "@/lib/site-data";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category: selectedCategory } = await searchParams;
  const selectedSlug =
    typeof selectedCategory === "string" ? selectedCategory : undefined;

  const products = await getProducts();
  const categories = await getCategories();

  const { products: filteredProducts, selectedCategoryName } =
    filterProductsByCategory(products, categories, selectedSlug);

  return (
    <>
      <Navbar
        categories={categories}
        announcements={announcements}
        activeCategorySlug={selectedSlug}
      />

      <ProductSection
        products={filteredProducts}
        categories={categories}
        selectedCategoryName={selectedCategoryName}
      />

      <Footer columns={footerColumns} />
    </>
  );
}
