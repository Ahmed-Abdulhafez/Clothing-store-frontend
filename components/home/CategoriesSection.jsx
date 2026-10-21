"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categoriesService";
import Link from "next/link";

export default function CategoriesSection() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = Array.isArray(data)
    ? data.slice(0, 5)
    : Array.isArray(data?.data)
      ? data.data.slice(0, 5)
      : [];

  if (isLoading) {
    return (
      <section className="px-4 py-12">
        <p className="text-center text-gray-400">Loading categories...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-4 py-12 text-center">
        <p className="mb-4 text-red-400">Failed to load categories.</p>

        <button
          onClick={() => refetch()}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-white transition hover:bg-emerald-500"
        >
          Try Again
        </button>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="px-4 py-12 text-center">
        <p className="text-gray-400">No categories available.</p>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-12 text-gray-900 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Discover Evo
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Shop by Category
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 md:text-base">
            Explore our categories and find the right products for your routine.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => {
            const imageUrl = category.images?.[0]?.url;

            return (
              <Link key={category._id} href={`/categories/${category._id}`}>
                <article className="group overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name || "Category"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <h3 className="absolute bottom-0 left-0 w-full p-4 text-center text-lg font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
