import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import ProductPreviewTrigger from "./ProductPreviewTrigger";

interface HeroProps {
  href: string;
  product?: Product;
}

export default function Hero({ href, product }: HeroProps) {
  const imageUrl = product?.image?.[0]?.url;

  return (
    <section className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="animate-hero animate-hero-1 flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-green-mid" />
              <p className="uppercase tracking-[0.3em] text-xs text-green-mid">
                Spring Collection 2026
              </p>
            </div>

            <h1 className="animate-hero animate-hero-2 text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.05] font-serif text-foreground">
              Furniture made to
              <br />
              be{" "}
              <span className="italic text-green-mid">
                lived with.
              </span>
            </h1>

            <p className="animate-hero animate-hero-3 mt-8 max-w-md text-muted leading-8">
              Solid oak, natural wool, and quiet, considered lines.
              Pieces built once, kept for decades, never thrown away.
            </p>

            <div className="animate-hero animate-hero-4 flex flex-col xs:flex-row gap-3 xs:gap-4 mt-10">
              <Link
                href={href}
                className="btn-press bg-green-deep text-white px-6 sm:px-8 py-4 rounded-sm hover:bg-green-hover text-center"
              >
                Shop the collection →
              </Link>

              <a
                href="#categories"
                className="btn-press border border-cream-border px-6 sm:px-8 py-4 rounded-sm hover:bg-white text-center"
              >
                Explore by room
              </a>
            </div>
          </div>

          {/* Right Content */}
          {product && (
            <ProductPreviewTrigger product={product} className="relative">
              <div className="animate-hero-img relative h-72 sm:h-96 md:h-[520px] lg:h-[650px] rounded-sm overflow-hidden shadow-2xl bg-gray-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1023px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Floating Card */}
              <div className="absolute left-0 sm:-left-6 -bottom-4 sm:-bottom-6 bg-background p-5 sm:p-6 shadow-xl w-[200px] sm:w-[220px]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
                  Featured
                </p>

                <h3 className="mt-2 text-2xl font-serif text-foreground">
                  {product.name}
                </h3>

                <p className="mt-3 text-lg text-foreground">
                  ${product.price.toLocaleString()}
                </p>
              </div>
            </ProductPreviewTrigger>
          )}
        </div>
      </div>
    </section>
  );
}
