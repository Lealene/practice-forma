export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: ProductImage[];
  products?: Product[];
}

export interface ProductImage {
  id: number;
  url: string;
  name: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  image?: ProductImage[];
  category?: Category;
  material?: string;
  dimensions?: string;
  variants?: string | string[];
  stock?: number;
}
