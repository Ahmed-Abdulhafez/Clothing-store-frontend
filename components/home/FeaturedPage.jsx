"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowUpLeft,
  Tag,
  Star,
  RefreshCw,
} from "lucide-react";

import { getProducts } from "@/services/productService";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeaturedPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["featureProducts"],
    queryFn: getProducts,
  });

  const productsList = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.products)
          ? data.data.products
          : [];

  const featuredProducts = productsList.filter(
    (product) => product.isFeatured === true,
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white p-3"
          >
            <div className="aspect-[4/5] rounded-xl bg-gray-200" />

            <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
            <div className="mt-3 h-3 w-1/2 rounded bg-gray-100" />
            <div className="mt-4 h-5 w-2/5 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 py-12 text-center">
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
          <ShoppingBag size={28} />
        </div>

        <h3 className="text-lg font-bold text-[#26382D]">
          Unable to Load Products
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while loading products."}
        </p>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#206d43] disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (featuredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-12 text-center">
        <div className="mb-4 rounded-full bg-[#E6F1E8] p-4 text-[#278653]">
          <ShoppingBag size={30} />
        </div>

        <h3 className="text-lg font-bold text-[#26382D]">
          No Featured Products Yet
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Our featured collection will be available here soon.
        </p>

        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#206d43]"
        >
          Explore All Products
          <ArrowUpLeft size={17} />
        </Link>
      </div>
    );
  }

  return (
    <section className="min-w-0">
      {/* Slider Controls */}
      <div className="mb-5 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Previous products"
          className="featured-prev flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#26382D] transition hover:border-[#278653] hover:bg-[#278653] hover:text-white"
        >
          <ChevronRight size={20} />
        </button>

        <button
          type="button"
          aria-label="Next products"
          className="featured-next flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#26382D] transition hover:border-[#278653] hover:bg-[#278653] hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl: ".featured-prev",
          nextEl: ".featured-next",
        }}
        pagination={{
          clickable: true,
          el: ".featured-pagination",
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        spaceBetween={16}
        slidesPerView={1.5}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 16 },
          640: { slidesPerView: 2.5, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="!overflow-visible !pb-12"
      >
        {featuredProducts.map((product) => {
          const id = product._id || product.id;
          const image = product.images?.[0]?.url;
          const hasOffer =
            Number(product.offerPrice) > 0 &&
            Number(product.offerPrice) < Number(product.price);

          const currentPrice = hasOffer ? product.offerPrice : product.price;

          return (
            <SwiperSlide key={id} className="!h-auto">
              <Link
                href={`/products/${id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[#F3F4F0] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#26382D]/20"
              >
                {/* Product Image */}
                {image ? (
                  <Image
                    src={image}
                    alt={product.title || "EVO STORE product"}
                    fill
                    sizes="(max-width: 480px) 65vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No Image Available
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Top Badges */}
                <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-[#26382D] shadow-sm backdrop-blur-sm sm:text-xs">
                    <Star size={13} className="fill-[#278653] text-[#278653]" />
                    Featured
                  </span>

                  {hasOffer && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#278653] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                      <Tag size={12} />
                      Sale
                    </span>
                  )}
                </div>

                {/* Product Details Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                  <div className="flex items-end justify-between gap-2">
                    {/* Product Name */}
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white drop-shadow-md sm:text-base sm:leading-6">
                        {product.title || "Untitled Product"}
                      </h3>

                      <p className="mt-1.5 text-xs font-medium tracking-wide text-white/75 sm:text-sm">
                        {product.brand || "EVO STORE"}
                      </p>
                    </div>

                    {/* Price on the Right */}
                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                      <span className="text-sm font-extrabold text-white drop-shadow-md sm:text-base">
                        {formatPrice(currentPrice)}
                      </span>

                      {hasOffer && (
                        <span className="text-[10px] text-white/65 line-through sm:text-xs">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Product Hint */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
                    <span className="text-[10px] font-medium text-white/80 sm:text-xs">
                      View Product
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#26382D]">
                      <ArrowUpLeft size={17} />
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Pagination */}
      <div className="featured-pagination flex min-h-5 items-center justify-center gap-2" />
    </section>
  );
}
