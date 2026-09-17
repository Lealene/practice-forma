import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { PreviewProvider } from "@/components/PreviewContext";
import ProductPreview from "@/components/ProductPreview";
import { WishlistProvider } from "@/components/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FORMA — Considered furniture, made to order in Porto",
  description:
    "Solid oak, natural wool, and quiet, considered lines. Pieces built once, kept for decades, never thrown away.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WishlistProvider>
            <PreviewProvider>
              {children}
              <CartDrawer />
              <ProductPreview />
            </PreviewProvider>
          </WishlistProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}