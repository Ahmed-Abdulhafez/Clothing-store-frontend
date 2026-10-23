
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categoriesService";
import {
  ArrowLeft,
  FolderOpen,
  RefreshCw,
  Shapes,
} from "lucide-react";

export default function GetAllCategories() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  // Loading State
  if (isLoading) {
    return (
      <section dir="rtl" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-[#E5EDE5]" />
            <div className="h-4 w-56 animate-pulse rounded-lg bg-[#E5EDE5]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#E5EDE5] bg-white"
            >
              <div className="h-48 animate-pulse bg-[#E8F1E9]" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-[#E5EDE5]" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-[#E5EDE5]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error State
  if (isError) {
    return (
      <div
        dir="rtl"
        className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 py-14 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <RefreshCw className="h-6 w-6 text-red-500" />
        </div>

        <h2 className="text-lg font-bold text-[#26382D]">
          تعذر تحميل التصنيفات
        </h2>

        <p className="mt-2 text-sm text-[#718075]">
          حصلت مشكلة أثناء جلب البيانات. حاول مرة أخرى.
        </p>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#206B42] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Empty State
  if (categories.length === 0) {
    return (
      <div
        dir="rtl"
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE6DC] bg-white px-5 py-16 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F1E9]">
          <FolderOpen className="h-8 w-8 text-[#278653]" />
        </div>

        <h2 className="text-lg font-bold text-[#26382D]">
          لا توجد تصنيفات حتى الآن
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-[#718075]">
          ستظهر التصنيفات هنا بمجرد إضافتها إلى المتجر.
        </p>
      </div>
    );
  }

  return (
    <section dir="rtl" className="space-y-7 pt-25 px-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1 w-7 rounded-full bg-[#278653]" />
            <p className="text-xs font-bold tracking-[0.18em] text-[#278653]">
              EVO STORE
            </p>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#26382D] sm:text-3xl">
            تصفّح التصنيفات
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#718075]">
            اكتشف أقسام المتجر واختر ما يناسب احتياجاتك.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#E1E9E1] bg-white px-4 py-3 shadow-sm">
          <Shapes className="h-5 w-5 text-[#278653]" />

          <span className="text-sm font-semibold text-[#26382D]">
            {categories.length} تصنيف
          </span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const imageUrl =
            typeof category.images?.[0] === "string"
              ? category.images[0]
              : category.images?.[0]?.url || category.image?.url || "";

          return (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E5EDE5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B8D8C0] hover:shadow-lg hover:shadow-[#26382D]/5"
            >
              {/* Category Image */}
              <div className="relative h-48 overflow-hidden bg-[#E8F1E9] sm:h-52">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={category.name || "تصنيف من المتجر"}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-[#91A398]">
                    <FolderOpen className="h-12 w-12 stroke-[1.3]" />
                    <span className="text-xs font-medium">
                      لا توجد صورة
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#172B1D]/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                <span className="absolute right-3 top-3 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[11px] font-bold text-[#278653] backdrop-blur-sm">
                  EVO STORE
                </span>
              </div>

              {/* Category Details */}
              <div className="flex flex-1 items-center justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-[#26382D] transition-colors duration-200 group-hover:text-[#278653] sm:text-lg">
                    {category.name || "تصنيف بدون اسم"}
                  </h2>

                  <p className="mt-1 text-xs text-[#91A398]">
                    اكتشف المنتجات
                  </p>
                </div>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F6F0] text-[#278653] transition-all duration-300 group-hover:bg-[#278653] group-hover:text-white">
                  <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
