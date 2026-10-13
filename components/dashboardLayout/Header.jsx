"use client";

import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import admin from "../../public/favicon.ico";
import Link from "next/link";

const Header = ({sidebarOpen }) => {
  return (
    <header className={`
        fixed top-0 right-0 z-5
        left-0
        transition-[left] duration-300 ease-in-out bg-[#1e1e1e]
        border-b border-white/10
        shadow-lg
        ${sidebarOpen ? "lg:left-64" : "lg:left-20"}
      `}>
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Side */}
        <div>
          <h1 className="text-lg font-semibold text-white sm:text-xl lg:text-2xl">
            Dashboard
          </h1>

          <p className="mt-1 hidden text-xs text-gray-400 sm:block">
            Welcome back to Evo Store
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Small Logo */}
          <div className="hidden rounded-lg border border-[#333] bg-[#252525] p-2 sm:block">
            <Image
              src={admin}
              alt="Evo Store"
              width={20}
              height={20}
              className="rounded-full"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg p-2.5 text-gray-400 transition hover:bg-[#292929] hover:text-white"
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />

            {/* Notification badge */}
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#1e1e1e]" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#333] sm:block" />

          {/* Admin Profile */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#292929] sm:gap-3"
          >
            <Image
              src={admin}
              alt="Admin"
              width={38}
              height={38}
              className="rounded-full border border-gray-600 object-cover"
            />

            <div className="hidden text-left sm:block">
              <Link href="/">
                <p className="text-sm font-medium text-white">Evo Store</p>
              </Link>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>

            <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
