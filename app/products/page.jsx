
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Package,
  LoaderCircle,
  RefreshCw,
  Star,
  X,
  Heart,
  Eye,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { getProducts } from "@/services/productService";
import { addToCart } from "@/services/cartService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

function normalizeProducts(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.products)) return response.data.products;
  if (Array.isArray(response?.data?.data)) return response.data.data;

  return [];
}

function getImage(product) {
  const image = product?.images?.[0];

  if (typeof image === "string") return image;
  if (image?.url) return image.url;
  if (typeof product?.image === "string") return product.image;

  return product?.image?.url || "";
}

function getPrice(product) {
  const price = Number(product?.price) || 0;
  const offerPrice = Number(product?.offerPrice) || 0;

  return offerPrice > 0 && offerPrice < price ? offerPrice : price;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [availability, setAvailability] = useState("all");
  const [notice, setNotice] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());

  const toggleFavorite = (productId) => {
    setFavorites((current) => {
      const updated = new Set(current);

      if (updated.has(productId)) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }

      return updated;
    });
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const products = useMemo(() => normalizeProducts(data), [data]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const name = String(
        product.title || product.name || "",
      ).toLowerCase();

      const brand = String(product.brand || "").toLowerCase();
      const inStock = Number(product.stock) > 0;

      const matchesSearch =
        !term || name.includes(term) || brand.includes(term);

      const matchesAvailability =
        availability === "all" ||
        (availability === "available" && inStock) ||
        (availability === "unavailable" && !inStock);

      return matchesSearch && matchesAvailability;
    });

    if (sort === "price-low") {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    }

    if (sort === "price-high") {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    if (sort === "name") {
      result.sort((a, b) =>
        String(a.title || a.name || "").localeCompare(
          String(b.title || b.name || ""),
          "en",
        ),
      );
    }

    return result;
  }, [products, search, sort, availability]);

  const addMutation = useMutation({
    mutationFn: (product) =>
      addToCart({
        productId: product._id,
        quantity: 1,
      }),

    onSuccess: async () => {
      setNotice({
        type: "success",
        text: "Product added to your cart successfully.",
      });

      await queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
    },

    onError: (error) => {
      setNotice({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to add this product to your cart. Please try again.",
      });
    },
  });

  const resetFilters = () => {
    setSearch("");
    setSort("default");
    setAvailability("all");
  };

  // Loading state
  if (isLoading) {
    return (
      <main
        dir="ltr"
        className="flex min-h-[70vh] items-center justify-center bg-[#F5F8F5] px-4 text-[#26382D]"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
            <LoaderCircle
              size={30}
              className="animate-spin text-[#278653]"
            />
          </div>

          <div className="text-center">
            <p className="font-semibold">Loading Products</p>
            <p className="mt-1 text-sm text-[#849187]">
              Please wait while we prepare your store.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (isError) {
    return (
      <main
        dir="ltr"
        className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F5F8F5] px-4 text-center text-[#26382D]"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#91A398] shadow-sm">
          <Package size={32} />
        </div>

        <h1 className="mt-5 text-xl font-bold">Unable to Load Products</h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-[#849187]">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while connecting to the server."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#278653]/20 transition hover:-translate-y-0.5 hover:bg-[#206B42]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main
      dir="ltr"
      className="min-h-screen bg-[#F5F8F5] pt-24 pb-16 text-[#26382D]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <header className="mb-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DCEBDD] bg-white px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#278653]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#278653]">
                  EVO STORE
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#26382D] sm:text-4xl lg:text-5xl">
                Our Products
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#849187] sm:text-base">
                Discover our collection and find the perfect products for your
                style.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-2xl border border-[#E3EBE3] bg-white px-4 py-3 shadow-sm sm:self-auto">
              <Package size={19} className="text-[#278653]" />

              <div>
                <p className="text-lg font-extrabold leading-none text-[#26382D]">
                  {filteredProducts.length}
                </p>
                <p className="mt-1 text-[11px] text-[#849187]">
                  Products Found
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <section className="mb-8 rounded-2xl border border-[#E3EBE3] bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF4EC] text-[#278653]">
              <SlidersHorizontal size={17} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#26382D]">
                Search & Filters
              </h2>
              <p className="text-xs text-[#9AA79D]">
                Find exactly what you are looking for.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_210px_190px]">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91A398]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or brands..."
                aria-label="Search products"
                className="h-12 w-full rounded-xl border border-[#E3EBE3] bg-[#F8FAF8] pl-11 pr-11 text-sm text-[#26382D] outline-none transition placeholder:text-[#A2AEA4] focus:border-[#278653] focus:bg-white focus:ring-4 focus:ring-[#278653]/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#91A398] transition hover:bg-[#EAF4EC] hover:text-[#278653]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sorting */}
            <div className="relative">
              <ArrowUpDown
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#849187]"
              />

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort products"
                className="h-12 w-full appearance-none rounded-xl border border-[#E3EBE3] bg-[#F8FAF8] pl-10 pr-4 text-sm text-[#526357] outline-none transition focus:border-[#278653] focus:ring-4 focus:ring-[#278653]/10"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Availability */}
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              aria-label="Filter by availability"
              className="h-12 w-full rounded-xl border border-[#E3EBE3] bg-[#F8FAF8] px-4 text-sm text-[#526357] outline-none transition focus:border-[#278653] focus:ring-4 focus:ring-[#278653]/10"
            >
              <option value="all">All Products</option>
              <option value="available">In Stock</option>
              <option value="unavailable">Out of Stock</option>
            </select>
          </div>

          {(search || sort !== "default" || availability !== "all") && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF1ED] pt-4">
              <p className="text-xs text-[#849187]">
                Showing {filteredProducts.length} matching products
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#278653] transition hover:text-[#206B42]"
              >
                <RefreshCw size={13} />
                Clear All Filters
              </button>
            </div>
          )}
        </section>

        {/* Notification */}
        {notice && (
          <div
            role="status"
            className={`mb-6 flex items-start justify-between gap-3 rounded-xl border p-4 text-sm ${
              notice.type === "success"
                ? "border-[#C8E5D0] bg-[#EDF7EF] text-[#206B42]"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {notice.type === "success" ? (
                <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
              )}

              <p className="leading-6">{notice.text}</p>
            </div>

            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Close notification"
              className="shrink-0 rounded-lg p-1 transition hover:bg-black/5"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Section Title */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#278653]" />
              <h2 className="text-lg font-bold text-[#26382D] sm:text-xl">
                Explore Products
              </h2>
            </div>

            <p className="mt-1 text-xs text-[#849187]">
              Carefully selected products for you.
            </p>
          </div>

          {isFetching && (
            <LoaderCircle
              size={18}
              className="animate-spin text-[#278653]"
            />
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <section className="rounded-3xl border border-[#E3EBE3] bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF4EC] text-[#91A398]">
              <Package size={38} strokeWidth={1.5} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#26382D]">
              No Products Found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#849187]">
              We couldn't find any products matching your search. Try changing
              your search term or filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#278653]/20 transition hover:-translate-y-0.5 hover:bg-[#206B42]"
            >
              <RefreshCw size={16} />
              Reset Filters
            </button>
          </section>
        ) : (
          /* Products Grid */
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:gap-6">
            {filteredProducts.map((product) => {
              const name = product.title || product.name || "Product";
              const image = getImage(product);
              const price = getPrice(product);
              const originalPrice = Number(product.price) || 0;
              const hasDiscount = price < originalPrice;
              const stock = Number(product.stock) || 0;

              const isAdding =
                addMutation.isPending &&
                addMutation.variables?._id === product._id;

              const isFavorite = favorites.has(product._id);

              return (
                <article
                  key={product._id}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-[#E3EBE3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B9D8C0] hover:shadow-xl hover:shadow-[#26382D]/10 sm:rounded-3xl"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/4.5] overflow-hidden bg-[#EAF1EA]">
                    <Link
                      href={`/products/${product._id}`}
                      aria-label={`View ${name}`}
                      className="absolute inset-0"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#91A398]">
                          <Package size={48} strokeWidth={1.3} />
                        </div>
                      )}
                    </Link>

                    {/* Image Gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-70" />

                    {/* Favorite Button */}
                    <button
                      type="button"
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      aria-pressed={isFavorite}
                      onClick={() => toggleFavorite(product._id)}
                      className={`absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur-md transition duration-200 hover:scale-110 sm:h-10 sm:w-10 ${
                        isFavorite
                          ? "bg-red-500 text-white"
                          : "bg-white/95 text-[#526357] hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-[#278653] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md sm:text-xs">
                        SALE
                      </span>
                    )}

                    {/* Quick View */}
                    <Link
                      href={`/products/${product._id}`}
                      aria-label={`View details of ${name}`}
                      className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#26382D] shadow-md backdrop-blur-md transition duration-200 hover:scale-110 hover:bg-[#278653] hover:text-white"
                    >
                      <Eye size={17} />
                    </Link>

                    {/* Out of Stock Overlay */}
                    {stock <= 0 && (
                      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center bg-black/35">
                        <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#526357] shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Desktop Product Name Overlay */}
                    <Link
                      href={`/products/${product._id}`}
                      className="absolute inset-x-0 bottom-0 z-[6] hidden min-h-24 items-end bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-4 pt-10 opacity-0 transition-opacity duration-300 sm:flex sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                    >
                      <div className="min-w-0">
                        {product.brand && (
                          <p className="mb-1 truncate text-[10px] font-semibold uppercase tracking-wider text-[#B8E6C5]">
                            {product.brand}
                          </p>
                        )}

                        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white">
                          {name}
                        </h3>
                      </div>
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col p-3 sm:p-4">
                    {/* Product Name */}
                    <Link
                      href={`/products/${product._id}`}
                      className="mb-2 line-clamp-2 min-h-10 text-xs font-bold leading-5 text-[#26382D] transition hover:text-[#278653] sm:hidden"
                    >
                      {name}
                    </Link>

                    {/* Brand */}
                    {product.brand && (
                      <p className="mb-2 hidden truncate text-[10px] font-medium uppercase tracking-wider text-[#9AA79D] sm:block">
                        {product.brand}
                      </p>
                    )}

                    {/* Price */}
                    <div className="flex min-h-7 flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-[#278653] sm:text-base">
                        {formatPrice(price)}
                      </span>

                      {hasDiscount && (
                        <span className="text-[10px] text-[#A3AEA5] line-through sm:text-xs">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Rating and Stock */}
                    <div className="mt-3 flex items-center justify-between gap-1 border-t border-[#EDF1ED] pt-3">
                      <span className="flex items-center gap-1 text-[11px] font-medium text-[#718075] sm:text-xs">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        {Number(product.rating || 0).toFixed(1)}
                      </span>

                      <span
                        className={`flex items-center gap-1 text-[10px] font-semibold sm:text-xs ${
                          stock > 0 ? "text-[#278653]" : "text-red-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            stock > 0 ? "bg-[#278653]" : "bg-red-500"
                          }`}
                        />
                        {stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      type="button"
                      disabled={stock <= 0 || isAdding}
                      onClick={() => {
                        setNotice(null);
                        addMutation.mutate(product);
                      }}
                      aria-label={`Add ${name} to cart`}
                      title={
                        stock <= 0
                          ? "Product unavailable"
                          : "Add to cart"
                      }
                      className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#278653] text-white shadow-md shadow-[#278653]/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#206B42] hover:shadow-lg hover:shadow-[#278653]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#E5EAE5] disabled:text-[#91A398] disabled:shadow-none"
                    >
                      {isAdding ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={18} />
                      )}

                      <span className="text-xs font-bold">
                        {isAdding
                          ? "Adding..."
                          : stock <= 0
                            ? "Unavailable"
                            : "Add to Cart"}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Bottom Note */}
        {filteredProducts.length > 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-[#E3EBE3] pt-7 text-center">
            <div className="flex items-center gap-2 text-[#278653]">
              <Sparkles size={15} />
              <span className="text-xs font-bold uppercase tracking-widest">
                EVO STORE
              </span>
            </div>

            <p className="text-xs text-[#9AA79D]">
              Quality products. Better shopping experience.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
