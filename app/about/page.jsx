
"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  Target,
  Eye,
  Leaf,
  Star,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    description:
      "We focus on offering carefully selected products that meet our quality standards.",
  },
  {
    icon: Truck,
    title: "Reliable Shopping",
    description:
      "Enjoy a smooth shopping experience from browsing your favorite products to receiving your order.",
  },
  {
    icon: Headphones,
    title: "Customer First",
    description:
      "Your satisfaction matters to us. We aim to make every step of your shopping journey easier.",
  },
  {
    icon: Heart,
    title: "Made for You",
    description:
      "We continuously work to bring you products that match your needs and preferences.",
  },
];

export default function AboutPage() {
  return (
    <main
      dir="ltr"
      className="min-h-screen overflow-hidden bg-[#F5F8F5] pt-20 text-[#26382D]"
    >
      {/* Hero Section */}
      <section className="relative px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#278653]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-[#278653]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Hero Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCEBDD] bg-white px-4 py-2 shadow-sm">
              <Sparkles size={15} className="text-[#278653]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#278653]">
                Discover EVO STORE
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#26382D] sm:text-5xl lg:text-6xl">
              More Than Shopping,
              <span className="mt-2 block text-[#278653]">
                It's an Experience.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#718075] sm:text-base sm:leading-8">
              Welcome to EVO STORE. We believe that shopping should be simple,
              enjoyable, and accessible. Our goal is to bring you a convenient
              shopping experience with products you will love.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#278653] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#278653]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#206B42] hover:shadow-xl"
              >
                Explore Products
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCE6DC] bg-white px-6 py-3.5 text-sm font-bold text-[#26382D] transition hover:border-[#278653] hover:text-[#278653]"
              >
                Contact Us
              </Link>
            </div>

            {/* Small Highlights */}
            <div className="mt-10 flex flex-wrap gap-6 border-t border-[#E3EBE3] pt-7">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#278653]" />
                <span className="text-xs font-semibold text-[#718075]">
                  Easy Shopping
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#278653]" />
                <span className="text-xs font-semibold text-[#718075]">
                  Quality Products
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#278653]/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-[#E7F0E8] p-5 shadow-2xl shadow-[#26382D]/10 sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#278653]/10" />
              <div className="absolute -bottom-12 -left-10 h-48 w-48 rounded-full bg-[#278653]/10" />

              <div className="relative flex min-h-[340px] flex-col items-center justify-center rounded-[1.5rem] border border-white/80 bg-white/70 px-6 text-center backdrop-blur-sm sm:min-h-[390px]">
                <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#278653] text-white shadow-xl shadow-[#278653]/20">
                  <ShoppingBag size={43} strokeWidth={1.5} />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.3em] text-[#278653]">
                  Welcome To
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-tight text-[#26382D] sm:text-5xl">
                  EVO STORE
                </h2>

                <p className="mt-4 max-w-xs text-sm leading-6 text-[#718075]">
                  Your destination for a better shopping experience.
                </p>

                <div className="mt-8 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Star
                      key={item}
                      size={17}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-3 left-2 flex items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-xl sm:-left-6 sm:p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4EC] text-[#278653]">
                  <Heart size={22} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#26382D]">
                    Made With Care
                  </p>
                  <p className="mt-1 text-[10px] text-[#849187]">
                    Your satisfaction matters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="border-y border-[#E3EBE3] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#278653]">
              Who We Are
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#26382D] sm:text-4xl">
              A Better Way to
              <span className="block text-[#278653]">
                Shop Online.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#718075]">
              EVO STORE is built around a simple idea: making online shopping
              easier and more enjoyable. We want to provide a place where
              customers can explore products, discover what they need, and
              shop with confidence.
            </p>

            <p className="mt-4 text-sm leading-8 text-[#718075]">
              We believe that a great shopping experience is not just about
              products. It is also about convenience, trust, and taking care
              of our customers throughout their journey.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#278653] transition hover:gap-3"
            >
              Discover Our Collection
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-[#EAF4EC] p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#278653] shadow-sm">
                <Target size={24} />
              </div>

              <h3 className="mt-6 text-lg font-bold text-[#26382D]">
                Our Mission
              </h3>

              <p className="mt-3 text-xs leading-6 text-[#718075] sm:text-sm">
                To make shopping simple, convenient, and enjoyable for
                everyone.
              </p>
            </div>

            <div className="mt-8 rounded-3xl bg-[#26382D] p-6 text-white sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#B8E6C5]">
                <Eye size={24} />
              </div>

              <h3 className="mt-6 text-lg font-bold">
                Our Vision
              </h3>

              <p className="mt-3 text-xs leading-6 text-white/65 sm:text-sm">
                To build a shopping destination customers can rely on and
                enjoy.
              </p>
            </div>

            <div className="rounded-3xl bg-[#26382D] p-6 text-white sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#B8E6C5]">
                <Leaf size={24} />
              </div>

              <h3 className="mt-6 text-lg font-bold">
                Our Values
              </h3>

              <p className="mt-3 text-xs leading-6 text-white/65 sm:text-sm">
                Quality, simplicity, transparency, and customer satisfaction.
              </p>
            </div>

            <div className="mt-8 rounded-3xl bg-[#EAF4EC] p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#278653] shadow-sm">
                <Heart size={24} />
              </div>

              <h3 className="mt-6 text-lg font-bold text-[#26382D]">
                Our Promise
              </h3>

              <p className="mt-3 text-xs leading-6 text-[#718075] sm:text-sm">
                Putting your shopping experience at the heart of everything
                we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF4EC] text-[#278653]">
              <Sparkles size={24} />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#278653]">
              The EVO Difference
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#26382D] sm:text-4xl">
              Why Choose Us?
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#849187]">
              We focus on the details that make your shopping experience
              better, easier, and more enjoyable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-[#E3EBE3] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#B9D8C0] hover:shadow-xl hover:shadow-[#26382D]/5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4EC] text-[#278653] transition duration-300 group-hover:bg-[#278653] group-hover:text-white">
                    <Icon size={25} strokeWidth={1.7} />
                  </div>

                  <span className="mt-7 block text-xs font-bold text-[#A3B0A5]">
                    0{index + 1}
                  </span>

                  <h3 className="mt-2 text-lg font-bold text-[#26382D]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#849187]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#26382D] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full border-[40px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full border-[50px] border-white/5" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#B8E6C5]">
              <ShoppingBag size={27} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#B8E6C5]">
              Start Your Journey
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Ready to Discover Something New?
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/65">
              Explore our collection and find products that fit your style and
              needs. Your next favorite product might be just one click away.
            </p>

            <Link
              href="/products"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#319A60]"
            >
              Start Shopping
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
