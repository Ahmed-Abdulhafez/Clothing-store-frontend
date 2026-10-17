"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";

import { getSliderProducts } from "@/services/productService";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

export default function Slider() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sliderProducts"],
    queryFn: getSliderProducts,
  });

  // Support an array or an API response containing data.
  const products = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex min-h-[350px] items-center justify-center rounded-2xl bg-gray-900 text-white">
          Loading slider products...
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
        <p className="rounded-xl bg-red-950 p-4 text-center text-red-300">
          Failed to load slider products: {error?.message}
        </p>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full ">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={products.length > 1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Navigation, Autoplay]}
        className="homeSwiper overflow-hidden "
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="relative isolate flex min-h-[450px] items-end overflow-hidden bg-gray-950 text-white sm:min-h-[520px] lg:min-h-[550px]">
              {/* Full-Slider Background Image */}
              {product.images?.[0]?.url ? (
                <Image
                  src={product.images[0].url}
                  alt={product.title || "Product image"}
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="absolute inset-0 -z-20 object-cover"
                />
              ) : (
                <div className="absolute inset-0 -z-20 bg-gray-800" />
              )}

              {/* Dark Overlay for Readable Text */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

              {/* Product Details */}
              <div className="w-full max-w-3xl px-6 pb-10 pt-24 sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
                <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.25em] text-lime-400 sm:text-sm">
                  Welcome to Evo Store
                </span>

                <h2 className="line-clamp-2 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-6xl">
                  {product.title}
                </h2>

                {product.desc && (
                  <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-7 text-gray-200 sm:text-base">
                    {product.desc}
                  </p>
                )}


                <Link
                  href={`/products/${product._id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lime-600 px-7 py-3 font-semibold text-white transition hover:bg-lime-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
                >
                  View Product
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
