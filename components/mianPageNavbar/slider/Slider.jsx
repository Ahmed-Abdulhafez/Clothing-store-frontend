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
    <section className="mx-auto w-full overflow-hidden rounded-2xl">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={products.length > 1}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Navigation, Autoplay]}
        className="homeSwiper"
      >
        {products.map((product) => {
          const image = product.images?.[0]?.url;
          const hasOffer =
            Number(product.offerPrice) > 0 &&
            Number(product.offerPrice) < Number(product.price);

          const price = hasOffer ? product.offerPrice : product.price;

          const formatPrice = (value) =>
            new Intl.NumberFormat("en-EG", {
              style: "currency",
              currency: "EGP",
              maximumFractionDigits: 2,
            }).format(Number(value) || 0);

          return (
            <SwiperSlide key={product._id}>
              <div className="relative isolate flex min-h-[500px] items-center overflow-hidden bg-[#26382D] text-white sm:min-h-[560px] lg:min-h-[620px]">
                {/* Full Background Image */}
                {image ? (
                  <Image
                    src={image}
                    alt={product.title || "EVO STORE product"}
                    fill
                    priority
                    unoptimized
                    sizes="100vw"
                    className="absolute inset-0 -z-20 object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 -z-20 bg-[#26382D]" />
                )}

                {/* Background Overlay */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                {/* Main Content */}
                <div className="grid w-full grid-cols-1 items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_300px] lg:gap-12 lg:px-16 lg:py-16">
                  {/* Product Information */}
                  <div className="max-w-2xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:text-sm">
                      <span className="h-2 w-2 rounded-full bg-[#52B77C]" />
                      EVO STORE
                    </div>

                    <p className="mb-3 text-sm font-medium text-[#9BE5B3] sm:text-base">
                      Discover Your Next Favorite
                    </p>

                    <h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-6xl">
                      {product.title}
                    </h2>

                    {product.desc && (
                      <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-gray-200 sm:text-base sm:leading-8">
                        {product.desc}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="text-2xl font-extrabold text-white sm:text-3xl">
                        {formatPrice(price)}
                      </span>

                      {hasOffer && (
                        <>
                          <span className="text-base text-white/60 line-through">
                            {formatPrice(product.price)}
                          </span>

                          <span className="rounded-lg bg-[#278653] px-3 py-1.5 text-xs font-bold text-white">
                            Special Offer
                          </span>
                        </>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/products/${product._id}`}
                        className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#278653] px-7 py-3.5 font-bold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#319e64] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        View Product
                        <span aria-hidden="true">→</span>
                      </Link>

                      <Link
                        href="/products"
                        className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                      >
                        Explore Collection
                      </Link>
                    </div>
                  </div>

                  {/* Product Thumbnail */}
                  {image && (
                    <div className="hidden lg:flex lg:justify-center">
                      <Link
                        href={`/products/${product._id}`}
                        aria-label={`View ${product.title}`}
                        className="group relative block w-full max-w-[280px] rounded-3xl border border-white/30 bg-white/10 p-3 shadow-2xl shadow-black/30 backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:bg-white/15"
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/10">
                          <Image
                            src={image}
                            alt={product.title || "Product preview"}
                            fill
                            unoptimized
                            sizes="280px"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        </div>

                        <div className="px-2 pb-2 pt-4">
                          <p className="text-xs font-medium uppercase tracking-widest text-[#9BE5B3]">
                            Featured Product
                          </p>

                          <h3 className="mt-2 line-clamp-2 text-lg font-bold text-white">
                            {product.title}
                          </h3>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <span className="font-bold text-white">
                              {formatPrice(price)}
                            </span>

                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#278653] text-white transition group-hover:bg-white group-hover:text-[#26382D]">
                              ↗
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Bottom Decoration */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#278653] to-transparent opacity-80" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
