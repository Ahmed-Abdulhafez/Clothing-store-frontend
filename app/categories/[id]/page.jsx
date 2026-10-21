
"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpLeft,
  PackageOpen,
  ShoppingBag,
  Leaf,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { getCategoryWithProducts } from "@/services/categoriesService";

export default function CategoryIdPage() {
  const params = useParams();
  const id = params?.id;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryWithProducts(id),
    enabled: Boolean(id),
  });

  // The service may return either the API response or its data property.
  const response = data?.data ?? data;
  const category = response?.category;
  const products = response?.products ?? [];

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#f5faf6] px-4 py-12 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-green-100" />
          <div className="mb-10 h-36 animate-pulse rounded-3xl bg-green-100" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-green-100 bg-white p-4"
              >
                <div className="mb-4 aspect-square rounded-xl bg-green-50" />
                <div className="mb-3 h-4 w-3/4 rounded bg-green-100" />
                <div className="h-4 w-1/3 rounded bg-green-100" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-[#f5faf6] px-4"
      >
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={28} />
          </div>

          <h1 className="mb-2 text-xl font-bold text-gray-900">
            تعذر تحميل القسم
          </h1>

          <p className="mb-6 text-sm leading-7 text-gray-500">
            حدثت مشكلة أثناء تحميل المنتجات. حاول مرة أخرى.
          </p>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            <RefreshCw size={17} />
            إعادة المحاولة
          </button>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-[#f5faf6] px-4"
      >
        <div className="text-center">
          <PackageOpen
            size={48}
            className="mx-auto mb-4 text-emerald-700"
          />
          <h1 className="mb-2 text-xl font-bold text-gray-900">
            القسم غير موجود
          </h1>
          <p className="mb-6 text-gray-500">
            ربما تم حذف القسم أو أن الرابط غير صحيح.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            كل الأقسام
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5faf6] text-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="transition hover:text-emerald-700"
          >
            الرئيسية
          </Link>

          <span>/</span>

          <Link
            href="/categories"
            className="transition hover:text-emerald-700"
          >
            الأقسام
          </Link>

          <span>/</span>

          <span className="max-w-[180px] truncate font-medium text-emerald-800">
            {category.name}
          </span>
        </nav>

        {/* Category Header */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-l from-[#e2f4e7] via-[#edf8ef] to-white px-6 py-8 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -left-12 -top-16 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                <Leaf size={15} />
                اكتشف منتجاتنا
              </div>

              <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {category.name}
              </h1>

              <p className="max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                اكتشف المنتجات المتوفرة في هذا القسم واختر ما يناسبك من
                مجموعة منتجاتنا.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-emerald-100">
                <ShoppingBag size={17} className="text-emerald-700" />
                <span>
                  {products.length}{" "}
                  {products.length === 1
                    ? "منتج"
                    : "منتجات"}
                </span>
              </div>
            </div>

            <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white bg-white/70 text-emerald-700 shadow-sm sm:flex">
              <PackageOpen size={42} strokeWidth={1.5} />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                منتجات القسم
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                تصفح المنتجات المتاحة لدينا
              </p>
            </div>

            <span className="whitespace-nowrap text-sm text-gray-500">
              {products.length} منتج
            </span>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <PackageOpen size={32} />
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-900">
                لا توجد منتجات حاليًا
              </h3>

              <p className="text-sm leading-7 text-gray-500">
                لم تتم إضافة منتجات لهذا القسم بعد. يمكنك العودة لاستكشاف
                باقي الأقسام.
              </p>

              <Link
                href="/categories"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                تصفح الأقسام
                <ArrowUpLeft size={17} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-4">
              {products.map((product) => {
                const image =
                  Array.isArray(product.images) && product.images.length > 0
                    ? typeof product.images[0] === "string"
                      ? product.images[0]
                      : product.images[0]?.url
                    : null;

                return (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
                  >
                    {/* Product Image */}
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#f3f8f3] p-4">
                      {image ? (
                        <img
                          src={image}
                          alt={product.title || "صورة المنتج"}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-emerald-700/50">
                          <PackageOpen size={42} strokeWidth={1.3} />
                          <span className="text-xs text-gray-400">
                            لا توجد صورة
                          </span>
                        </div>
                      )}

                      {product.isFeatured && (
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-2.5 py-1 text-[10px] font-semibold text-white">
                          مميز
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                      <h3 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-gray-800 transition group-hover:text-emerald-800 sm:text-base">
                        {product.title || product.name || "منتج بدون اسم"}
                      </h3>

                      <div className="mt-auto border-t border-gray-100 pt-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-col">
                            {product.offerPrice != null &&
                            product.offerPrice < product.price ? (
                              <>
                                <span className="text-xs text-gray-400 line-through">
                                  {product.price} جنيه
                                </span>
                                <span className="text-base font-extrabold text-emerald-700 sm:text-lg">
                                  {product.offerPrice} جنيه
                                </span>
                              </>
                            ) : (
                              <span className="text-base font-extrabold text-emerald-700 sm:text-lg">
                                {product.price} جنيه
                              </span>
                            )}
                          </div>

                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                            <ArrowUpLeft size={18} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
