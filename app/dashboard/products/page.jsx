
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  LoaderCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { deleteProduct, getProducts } from "@/services/productService";

const CREATE_PRODUCT_URL = "/dashboard/products/create";

function normalizeProducts(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.data?.products)) {
    return response.data.products;
  }

  return [];
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-[#1e1e1e] p-5 shadow-sm transition-colors hover:border-gray-600">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <p className="mt-2 text-2xl font-bold text-gray-100">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
          <Icon className="h-5 w-5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ searching }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
      {searching ? (
        <Search className="h-9 w-9 text-gray-500" />
      ) : (
        <Package className="h-9 w-9 text-gray-500" />
      )}

      <h3 className="mt-4 font-semibold text-gray-100">
        {searching ? "No matching products" : "No products yet"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
        {searching
          ? "Try another product name, brand, or ID."
          : "Create your first product to get started."}
      </p>

      {!searching && (
        <Link
          href={CREATE_PRODUCT_URL}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Plus size={16} />
          Create Product
        </Link>
      )}
    </div>
  );
}

export default function DashboardProductsPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products.
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Normalize API response.
  const products = useMemo(() => normalizeProducts(data), [data]);

  // Search by title, brand, or product ID.
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) =>
      [product.title, product.brand, product._id].some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      )
    );
  }, [products, searchTerm]);

  // Delete product.
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: async () => {
      setProductToDelete(null);

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (mutationError) => {
      console.error(
        "Error deleting product:",
        mutationError.response?.data || mutationError.message
      );
    },
  });

  // Loading state.
  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-emerald-400" />

          <p className="text-sm text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // Error state.
  if (isError) {
    return (
      <div className="rounded-xl border border-red-900/60 bg-[#1e1e1e] p-6">
        <h2 className="font-semibold text-red-400">
          Failed to load products
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          {error?.message || "An unexpected error occurred."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-100">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Manage your store products and inventory.
          </p>
        </div>

        <Link
          href={CREATE_PRODUCT_URL}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Plus size={17} />
          Create Product
        </Link>
      </header>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
        />

        <StatCard
          title="Featured Products"
          value={products.filter((product) => product.isFeatured).length}
          icon={Package}
        />

        <StatCard
          title="In Stock"
          value={products.filter((product) => Number(product.stock) > 0).length}
          icon={Package}
        />
      </section>

      {/* Products Table */}
      <section className="overflow-hidden rounded-xl border border-gray-700 bg-[#1e1e1e] shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-gray-700 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Search, edit, and manage your products.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, brand, or ID..."
              aria-label="Search products by name, brand, or ID"
              className="w-full rounded-lg border border-gray-700 bg-[#252525] py-2.5 pl-10 pr-10 text-sm text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-100"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <EmptyState searching={false} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState searching />
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-700 bg-[#292929] text-left">
                  {[
                    "Product",
                    "Brand",
                    "Price",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-300"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700/70">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="transition-colors hover:bg-[#292929]"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-700 bg-[#252525]">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.title || "Product"}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-500" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-56 truncate text-sm font-semibold text-gray-100">
                            {product.title || "Untitled Product"}
                          </p>

                          <p className="mt-1 max-w-56 truncate text-xs text-gray-500">
                            ID: {product._id || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {product.brand || "—"}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-100">
                        {product.price != null
                          ? `$${product.price}`
                          : "—"}
                      </p>

                      {product.offerPrice != null &&
                        product.offerPrice !== "" && (
                          <p className="mt-1 text-xs font-medium text-emerald-400">
                            Offer: ${product.offerPrice}
                          </p>
                        )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4 text-sm font-medium text-gray-300">
                      {product.stock ?? 0}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                          Number(product.stock) > 0
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {Number(product.stock) > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/products/${product._id}/edit`}
                          title="Edit product"
                          aria-label={`Edit ${product.title || "product"}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-300 transition hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            deleteMutation.reset();
                            setProductToDelete(product);
                          }}
                          disabled={deleteMutation.isPending}
                          title="Delete product"
                          aria-label={`Delete ${product.title || "product"}`}
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-900/60 text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Results Footer */}
        {products.length > 0 && (
          <footer className="border-t border-gray-700 px-5 py-4">
            <p className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-100">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-100">
                {products.length}
              </span>{" "}
              products
            </p>
          </footer>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleteMutation.isPending
            ) {
              setProductToDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#1e1e1e] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2
                id="delete-dialog-title"
                className="text-lg font-semibold text-gray-100"
              >
                Confirm Deletion
              </h2>

              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleteMutation.isPending}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-[#292929] hover:text-gray-100 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <AlertTriangle size={28} className="text-red-400" />
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-400">
                Are you sure you want to delete this product?
                This action cannot be undone.
              </p>

              <p className="mt-2 break-words font-semibold text-gray-100">
                {productToDelete.title || "Untitled Product"}
              </p>

              {deleteMutation.isError && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg border border-red-900/60 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  {deleteMutation.error?.response?.data?.message ||
                    deleteMutation.error?.message ||
                    "Failed to delete product. Please try again."}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleteMutation.isPending}
                className="cursor-pointer rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292929] hover:text-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleteMutation.isPending || !productToDelete._id
                }
                onClick={() => {
                  deleteMutation.mutate(productToDelete._id);
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
