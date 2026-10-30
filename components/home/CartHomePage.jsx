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
  Heart,
  Eye,
  Check,
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

export default function CartHomePage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [availability, setAvailability] = useState("all");
  const [notice, setNotice] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = useMemo(() => normalizeProducts(data), [data]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const name = String(product.title || product.name || "").toLowerCase();

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
          "ar",
        ),
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
        queryKey: ["carts"],
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

  const toggleFavorite = (productId) => {
    setFavorites((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId],
    );
  };

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center bg-[#F3F7F3] text-[#526357]"
      >
        <div className="flex items-center gap-3">
          <LoaderCircle className="animate-spin text-[#278653]" size={24} />
          <p>جاري تحميل المنتجات...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F3F7F3] px-4 text-center text-[#26382D]"
      >
        <Package size={38} className="mb-4 text-[#91A398]" />

        <h1 className="text-xl font-bold">تعذر تحميل المنتجات</h1>

        <p className="mt-2 text-sm text-[#718075]">
          {error?.response?.data?.message ||
            error?.message ||
            "حدث خطأ أثناء الاتصال بالخادم."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#206B42]"
        >
          <RefreshCw size={16} />
          إعادة المحاولة
        </button>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#F3F7F3] text-[#26382D]">
      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-10">
        {/* Header */}
        <header className="mb-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Our Products</h1>
            </div>

            <p className="text-xl font-black tracking-wider text-[#278653] sm:text-2xl">
              EVO STORE
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-[#718075]">
            <p className="text-x1 text-amber-700 font-black tracking-wider">
              <span className="text-x1 text-[#278653]">
                {filteredProducts.length}
              </span>{" "}
              Item
            </p>

            {favorites.length > 0 && (
              <p className="flex items-center gap-1.5">
                <Heart size={15} className="fill-red-500 text-red-500" />
                {favorites.length} مفضلة
              </p>
            )}
          </div>
        </header>

        {/* Feedback */}
        {notice && (
          <div
            role="status"
            className={`mb-5 flex items-center justify-between gap-3 rounded-xl border p-3 text-sm ${
              notice.type === "success"
                ? "border-[#C8E5D0] bg-[#EDF7EF] text-[#206B42]"
                : "border-red-200 bg-red-50 text-red-700"
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

        {/* Products */}
        {filteredProducts.length === 0 ? (
          <section className="rounded-2xl border border-[#E1E9E1] bg-white px-4 py-16 text-center">
            <Package size={40} className="mx-auto mb-3 text-[#91A398]" />

            <h2 className="font-bold">لا توجد منتجات مطابقة</h2>

            <p className="mt-2 text-sm text-[#718075]">
              جرّب تغيير البحث أو الفلاتر.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSort("default");
                setAvailability("all");
              }}
              className="mt-4 text-sm font-semibold text-[#278653] hover:text-[#206B42]"
            >
              إعادة ضبط البحث
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
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

              const isFavorite = favorites.includes(product._id);

              return (
                <article
                  key={product._id}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#E1E9E1] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#B5D7BE] hover:shadow-xl hover:shadow-[#26382D]/10"
                >
                  {/* Image + floating actions */}
                  <div className="relative aspect-square overflow-hidden bg-[#E8F1E9]">
                    <Link
                      href={`/products/${product._id}`}
                      aria-label={`عرض ${name}`}
                      className="absolute inset-0"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#91A398]">
                          <Package size={48} strokeWidth={1.3} />
                        </div>
                      )}
                    </Link>

                    {/* Top icons */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-2.5">
                      {/* Favorite */}
                      <button
                        type="button"
                        aria-label={
                          isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"
                        }
                        aria-pressed={isFavorite}
                        onClick={() => toggleFavorite(product._id)}
                        className={`pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition duration-200 hover:scale-110 ${
                          isFavorite
                            ? "bg-red-500 text-white"
                            : "bg-white/90 text-[#526357] hover:bg-red-50 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          size={18}
                          fill={isFavorite ? "currentColor" : "none"}
                        />
                      </button>

                      <div className="flex flex-col gap-2">
                        {/* Discount */}
                        {hasDiscount && (
                          <span className="rounded-full bg-[#278653] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                            خصم
                          </span>
                        )}

                        {/* Details icon */}
                        <Link
                          href={`/products/${product._id}`}
                          aria-label={`تفاصيل ${name}`}
                          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#26382D] shadow-md backdrop-blur-md transition hover:scale-110 hover:bg-[#278653] hover:text-white"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </div>

                    {/* Product name appears on hover */}
                    <Link
                      href={`/products/${product._id}`}
                      className="absolute inset-x-0 bottom-0 z-[5] flex min-h-20 items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-10 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                    >
                      <div className="min-w-0">
                        {product.brand && (
                          <p className="mb-1 truncate text-[10px] font-medium text-[#B8E6C5] sm:text-xs">
                            {product.brand}
                          </p>
                        )}

                        <h2 className="line-clamp-2 text-sm font-bold leading-5 text-white sm:text-base">
                          {name}
                        </h2>
                      </div>
                    </Link>

                    {/* Out of stock */}
                    {stock <= 0 && (
                      <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center bg-black/30">
                        <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-[#526357]">
                          نفد المخزون
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product information */}
                  <div className="flex flex-col p-3 sm:p-4">
                    {/* Name for touch devices and accessibility */}
                    <Link
                      href={`/products/${product._id}`}
                      className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#26382D] transition hover:text-[#278653] sm:hidden"
                    >
                      {name}
                    </Link>

                    {/* Rating and stock */}
                    <div className="mt-3 flex items-center justify-between gap-1 border-t border-[#EDF1ED] pt-3">
                      <span className="flex items-center gap-1 text-xs text-[#718075]">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        {Number(product.rating || 0).toFixed(1)}
                      </span>

                      <span
                        className={`flex items-center gap-1 text-[10px] font-semibold sm:text-xs ${
                          stock > 0 ? "text-[#278653]" : "text-red-500"
                        }`}
                      >
                        {stock > 0 && <Check size={13} />}
                        {stock > 0 ? "In Stock" : "Out of Stock"}
                        <span className="text-amber-500">{product.stock}</span>
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
                      {/* Icon-only Add to Cart */}
                      <button
                        type="button"
                        disabled={stock <= 0 || isAdding}
                        onClick={() => {
                          setNotice(null);
                          addMutation.mutate(product);
                        }}
                        aria-label={`إضافة ${name} إلى السلة`}
                        title={
                          stock <= 0
                            ? "المنتج غير متوفر"
                            : isAdding
                              ? "جاري الإضافة..."
                              : "إضافة إلى السلة"
                        }
                        className="cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
      bg-[#278653] text-white shadow-sm
      transition-all duration-200
      hover:bg-[#206B42] hover:shadow-md
      active:scale-95
      focus:outline-none focus:ring-2 focus:ring-[#278653]/30
      disabled:cursor-not-allowed disabled:bg-[#E5EAE5]
      disabled:text-[#91A398]
      sm:h-9 sm:w-9"
                      >
                        {isAdding ? (
                          <LoaderCircle size={19} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={19} strokeWidth={2} />
                        )}
                      </button>

                      {/* Price */}
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold text-[#278653] sm:text-base">
                          {formatPrice(price)}
                        </span>

                        {hasDiscount && (
                          <span className="text-[11px] text-[#91A398] line-through sm:text-xs">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
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
