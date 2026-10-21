
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Heart,
  LoaderCircle,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { getProductById } from "@/services/productService";
import { addToCart } from "@/services/cartService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

function getProductImages(product) {
  if (Array.isArray(product?.images)) {
    return product.images
      .map((image) =>
        typeof image === "string" ? image : image?.url
      )
      .filter(Boolean);
  }

  if (typeof product?.image === "string") {
    return [product.image];
  }

  if (product?.image?.url) {
    return [product.image.url];
  }

  return [];
}

function getProductData(response) {
  return response?.data?.data ?? response?.data ?? response;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });

  const product = getProductData(response);

  const cartMutation = useMutation({
    mutationFn: () =>
      addToCart({
        productId: product._id || id,
        quantity,
      }),

    onSuccess: async () => {
      setMessage("تمت إضافة المنتج إلى السلة بنجاح.");

      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },

    onError: (error) => {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "تعذرت إضافة المنتج إلى السلة."
      );
    },
  });

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5faf6] text-gray-700">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle
            size={38}
            className="animate-spin text-emerald-700"
          />
          <p>جاري تحميل تفاصيل المنتج...</p>
        </div>
      </main>
    );
  }

  if (isError || !product || typeof product !== "object") {
    return (
      <main
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-[#f5faf6] px-4 text-gray-900"
      >
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <Package
            size={42}
            className="mx-auto mb-4 text-gray-500"
          />

          <h1 className="mb-3 text-xl font-bold">
            تعذر العثور على المنتج
          </h1>

          <p className="mb-6 text-sm leading-7 text-gray-400">
            {error?.response?.data?.message ||
              error?.message ||
              "المنتج غير موجود أو حدث خطأ أثناء تحميله."}
          </p>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            <RefreshCw size={17} />
            إعادة المحاولة
          </button>

          <Link
            href="/products"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm text-gray-700 hover:text-emerald-800"
          >
            <ArrowRight size={17} />
            العودة للمنتجات
          </Link>
        </div>
      </main>
    );
  }

  const images = getProductImages(product);
  const image = images[activeImage] || "";

  const title = product.title || product.name || "منتج";
  const price = Number(product.price) || 0;
  const offerPrice = Number(product.offerPrice) || 0;

  const hasDiscount =
    offerPrice > 0 && offerPrice < price;

  const finalPrice = hasDiscount ? offerPrice : price;

  const discount = hasDiscount
    ? Math.round(((price - offerPrice) / price) * 100)
    : 0;

  const stock = Math.max(0, Number(product.stock) || 0);
  const rating = Math.min(
    5,
    Math.max(0, Number(product.rating) || 0)
  );

  const reviews = Number(product.numReviews) || 0;

  function handleQuantity(amount) {
    setQuantity((current) =>
      Math.min(stock, Math.max(1, current + amount))
    );
    setMessage("");
  }

  function handleAddToCart() {
    setMessage("");

    if (stock < 1) {
      setMessage("المنتج غير متوفر حاليًا.");
      return;
    }

    if (quantity > stock) {
      setMessage("الكمية المطلوبة غير متاحة.");
      return;
    }

    cartMutation.mutate();
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f5faf6] text-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-emerald-700">
            الرئيسية
          </Link>

          <ChevronLeft size={16} />

          <Link
            href="/products"
            className="hover:text-emerald-700"
          >
            المنتجات
          </Link>

          <ChevronLeft size={16} />

          <span className="truncate text-gray-700">
            {title}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Images */}
          <section className="min-w-0">
            <div className="relative flex aspect-square max-h-[620px] items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 sm:p-10">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <Package size={60} strokeWidth={1.2} />
                  <span>لا توجد صورة للمنتج</span>
                </div>
              )}

              {hasDiscount && (
                <span className="absolute right-5 top-5 rounded-full bg-emerald-700 px-4 py-2 text-sm font-bold text-white">
                  خصم {discount}%
                </span>
              )}

              <button
                type="button"
                aria-label="إضافة إلى المفضلة"
                aria-pressed={isFavorite}
                onClick={() => setIsFavorite((value) => !value)}
                className={`absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border transition ${
                  isFavorite
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-gray-200 bg-white/90 text-gray-700 hover:text-rose-600"
                }`}
              >
                <Heart
                  size={20}
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((src, index) => (
                  <button
                    type="button"
                    key={`${src}-${index}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`عرض الصورة ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={`h-20 w-20 shrink-0 rounded-xl border-2 bg-white p-2 transition sm:h-24 sm:w-24 ${
                      activeImage === index
                        ? "border-emerald-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${title} ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Details */}
          <section className="flex min-w-0 flex-col">
            <div className="mb-4 flex flex-wrap gap-2">
              {product.brand && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  {product.brand}
                </span>
              )}

              {product.isFeatured && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                  منتج مميز
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-relaxed sm:text-4xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={17}
                    fill={
                      index < Math.round(rating)
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      index < Math.round(rating)
                        ? ""
                        : "text-gray-400"
                    }
                  />
                ))}
              </div>

              <span className="text-sm text-gray-700">
                {rating.toFixed(1)} / 5
              </span>

              <span className="text-sm text-gray-500">
                ({reviews} مراجعة)
              </span>
            </div>

            <div className="my-6 border-y border-gray-200 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-emerald-700">
                  {formatPrice(finalPrice)}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(price)}
                    </span>

                    <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-sm text-rose-700">
                      وفّر {formatPrice(price - offerPrice)}
                    </span>
                  </>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                السعر بالجنيه المصري
              </p>
            </div>

            <div className="mb-7">
              <h2 className="mb-3 text-lg font-semibold">
                وصف المنتج
              </h2>

              <p className="whitespace-pre-line text-sm leading-8 text-gray-400 sm:text-base">
                {product.desc || "لا يوجد وصف متاح لهذا المنتج."}
              </p>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  stock > 0 ? "bg-emerald-600" : "bg-rose-500"
                }`}
              />

              <span
                className={`text-sm ${
                  stock > 0 ? "text-emerald-800" : "text-rose-700"
                }`}
              >
                {stock > 0
                  ? stock <= 5
                    ? `متبقي ${stock} قطع فقط`
                    : "متوفر في المخزون"
                  : "غير متوفر حاليًا"}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-5">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                الكمية
              </label>

              <div className="inline-flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  aria-label="زيادة الكمية"
                  disabled={quantity >= stock}
                  onClick={() => handleQuantity(1)}
                  className="flex h-12 w-12 items-center justify-center hover:text-emerald-700 disabled:opacity-30"
                >
                  <Plus size={18} />
                </button>

                <span className="flex h-12 min-w-14 items-center justify-center border-x border-gray-200 font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="تقليل الكمية"
                  disabled={quantity <= 1}
                  onClick={() => handleQuantity(-1)}
                  className="flex h-12 w-12 items-center justify-center hover:text-emerald-700 disabled:opacity-30"
                >
                  <Minus size={18} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock === 0 || cartMutation.isPending}
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              {cartMutation.isPending ? (
                <LoaderCircle size={21} className="animate-spin" />
              ) : cartMutation.isSuccess ? (
                <Check size={21} />
              ) : (
                <ShoppingCart size={21} />
              )}

              {cartMutation.isPending
                ? "جاري الإضافة..."
                : stock === 0
                  ? "غير متوفر"
                  : cartMutation.isSuccess
                    ? "تمت الإضافة إلى السلة"
                    : "أضف إلى السلة"}
            </button>

            {message && (
              <p
                role="status"
                className={`mt-3 rounded-xl border p-3 text-sm leading-6 ${
                  cartMutation.isError
                    ? "border-rose-400/20 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800"
                }`}
              >
                {message}
              </p>
            )}

            <Link
              href="/products"
              className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm text-gray-700 transition hover:border-emerald-200 hover:text-emerald-800"
            >
              <ArrowRight size={17} />
              متابعة التسوق
            </Link>

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-gray-200 pt-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white p-3">
                <Truck size={21} className="shrink-0 text-emerald-700" />
                <span className="text-xs leading-6 text-gray-700">
                  خيارات التوصيل
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white p-3">
                <ShieldCheck size={21} className="shrink-0 text-emerald-700" />
                <span className="text-xs leading-6 text-gray-700">
                  تسوق آمن
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white p-3">
                <Package size={21} className="shrink-0 text-emerald-700" />
                <span className="text-xs leading-6 text-gray-700">
                  متابعة الطلب
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
