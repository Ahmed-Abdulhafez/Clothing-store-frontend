"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search, Compass, ShoppingBag } from "lucide-react";

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#171717] px-4 py-5 pt-25 text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-emerald-400/5 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/5 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 shadow-lg shadow-emerald-400/5">
          <Compass size={38} className="text-emerald-400" strokeWidth={1.5} />
        </div>

        {/* 404 */}
        <div className="relative">
          <h1 className="select-none text-8xl font-black tracking-tighter text-emerald-400 sm:text-9xl">
            404
          </h1>

          <div className="absolute -right-3 -top-2 h-3 w-3 animate-pulse rounded-full bg-emerald-300" />
        </div>

        {/* Divider */}
        <div className="my-6 h-1 w-16 rounded-full bg-emerald-400" />

        {/* Content */}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Page Not Found
        </h2>

        <p className="mt-4 max-w-md text-sm leading-7 text-gray-400 sm:text-base">
          Oops! The page you're looking for doesn't exist or may have been
          moved. Let's get you back to where you belong.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-3.5 text-sm font-bold text-[#171717] shadow-lg shadow-emerald-400/10 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-emerald-400/20 active:scale-95"
          >
            <Home size={18} />
            Back to Home
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-[#202020] px-7 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-emerald-400/5 hover:text-emerald-400 active:scale-95"
          >
            <ShoppingBag size={18} />
            Explore Products
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center gap-2 text-xs font-medium tracking-widest text-gray-600">
          <span className="text-emerald-400">EVO</span>
          <span>STORE</span>
          <span className="mx-1">•</span>
          <span>404 ERROR</span>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
