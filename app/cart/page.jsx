"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  LoaderCircle,
  AlertCircle,
  ShoppingCart,
  PackageCheck,
  X,
} from "lucide-react";

import {
  getUserCart,
  updateSpecificQuantity,
  removeCartItem,
  clearEntireCart,
} from "@/services/cartService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

function getCartItems(response) {
  const cart = response?.cart ?? response?.data?.cart ?? response;

  if (Array.isArray(cart?.cartItems)) {
    return cart.cartItems;
  }

  if (Array.isArray(cart?.items)) {
    return cart.items;
  }

  if (Array.isArray(cart?.products)) {
    return cart.products;
  }

  return [];
}

function getProduct(item) {
  if (item?.product && typeof item.product === "object") {
    return item.product;
  }

  if (item?.productId && typeof item.productId === "object") {
    return item.productId;
  }

  return item;
}

function getProductImage(product) {
  return (
    product?.images?.[0]?.url ||
    product?.image?.url ||
    (typeof product?.image === "string" ? product.image : "") ||
    ""
  );
}

function getProductPrice(product) {
  const price = Number(product?.price) || 0;
  const offerPrice = Number(product?.offerPrice);

  return offerPrice > 0 && offerPrice < price ? offerPrice : price;
}

function LoadingCart() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-gray-400">
      <LoaderCircle className="h-10 w-10 animate-spin text-emerald-500" />
      <p>Loading your cart...</p>
    </div>
  );
}

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: getUserCart,
  });

  const refreshCart = () =>
    queryClient.invalidateQueries({ queryKey: ["cart"] });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }) => updateSpecificQuantity(id, quantity),
    onSuccess: refreshCart,
  });

  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: refreshCart,
  });

  const clearCartMutation = useMutation({
    mutationFn: clearEntireCart,
    onSuccess: refreshCart,
  });

  const items = getCartItems(data);

  const subtotal = items.reduce((total, item) => {
    const product = getProduct(item);
    const price = getProductPrice(product);
    const quantity = Math.max(0, Number(item.quantity) || 0);

    return total + price * quantity;
  }, 0);

  const isUpdating =
    updateQuantityMutation.isPending ||
    removeItemMutation.isPending ||
    clearCartMutation.isPending;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#171717] px-4">
        <LoadingCart />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#171717] px-4 text-center text-white">
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />

        <h1 className="text-2xl font-bold">Unable to Load Your Cart</h1>

        <p className="mt-2 text-gray-400">
          Something went wrong while loading your cart.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500"
        >
          Try Again
        </button>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#171717] px-4 text-center text-white">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#252525]">
          <ShoppingBag className="h-12 w-12 text-emerald-400" />
        </div>

        <h1 className="text-3xl font-bold">Your Cart Is Empty</h1>

        <p className="mt-3 max-w-md text-gray-400">
          Looks like you haven&apos;t added anything to your cart yet. Explore
          our products and find your favorites.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500"
        >
          <ShoppingBag size={19} />
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#171717] px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Evo Store
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">Shopping Cart</h1>

            <p className="mt-2 text-gray-400">
              Review your items before checkout.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-emerald-500 hover:text-emerald-400 sm:self-auto"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>

        {/* Cart Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_350px]">
          {/* Cart Items */}
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Cart Items
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({items.length})
                </span>
              </h2>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear your entire cart?",
                    )
                  ) {
                    clearCartMutation.mutate();
                  }
                }}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
              >
                {clearCartMutation.isPending ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => {
                const product = getProduct(item);
                const imageUrl = getProductImage(product);
                const price = getProductPrice(product);
                const quantity = Math.max(1, Number(item.quantity) || 1);
                const itemId = item._id;
                const productName = product.title || product.name || "Product";

                return (
                  <article
                    key={itemId}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#1e1e1e] p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    {/* Product Image */}
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#292929] sm:h-28 sm:w-28">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={productName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:min-h-28">
                      <div>
                        <h3 className="truncate text-base font-semibold sm:text-lg">
                          {productName}
                        </h3>

                        {product.brand && (
                          <p className="mt-1 text-sm text-gray-400">
                            {product.brand}
                          </p>
                        )}

                        <p className="mt-2 font-semibold text-emerald-400">
                          {formatPrice(price)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border border-gray-700">
                          <button
                            aria-label="Decrease quantity"
                            disabled={isUpdating || quantity <= 1}
                            onClick={() =>
                              updateQuantityMutation.mutate({
                                id: itemId,
                                quantity: quantity - 1,
                              })
                            }
                            className="p-2.5 text-gray-300 transition hover:text-emerald-400 disabled:opacity-30"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-10 text-center text-sm font-semibold">
                            {quantity}
                          </span>

                          <button
                            aria-label="Increase quantity"
                            disabled={isUpdating}
                            onClick={() =>
                              updateQuantityMutation.mutate({
                                id: itemId,
                                quantity: quantity + 1,
                              })
                            }
                            className="p-2.5 text-gray-300 transition hover:text-emerald-400 disabled:opacity-30"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="font-semibold">
                            {formatPrice(price * quantity)}
                          </p>

                          <button
                            aria-label={`Remove ${productName}`}
                            title="Remove item"
                            disabled={isUpdating}
                            onClick={() => removeItemMutation.mutate(itemId)}
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Mutation Error */}
            {(updateQuantityMutation.isError ||
              removeItemMutation.isError ||
              clearCartMutation.isError) && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                <AlertCircle size={18} />
                <p>The cart could not be updated. Please try again.</p>
                <button
                  onClick={() => {
                    updateQuantityMutation.reset();
                    removeItemMutation.reset();
                    clearCartMutation.reset();
                  }}
                  className="ml-auto"
                  aria-label="Dismiss error"
                >
                  <X size={17} />
                </button>
              </div>
            )}
          </section>

          {/* Order Summary */}
          <aside className="rounded-2xl border border-gray-800 bg-[#1e1e1e] p-5 sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">
                  Subtotal ({items.length} items)
                </span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">Shipping</span>
                <span className="text-gray-400">Calculated at checkout</span>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Shipping fees and final order total will be confirmed at
                  checkout.
                </p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold transition hover:bg-emerald-500"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#252525] p-3">
              <PackageCheck className="h-6 w-6 shrink-0 text-emerald-400" />
              <p className="text-xs leading-5 text-gray-400">
                Your order details will be reviewed before the purchase is
                completed.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
