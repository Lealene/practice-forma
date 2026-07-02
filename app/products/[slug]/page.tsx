import Link from "next/link";
import { getProduct, getCategories } from "@/lib/api";
import { footerColumns, announcements } from "@/lib/site-data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await getProduct(slug);
  const categories = await getCategories();
  const activeCategorySlug = product?.category?.slug;

  if (!product) {
    return (
      <>
        <Navbar
          categories={categories}
          announcements={announcements}
        />
        <main className="bg-background min-h-screen flex items-center justify-center p-4 sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground mb-4">
              Product not found
            </h1>
            <Link
              href="/"
              className="text-green-mid border-b border-green-mid pb-1"
            >
              Back to home
            </Link>
          </div>
        </main>
        <Footer columns={footerColumns} />
      </>
    );
  }

  return (
    <>
      <Navbar
        categories={categories}
        announcements={announcements}
        activeCategorySlug={activeCategorySlug}
      />

      <main className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pt-6 sm:pt-8">
          <Link
            href="/#products"
            className="text-muted hover:text-foreground transition"
          >
            ← Back to products
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mt-6 sm:mt-8">
            {/* Image Gallery */}
            <ProductGallery images={product.image} />

            {/* Details */}
            <div className="flex flex-col justify-center">
              <p className="uppercase tracking-[0.2em] text-xs text-muted mb-4">
                {product.category?.name}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
                {product.name}
              </h1>

              <p className="text-2xl sm:text-3xl font-semibold text-foreground mb-8">
                ${product.price.toLocaleString()}
              </p>

              {product.description && (
                <p className="text-muted leading-8 max-w-md mb-10 whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </main>

      <Footer columns={footerColumns} />
    </>
  );
}
