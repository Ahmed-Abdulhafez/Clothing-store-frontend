import CategoriesSection from "@/components/home/CategoriesSection";
import Slider from "../components/mianPage/slider/Slider";
import Link from "next/link";
import CartHomePage from "@/components/home/CartHomePage";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pt-25">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="flex min-h-[450px] flex-col items-center w-full justify-center  bg-gray-900 text-center text-white">
          <Slider />
        </section>

        {/* Categories Section */}
        <section className="">
          <CategoriesSection />
        </section>

        {/* Featured Products */}
        <section className="pb-16">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Featured Products
              </h2>

              <p className="mt-2 text-gray-600">
                Discover some of our selected products.
              </p>
            </div>

            <Link
              href="/products"
              className="shrink-0 font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </Link>
          </div>

          {/* هنربط المنتجات الحقيقية بالـ API في الخطوة التالية */}
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            <CartHomePage/>
          </div>
        </section>
      </div>
    </main>
  );
}
