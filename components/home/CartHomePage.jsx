
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ShoppingCart,
  PackageOpen,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  LoaderCircle,
} from "lucide-react";

import { getProducts } from "@/services/productService";
import { addToCart } from "@/services/cartService";

const PAGE_SIZE = 8;

export default function CartHomePage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch products from the backend with pagination
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products", page, PAGE_SIZE],
    queryFn: () => getProducts({ page, limit: PAGE_SIZE }),
    placeholderData: (previousData) => previousData,
  });

  // Support common API response structures
  const response = data?.data ?? data;

  const products = Array.isArray(response)
    ? response
    : Array.isArray(response?.products)
      ? response.products
      : Array.isArray(response?.items)
        ? response.items
        : [];

  const pagination = response?.pagination ?? response?.meta ?? {};

  const totalPages = Math.max(
    1,
    Number(
      pagination.totalPages ??
        pagination.pages ??
        data?.pagination?.totalPages ??
        1,
    ),
  );

  // Add product to cart
  const addToCartMutation = useMutation({
    mutationFn: (productId) => addToCart(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartCount"] });
    },
  });

  // Loading State
  if (isLoading) {
    return (
      <section
        dir="rtl"
        className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-8 space-y-3">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E5EDE5]" />
          <div className="h-4 w-64 animate-pulse rounded-lg bg-[#E5EDE5]" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#E1E9E1] bg-white"
            >
              <div className="aspect-[4/5] animate-pulse bg-[#E8F1E9]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#E5EDE5]" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-[#E5EDE5]" />
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
      <section
        dir="rtl"
        className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center"
      >
        <RefreshCw className="mb-4 h-10 w-10 text-[#278653]" />

        <h2 className="text-xl font-bold text-[#26382D]">
          تعذر تحميل المنتجات
        </h2>

        <p className="mt-2 text-sm text-[#718075]">
          تأكد من اتصالك بالإنترنت وحاول مرة أخرى.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 rounded-xl bg-[#278653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#206B42]"
        >
          إعادة المحاولة
        </button>
      </section>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F3F7F3]"
    >
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#278653]">
              EVO STORE
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#26382D] sm:text-3xl">
              اكتشف منتجاتنا
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#718075]">
              اختار المنتجات المناسبة ليك وأضفها إلى سلتك.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-semibold text-[#26382D] transition hover:border-[#278653] hover:text-[#278653]"
          >
            <ShoppingCart className="h-5 w-5" />
            عرض السلة
          </Link>
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#DCE6DC] bg-white px-5 py-16 text-center">
            <PackageOpen className="mb-4 h-12 w-12 text-[#91A398]" />

            <h2 className="text-lg font-bold text-[#26382D]">
              لا توجد منتجات حاليًا
            </h2>

            <p className="mt-2 text-sm text-[#718075]">
              المنتجات هتظهر هنا بمجرد توفرها.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => {
                const imageUrl =
                  typeof product.images?.[0] === "string"
                    ? product.images[0]
                    : product.images?.[0]?.url ||
                      product.image?.url ||
                      "";

                const price = Number(product.price ?? 0);
                const offerPrice = Number(product.offerPrice);
                const hasOffer =
                  Number.isFinite(offerPrice) &&
                  offerPrice > 0 &&
                  offerPrice < price;

                const isAdding =
                  addToCartMutation.isPending &&
                  addToCartMutation.variables === product._id;

                return (
                  <article
                    key={product._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E1E9E1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C6DCC9] hover:shadow-lg hover:shadow-[#26382D]/5"
                  >
                    <Link
                      href={`/products/${product._id}`}
                      className="relative block overflow-hidden bg-[#E8F1E9]"
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.title || product.name || "Product"}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#91A398]">
                            <PackageOpen className="h-10 w-10" />
                            <span className="text-xs">
                              لا توجد صورة
                            </span>
                          </div>
                        )}
                      </div>

                      {hasOffer && (
                        <span className="absolute right-3 top-3 rounded-full bg-[#278653] px-3 py-1 text-xs font-bold text-white shadow-sm">
                          عرض خاص
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <Link href={`/products/${product._id}`}>
                        <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-[#26382D] transition hover:text-[#278653] sm:text-base">
                          {product.title || product.name || "منتج"}
                        </h2>
                      </Link>

                      <div className="mt-3 flex flex-wrap items-baseline gap-2">
                        <span className="text-base font-extrabold text-[#278653] sm:text-lg">
                          {(hasOffer ? offerPrice : price).toLocaleString(
                            "en-EG",
                          )}{" "}
                          <span className="text-xs font-semibold">ج.م</span>
                        </span>

                        {hasOffer && (
                          <span className="text-xs text-[#91A398] line-through">
                            {price.toLocaleString("en-EG")} ج.م
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addToCartMutation.mutate(product._id)
                        }
                        disabled={
                          addToCartMutation.isPending ||
                          product.stock === 0
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#278653] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#206B42] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
                      >
                        {isAdding ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}

                        {product.stock === 0
                          ? "نفد المخزون"
                          : isAdding
                            ? "جاري الإضافة..."
                            : "أضف إلى السلة"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Backend Pagination */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((current) => current - 1)}
                disabled={page <= 1 || isFetching}
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-semibold text-[#26382D] transition hover:border-[#278653] hover:text-[#278653] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </button>

              <span className="rounded-xl bg-[#E3F2E7] px-5 py-3 text-sm font-bold text-[#278653]">
                صفحة {page} من {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= totalPages || isFetching}
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCE6DC] bg-white px-4 py-3 text-sm font-semibold text-[#26382D] transition hover:border-[#278653] hover:text-[#278653] disabled:cursor-not-allowed disabled:opacity-40"
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
