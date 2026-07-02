import { Product, Category, ProductImage } from "@/types/product";

const API_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

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
  return `${API_URL}${url}`;
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

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  return (data.data as StrapiProduct[]).map(mapProduct);
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  return (data.data as StrapiCategory[]).map(mapCategory);
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
  const res = await fetch(
    `${API_URL}/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await res.json();

  if (!data.data || data.data.length === 0) return undefined;
  return mapProduct(data.data[0] as StrapiProduct);
}