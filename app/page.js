import Link from "next/link";

import CategoriesSection from "@/components/home/CategoriesSection";
import CartHomePage from "@/components/home/CartHomePage";
import FeaturedPage from "@/components/home/FeaturedPage";
import Slider from "../components/mianPageNavbar/slider/Slider";
import FooterPage from "@/components/home/FooterPage";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F8F5] pt-20 sm:pt-15">
      <div className="mx-auto w-full max-w-[1440px] space-y-16 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-20 lg:px-10">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden rounded-2xl bg-[#26382D] shadow-sm">
          <div className="min-h-[350px] sm:min-h-[450px] lg:min-h-[520px]">
            <Slider />
          </div>
        </section>

        {/* Categories Section */}
        <section aria-label="Product Categories">
          <CategoriesSection />
        </section>

        {/* Featured Products Section */}
        <section className="space-y-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#278653]">
                EVO STORE
              </p>

              <h2 className="text-2xl font-bold text-[#26382D] sm:text-3xl">
                Featured Products
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Discover our featured collection and find your next favorite
                product.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#278653]/20 bg-white px-5 py-3 text-sm font-semibold text-[#278653] transition hover:border-[#278653] hover:bg-[#278653] hover:text-white"
            >
              View All Products
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="min-w-0">
            <FeaturedPage />
          </div>
        </section>

        {/* All Products Section */}
        <section className="space-y-7 pb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#278653]">
                EXPLORE OUR STORE
              </p>

              <h2 className="text-2xl font-bold text-[#26382D] sm:text-3xl">
                Our Products
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Browse our collection and explore all available products.
              </p>
            </div>

            <Link
              href="/products"
              className="font-semibold text-[#278653] transition hover:text-[#1d6940]"
            >
              Shop Now →
            </Link>
          </div>

          <div className="min-w-0 rounded-2xl">
            <CartHomePage />
          </div>
        </section>
      </div>
      <section>
        <FooterPage />
      </section>
    </main>
  );
}
