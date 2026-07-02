import Link from "next/link";
import { footerColumns, announcements } from "@/lib/site-data";
import { getCategories } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function NotFound() {
  const categories = await getCategories();

  return (
    <>
      <Navbar categories={categories} announcements={announcements} />

      <main className="bg-background min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-green-mid mb-6">
            404
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
            This page has been crafted away.
          </h1>

          <p className="text-muted leading-8 max-w-md mx-auto mb-10">
            The piece you are looking for may have sold out, been renamed, or
            never existed in the workshop.
          </p>

          <Link
            href="/"
            className="inline-block bg-green-deep text-white px-8 py-4 rounded-sm hover:bg-green-hover transition"
          >
            Back to home
          </Link>
        </div>
      </main>

      <Footer columns={footerColumns} />
    </>
  );
}
