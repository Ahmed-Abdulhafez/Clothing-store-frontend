"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  ShoppingBag,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
];

const Navbar = () => {
  const { user, logout } = useAuth();

  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Close the mobile menu when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const linkClass = (href) =>
    `text-sm font-medium transition-colors duration-200 ${
      pathname === href
        ? "text-lime-600"
        : "text-gray-600 hover:text-lime-600"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-[101] border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10 xl:px-14"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Evo Store Home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-700 text-white shadow-sm shadow-indigo-600/20">
            <ShoppingBag size={22} strokeWidth={2} />
          </span>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Evo<span className="text-lime-700">Store</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 sm:flex">
          {/* Search */}
          <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 transition focus-within:border-lime-500 focus-within:bg-white lg:flex">
            <Search size={17} className="shrink-0 text-gray-400" />

            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              className="w-36 bg-transparent py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 xl:w-44"
            />
          </div>

          {/* Shopping Cart */}
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-lime-700"
          >
            <ShoppingCart size={21} strokeWidth={1.8} />

            <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-lime-700 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </Link>

          {/* Authenticated User */}
          {user ? (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="flex flex-col items-end">
                <span className="max-w-32 truncate text-sm font-semibold text-gray-800">
                  {user.username || "User"}
                </span>

                {isAdmin && (
                  <span className="text-[11px] font-medium text-emerald-600">
                    Administrator
                  </span>
                )}
              </div>

              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-semibold text-lime-700 transition hover:border-indigo-200 hover:bg-indigo-100"
                >
                  <ShieldCheck size={16} />
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-lime-700"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-lime-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-lime-800 active:scale-[0.98]"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 sm:hidden"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-gray-100 bg-white transition-[max-height,opacity] duration-300 sm:hidden ${
          open
            ? "max-h-[600px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="space-y-4 px-5 py-5">
          {/* Mobile Links */}
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={open ? 0 : -1}
                className={`rounded-lg px-3 py-3 ${linkClass(link.href)} ${
                  pathname === link.href ? "bg-indigo-50" : "hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/cart"
              tabIndex={open ? 0 : -1}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-lime-700"
            >
              <ShoppingCart size={18} />
              Shopping Cart
            </Link>
          </div>

          {/* Mobile User Actions */}
          {user ? (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="px-3">
                <p className="text-sm font-semibold text-gray-800">
                  {user.username || "User"}
                </p>

                {isAdmin && (
                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    Administrator
                  </p>
                )}
              </div>

              {isAdmin && (
                <Link
                  href="/dashboard"
                  tabIndex={open ? 0 : -1}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-50 px-4 py-3 text-sm font-semibold text-lime-700 transition hover:bg-indigo-100"
                >
                  <ShieldCheck size={18} />
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              <Link
                href="/login"
                tabIndex={open ? 0 : -1}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                tabIndex={open ? 0 : -1}
                className="flex-1 rounded-lg bg-lime-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-lime-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;