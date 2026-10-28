
"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "@/services/orderService";
import {
  LoaderCircle,
  ShoppingBag,
  AlertCircle,
  Package,
  ArrowRight,
  CalendarDays,
  CreditCard,
  Truck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

function StatusBadge({ active, activeText, inactiveText }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {active ? activeText : inactiveText}
    </span>
  );
}

export default function OrdersPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: getUserOrders,
  });

  // Supports common API response shapes.
  const orders = Array.isArray(data)
    ? data
    : Array.isArray(data?.orders)
      ? data.orders
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.orders)
          ? data.data.orders
          : [];

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#F5F8F5] px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#278653]" />
        </div>

        <div className="text-center">
          <h2 className="font-semibold text-[#26382D]">
            Loading Your Orders
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please wait while we retrieve your orders.
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F8F5] px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#26382D]">
            Unable to Load Orders
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Something went wrong. Please try again."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#278653] px-6 py-3 font-semibold text-white transition hover:bg-[#206d43] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F8F5] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#278653]">
              EVO STORE
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#26382D] sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Track your purchases and check your order status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#26382D] transition hover:border-[#278653] hover:text-[#278653] disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh Orders
          </button>
        </div>

        {/* Orders Summary */}
        {orders.length > 0 && (
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <ShoppingBag className="h-6 w-6 text-[#278653]" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-extrabold text-[#26382D]">
                {orders.length}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm sm:px-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F0F5F0]">
              <Package className="h-10 w-10 text-[#278653]" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#26382D]">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              You haven&apos;t placed any orders yet. Explore our collection
              and find something you love.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-6 py-3 font-semibold text-white transition hover:bg-[#206d43]"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F5F0]">
                      <Package className="h-6 w-6 text-[#278653]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Order Number
                      </p>

                      <h2 className="mt-1 break-all font-bold text-[#26382D]">
                        #{order._id?.slice(-8).toUpperCase() || "N/A"}
                      </h2>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          {formatDate(order.createdAt || order.orderDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm text-gray-500">Order Total</p>
                    <p className="mt-1 text-xl font-extrabold text-[#26382D]">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid gap-5 p-5 sm:grid-cols-2 sm:px-6">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <CreditCard className="h-4 w-4 text-[#278653]" />
                      Payment Status
                    </div>

                    <StatusBadge
                      active={Boolean(order.isPaid)}
                      activeText="Paid"
                      inactiveText="Payment Pending"
                    />

                    {order.paidAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        Paid on {formatDate(order.paidAt)}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-600">
                      <Truck className="h-4 w-4 text-[#278653]" />
                      Delivery Status
                    </div>

                    <StatusBadge
                      active={Boolean(order.isDelivered)}
                      activeText="Delivered"
                      inactiveText="Processing"
                    />

                    {order.deliveredAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        Delivered on {formatDate(order.deliveredAt)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-xs text-gray-500">
                    Thank you for shopping with EVO STORE.
                  </p>

                  <Link
                    href={`/orders/${order._id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#278653]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#278653] transition hover:border-[#278653] hover:bg-[#278653] hover:text-white"
                  >
                    View Order Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}