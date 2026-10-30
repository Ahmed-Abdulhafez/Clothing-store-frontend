"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, LoaderCircle, Package, X } from "lucide-react";

import { getProducts } from "@/services/productService";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products
  const { data, isError, isFetching } = useQuery({
    queryKey: ["searchProducts", debouncedSearch],
    queryFn: () =>
      getProducts({
        search: debouncedSearch,
        page: 1,
        limit: 5,
      }),
    enabled: debouncedSearch.length >= 2 && isOpen,
    staleTime: 30 * 1000,
  });

  // Extract products correctly based on your API response
  // استخراج المنتجات (بما أن data نفسه هو المصفوفة)
  const products = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  // للتأكد في الـ Console
  // console.log("API Data:", data);
  // console.log("Extracted Products:", products);

  // Clear search
  const handleClear = () => {
    setSearch("");
    setDebouncedSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative hidden lg:block">
      {/* Search Input */}
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 transition focus-within:border-lime-500 focus-within:bg-white"
      >
        <Search size={17} className="shrink-0 text-gray-400" />

        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          aria-label="Search products"
          aria-expanded={isOpen && search.trim().length >= 2}
          className="w-36 bg-transparent py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 xl:w-44"
        />

        {isFetching && search.trim().length >= 2 ? (
          <LoaderCircle size={16} className="animate-spin text-lime-600" />
        ) : search ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="cursor-pointer text-gray-400 transition hover:text-gray-700"
          >
            <X size={16} />
          </button>
        ) : null}
      </form>

      {/* Search Results */}
      {isOpen && search.trim().length >= 2 && (
        <>
          {/* Close results when clicking outside */}
          <button
            type="button"
            aria-label="Close search results"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-xs font-semibold text-gray-500">
                Search Results
              </p>

              <p className="mt-1 truncate text-sm text-gray-800">{search}</p>
            </div>

            {/* Loading */}
            {isFetching ? (
              <div className="flex items-center justify-center gap-2 p-6 text-sm text-gray-500">
                <LoaderCircle
                  size={18}
                  className="animate-spin text-lime-600"
                />
                Searching products...
              </div>
            ) : isError ? (
              /* Error */
              <p className="p-5 text-center text-sm text-red-500">
                Failed to load products. Please try again.
              </p>
            ) : products.length > 0 ? (
              /* Products */
              <div className="max-h-80 overflow-y-auto">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    onClick={handleClear}
                    className="flex items-center gap-3 border-b border-gray-50 p-3 transition last:border-b-0 hover:bg-gray-50"
                  >
                    {/* Product Image */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={22} className="text-gray-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {product.title}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-lime-700">
                        {Number(product.offerPrice) > 0
                          ? product.offerPrice
                          : product.price}{" "}
                        EGP
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Empty Results */
              <div className="p-6 text-center">
                <Package size={28} className="mx-auto mb-2 text-gray-300" />

                <p className="text-sm font-medium text-gray-700">
                  No products found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try another product name.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
