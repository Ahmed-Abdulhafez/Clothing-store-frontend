"use client";

import {
  Bell,
  DollarSign,
  Info,
  House,
  Mail,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const ICONS = {
  House,
  DollarSign,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Mail,
  User,
  Bell,
  Info,
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [sidebarItem, setSidebarItem] = useState([]);

  const pathname = usePathname();

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        setSidebarItem(data.sidebarItem || []);
      })
      .catch((error) => {
        console.error("Error loading sidebar:", error);
      });
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen
          border-r border-[#2f2f2f]
          bg-[#1e1e1e]
          shadow-2xl
          transition-all duration-300 ease-in-out

          ${isOpen ? "w-64" : "w-[80px]"}

          max-lg:w-64
          ${isOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-[#2f2f2f] px-4">
          {/* Logo */}
          <Link href="/">
            <div
              className={`
              flex items-center gap-3 overflow-hidden
              transition-all duration-300
              ${isOpen ? "w-full" : "w-10"}
            `}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-black">
                E
              </div>

              <div
                className={`
                whitespace-nowrap transition-all duration-200
                ${isOpen ? "opacity-100" : "w-0 opacity-0"}
              `}
              >
                <h2 className="text-sm font-semibold text-white">Evo Store</h2>

                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </Link>
          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              hidden
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-gray-400
              transition
              hover:bg-[#2f2f2f]
              hover:text-white
              lg:flex
            "
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`
                h-5 w-5 transition-transform duration-300
                ${isOpen ? "" : "rotate-180"}
              `}
            />
          </button>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-gray-400
              hover:bg-[#2f2f2f]
              hover:text-white
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-80px)] overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {sidebarItem.map((item) => {
              const IconComponent = ICONS[item.icon];

              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className="group relative block"
                >
                  <div
                    className={`
                      flex h-12 items-center rounded-xl
                      transition-all duration-200

                      ${
                        isActive
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                      }

                      ${isOpen ? "px-3" : "justify-center px-0"}
                    `}
                  >
                    {/* Icon */}
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                      {IconComponent ? (
                        <IconComponent
                          size={20}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      ) : (
                        <Info size={20} />
                      )}
                    </div>

                    {/* Text */}
                    <span
                      className={`
                        ml-4 whitespace-nowrap text-sm font-medium
                        transition-all duration-200

                        ${
                          isOpen
                            ? "translate-x-0 opacity-100"
                            : "pointer-events-none absolute translate-x-2 opacity-0"
                        }
                      `}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Tooltip when collapsed */}
                  {!isOpen && (
                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-full
                        top-1/2
                        z-[100]
                        ml-3
                        -translate-y-1/2
                        whitespace-nowrap
                        rounded-lg
                        bg-[#111]
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-white
                        opacity-0
                        shadow-lg
                        transition-opacity
                        group-hover:opacity-100
                      "
                    >
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile Open Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="
            fixed
            left-4
            top-4
            z-30
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[#333]
            bg-[#1e1e1e]
            text-gray-300
            shadow-lg
            transition
            hover:bg-[#2a2a2a]
            hover:text-white
            lg:hidden
          "
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
