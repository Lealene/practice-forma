import { Product, Category, ProductImage } from "@/types/product";

const API_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
// Public URL for images — must be browser-resolvable (localhost), not Docker internal `strapi`
const PUBLIC_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

interface StrapiImage {
  id: number;
  url: string;
  name: string;
}

interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  image?: StrapiImage[];
}

interface RichTextText {
  text: string;
}

interface RichTextBlock {
  type: string;
  children?: RichTextText[];
}

interface StrapiProduct {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  description?: string | RichTextBlock[];
  image?: StrapiImage[];
  category?: StrapiCategory;
  material?: string;
  dimensions?: string;
  variants?: string | string[];
  stock?: number;
  [key: string]: unknown;
}

function absoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${PUBLIC_STRAPI_URL}${url}`;
}

function mapImages(images?: StrapiImage[]): ProductImage[] | undefined {
  if (!images) return undefined;
  return images.map((img) => ({
    id: img.id,
    name: img.name,
    url: absoluteUrl(img.url) ?? img.url,
  }));
}

function normalizeDescription(description?: string | RichTextBlock[]): string | undefined {
  if (!description) return undefined;
  if (typeof description === "string") return description;
  return description
    .map((block) =>
      block.children?.map((child) => child.text).join("") ?? "",
    )
    .join("\n\n");
}

function mapProduct(product: StrapiProduct): Product {
  return {
    ...product,
    description: normalizeDescription(product.description),
    image: mapImages(product.image),
    category: product.category
      ? {
          ...product.category,
          image: mapImages(product.category.image),
        }
      : undefined,
  } as unknown as Product;
}

function mapCategory(category: StrapiCategory): Category {
  return {
    ...category,
    image: mapImages(category.image),
  } as unknown as Category;
}

function isDynamicServerError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    (err as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE"
  );
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products?populate=*`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[api] getProducts failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return (data.data as StrapiProduct[]).map(mapProduct);
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.warn("[api] getProducts error:", err);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories?populate=*`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`[api] getCategories failed: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return (data.data as StrapiCategory[]).map(mapCategory);
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.warn("[api] getCategories error:", err);
    return [];
  }
}

export interface CategoryFilterResult {
  products: Product[];
  selectedCategoryName?: string;
}

export function filterProductsByCategory(
  products: Product[],
  categories: Category[],
  selectedSlug?: string,
): CategoryFilterResult {
  const filteredProducts = selectedSlug
    ? products.filter((p) => p.category?.slug === selectedSlug)
    : products;

  const selectedCategoryName = selectedSlug
    ? categories.find((c) => c.slug === selectedSlug)?.name
    : undefined;

  return { products: filteredProducts, selectedCategoryName };
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    const res = await fetch(
      `${API_URL}/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.warn(`[api] getProduct failed: ${res.status} ${res.statusText}`);
      return undefined;
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) return undefined;
    return mapProduct(data.data[0] as StrapiProduct);
  } catch (err) {
    if (isDynamicServerError(err)) throw err;
    console.warn("[api] getProduct error:", err);
    return undefined;
  }
}