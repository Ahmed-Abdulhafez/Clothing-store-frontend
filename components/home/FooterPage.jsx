
"use client";

import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  ArrowUpLeft,
  Heart,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "My Account", href: "/account" },
];

const customerLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "FAQs", href: "/faq" },
];

export default function FooterPage() {
  return (
    <footer className="mt-20 bg-[#26382D] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group mb-5 inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#278653] transition group-hover:bg-[#319e64]">
                <ShoppingBag size={25} />
              </span>

              <span>
                <span className="block text-xl font-extrabold tracking-wide">
                  EVO STORE
                </span>
                <span className="text-xs text-gray-300">
                  Style that defines you.
                </span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-300">
              Discover your style with our latest collections.
              Quality products, modern designs, and a better
              shopping experience, all in one place.
            </p>

            {/* Social Media */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-[#278653] hover:bg-[#278653]"
              >
                <FaInstagram size={19} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-[#278653] hover:bg-[#278653]"
              >
                <FaFacebookF size={19} />
              </a>

              <a
                href="mailto:support@evostore.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-[#278653] hover:bg-[#278653]"
              >
                <Mail size={19} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
                  >
                    <ArrowUpLeft
                      size={15}
                      className="text-[#278653] transition group-hover:-translate-y-0.5"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-6 text-lg font-bold">
              Customer Service
            </h3>

            <ul className="space-y-4">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
                  >
                    <ArrowUpLeft
                      size={15}
                      className="text-[#278653] transition group-hover:-translate-y-0.5"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-6 text-lg font-bold">
              Get in Touch
            </h3>

            <p className="mb-5 text-sm leading-6 text-gray-300">
              Have a question? We are here to help you.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#52B77C]">
                  <Mail size={17} />
                </span>

                <div>
                  <p className="mb-1 text-xs text-gray-400">
                    Email Address
                  </p>
                  <a
                    href="mailto:support@evostore.com"
                    className="break-all text-sm transition hover:text-[#52B77C]"
                  >
                    support@evostore.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#52B77C]">
                  <Phone size={17} />
                </span>

                <div>
                  <p className="mb-1 text-xs text-gray-400">
                    Phone Number
                  </p>
                  <p className="text-sm text-gray-200">
                    Contact us by email
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#52B77C]">
                  <MapPin size={17} />
                </span>

                <div>
                  <p className="mb-1 text-xs text-gray-400">
                    Location
                  </p>
                  <p className="text-sm text-gray-200">
                    Egypt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-5 py-5 text-center sm:flex-row sm:px-8 lg:px-12">
          <p className="text-xs leading-6 text-gray-400 sm:text-sm">
            © {new Date().getFullYear()} EVO STORE. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-gray-400 sm:text-sm">
            Made with
            <Heart
              size={14}
              className="fill-[#278653] text-[#278653]"
            />
            for a better shopping experience.
          </p>
        </div>
      </div>
    </footer>
  );
}