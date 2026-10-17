
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Package,
  LoaderCircle,
  RefreshCw,
  Star,
  X,
} from "lucide-react";

import { getProducts } from "@/services/productService";
import { addToCart } from "@/services/cartService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

function normalizeProducts(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.products)) {
    return response.data.products;
  }
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}

function getImage(product) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;
  if (typeof product?.image === "string") return product.image;

  return product?.image?.url || "";
}

function getPrice(product) {
  const price = Number(product?.price) || 0;
  const offerPrice = Number(product?.offerPrice) || 0;

  return offerPrice > 0 && offerPrice < price ? offerPrice : price;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [availability, setAvailability] = useState("all");
  const [notice, setNotice] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = useMemo(() => normalizeProducts(data), [data]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const name = String(
        product.title || product.name || ""
      ).toLowerCase();

      const brand = String(product.brand || "").toLowerCase();
      const inStock = Number(product.stock) > 0;

      const matchesSearch =
        !term || name.includes(term) || brand.includes(term);

      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && inStock) ||
        (availability === "unavailable" && !inStock);

      return matchesSearch && matchesAvailability;
    });

    if (sort === "price-low") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    }

    if (sort === "price-high") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    if (sort === "name") {
      result.sort((a, b) =>
        String(a.title || a.name || "").localeCompare(
          String(b.title || b.name || ""),
          "ar"
        )
      );
    }

    return result;
  }, [products, search, sort, availability]);

  const addMutation = useMutation({
    mutationFn: (product) =>
      addToCart({
        productId: product._id,
        quantity: 1,
      }),

    onSuccess: async () => {
      setNotice({
        type: "success",
        text: "تمت إضافة المنتج إلى السلة بنجاح.",
      });

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error) => {
      setNotice({
        type: "error",
        text:
          error.response?.data?.message ||
          "تعذرت إضافة المنتج إلى السلة. حاول مرة أخرى.",
      });
    },
  });

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-[#171717] text-gray-300"
      >
        <div className="flex items-center gap-3">
          <LoaderCircle className="animate-spin text-emerald-400" size={24} />
          <p>جاري تحميل المنتجات...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] flex-col items-center justify-center bg-[#171717] px-4 text-center text-white"
      >
        <Package size={38} className="mb-4 text-gray-500" />

        <h1 className="text-xl font-bold">تعذر تحميل المنتجات</h1>

        <p className="mt-2 text-sm text-gray-400">
          {error?.response?.data?.message ||
            error?.message ||
            "حدث خطأ أثناء الاتصال بالخادم."}
        </p>

        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          <RefreshCw size={16} />
          إعادة المحاولة
        </button>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#171717] text-gray-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-7">
          <p className="mb-2 text-xs font-semibold tracking-widest text-emerald-400">
            EVO STORE
          </p>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                منتجاتنا
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                اكتشف المنتجات واختر ما يناسبك.
              </p>
            </div>

            <p className="text-sm text-gray-400">
              {filteredProducts.length} منتج
            </p>
          </div>
        </header>

        {/* Search and filters */}
        <section className="mb-7 rounded-xl border border-white/10 bg-[#1e1e1e] p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_190px_170px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث عن منتج أو ماركة..."
                className="h-11 w-full rounded-lg border border-white/10 bg-[#171717] pr-10 pl-10 text-sm outline-none transition placeholder:text-gray-500 focus:border-emerald-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="مسح البحث"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#171717] py-2 pl-3 pr-9 text-sm text-gray-200 outline-none focus:border-emerald-500"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-low">السعر: الأقل أولًا</option>
                <option value="price-high">السعر: الأعلى أولًا</option>
                <option value="name">الاسم: أبجديًا</option>
              </select>
            </div>

            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              className="h-11 w-full rounded-lg border border-white/10 bg-[#171717] px-3 text-sm text-gray-200 outline-none focus:border-emerald-500"
            >
              <option value="all">كل المنتجات</option>
              <option value="available">المتاحة فقط</option>
              <option value="unavailable">غير المتاحة</option>
            </select>
          </div>
        </section>

        {/* Add to cart feedback */}
        {notice && (
          <div
            role="status"
            className={`mb-5 flex items-center justify-between gap-3 rounded-lg border p-3 text-sm ${
              notice.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                : "border-red-500/20 bg-red-500/5 text-red-300"
            }`}
          >
            <p>{notice.text}</p>

            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="إغلاق الرسالة"
              className="shrink-0"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Product list */}
        {filteredProducts.length === 0 ? (
          <section className="rounded-xl border border-white/10 bg-[#1e1e1e] px-4 py-16 text-center">
            <Package size={36} className="mx-auto mb-3 text-gray-600" />

            <h2 className="font-semibold">لا توجد منتجات مطابقة</h2>

            <p className="mt-2 text-sm text-gray-500">
              جرّب تغيير البحث أو الفلاتر.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSort("default");
                setAvailability("all");
              }}
              className="mt-4 text-sm text-emerald-400 hover:text-emerald-300"
            >
              إعادة ضبط البحث
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const name = product.title || product.name || "منتج";
              const image = getImage(product);
              const price = getPrice(product);
              const originalPrice = Number(product.price) || 0;
              const hasDiscount = price < originalPrice;
              const stock = Number(product.stock) || 0;
              const isAdding =
                addMutation.isPending &&
                addMutation.variables?._id === product._id;

              return (
                <article
                  key={product._id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] transition-colors hover:border-emerald-500/30"
                >
                  <Link
                    href={`/products/${product._id}`}
                    className="relative block aspect-square overflow-hidden bg-[#252525] p-3 sm:p-5"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-600">
                        <Package size={38} strokeWidth={1.3} />
                      </div>
                    )}

                    {hasDiscount && (
                      <span className="absolute right-2 top-2 rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-bold text-black sm:text-xs">
                        خصم
                      </span>
                    )}

                    {stock <= 0 && (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-[10px] text-gray-300">
                        نفد المخزون
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    {product.brand && (
                      <p className="mb-1.5 truncate text-xs text-emerald-400">
                        {product.brand}
                      </p>
                    )}

                    <Link href={`/products/${product._id}`}>
                      <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-100 transition hover:text-emerald-300 sm:text-base">
                        {name}
                      </h2>
                    </Link>

                    <div className="mt-3 flex min-h-6 flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-emerald-400 sm:text-base">
                        {formatPrice(price)}
                      </span>

                      {hasDiscount && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Star
                          size={13}
                          className="text-amber-400"
                          fill="currentColor"
                        />
                        {Number(product.rating || 0).toFixed(1)}
                      </span>

                      <span
                        className={`text-[11px] ${
                          stock > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {stock > 0 ? "متوفر" : "غير متوفر"}
                      </span>
                    </div>

                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        disabled={stock <= 0 || isAdding}
                        onClick={() => {
                          setNotice(null);
                          addMutation.mutate(product);
                        }}
                        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-2 py-2.5 text-xs font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 sm:text-sm"
                      >
                        {isAdding ? (
                          <LoaderCircle
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <ShoppingCart size={16} />
                        )}

                        {stock <= 0
                          ? "غير متوفر"
                          : isAdding
                            ? "جاري الإضافة..."
                            : "أضف للسلة"}
                      </button>

                      <Link
                        href={`/products/${product._id}`}
                        className="mt-2 flex min-h-9 items-center justify-center rounded-lg border border-white/10 px-2 text-xs text-gray-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
