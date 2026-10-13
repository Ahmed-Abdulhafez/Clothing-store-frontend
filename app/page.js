import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 pt-25">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="flex min-h-[450px] flex-col items-center justify-center gap-6 rounded-2xl bg-gray-900 px-6 py-16 text-center text-white">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Welcome to Evo Store
          </span>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Discover Products That Match Your Style
          </h1>

          <p className="max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
            Explore our collection and find the right products for your
            everyday needs.
          </p>

          <Link
            href="/products"
            className="rounded-lg bg-emerald-500 px-8 py-3 font-semibold text-white transition hover:bg-emerald-600"
          >
            Shop Now
          </Link>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Shop by Category
            </h2>

            <p className="mt-2 text-gray-600">
              Explore our product categories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Category One", "Category Two", "Category Three", "Category Four"].map(
              (category) => (
                <Link
                  key={category}
                  href="/products"
                  className="rounded-xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900">
                    {category}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Explore products
                  </p>
                </Link>
              ),
            )}
          </div>
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
            Products will appear here.
          </div>
        </section>
      </div>
    </main>
  );
}
