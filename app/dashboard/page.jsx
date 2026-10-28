
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Box,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  Clock3,
  CreditCard,
  Eye,
  Package,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { getAllOrders } from "@/services/orderService";

const COLORS = {
  page: "#141615",
  card: "#1E1E1E",
  inner: "#252825",
  accent: "#278653",
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const getOrderId = (order) =>
  order?._id || order?.id || "";

const getCustomerName = (order) => {
  const user = order?.user;

  if (typeof user === "object" && user !== null) {
    return (
      user.username ||
      user.name ||
      user.fullName ||
      user.email ||
      "Customer"
    );
  }

  return "Customer";
};

const getCustomerEmail = (order) => {
  const user = order?.user;

  if (typeof user === "object" && user !== null) {
    return user.email || "";
  }

  return "";
};

const getOrderItems = (order) => {
  if (Array.isArray(order?.cartItems)) return order.cartItems;
  if (Array.isArray(order?.orderItems)) return order.orderItems;
  if (Array.isArray(order?.items)) return order.items;

  return [];
};

const getProductName = (item) => {
  const product = item?.product;

  if (typeof product === "object" && product !== null) {
    return (
      product.title ||
      product.name ||
      item?.title ||
      item?.name ||
      "Unnamed Product"
    );
  }

  return item?.title || item?.name || "Unnamed Product";
};

const getProductId = (item) => {
  const product = item?.product;

  if (typeof product === "object" && product !== null) {
    return product._id || product.id || getProductName(item);
  }

  return product || item?._id || getProductName(item);
};

const getItemQuantity = (item) =>
  Number(item?.quantity ?? item?.count ?? 1) || 0;

const getOrderTotal = (order) =>
  Number(
    order?.totalOrderPrice ??
      order?.totalPrice ??
      order?.totalAmount ??
      0
  ) || 0;

const isOrderPaid = (order) =>
  order?.isPaid === true ||
  order?.paymentStatus === "paid";

const isOrderDelivered = (order) =>
  order?.isDelivered === true ||
  order?.status === "delivered";

const getPaymentLabel = (order) => {
  if (isOrderPaid(order)) return "Paid";
  if (order?.paymentStatus === "failed") return "Failed";

  return "Pending";
};

const getDeliveryLabel = (order) => {
  if (isOrderDelivered(order)) return "Delivered";

  const status = String(order?.status || "").toLowerCase();

  if (status === "cancelled" || status === "canceled") {
    return "Cancelled";
  }

  if (status === "processing") return "Processing";
  if (status === "shipped") return "Shipped";

  return "Pending";
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconColor = "text-emerald-400",
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-[#1E1E1E] p-5 transition duration-200 hover:border-emerald-500/30 hover:bg-[#202321]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-400">
            {title}
          </p>

          <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-[#252825]">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
        <p className="text-xs text-gray-500">
          {description}
        </p>

        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, type = "delivery" }) {
  const normalized = String(status || "").toLowerCase();

  let styles =
    "border-gray-500/20 bg-gray-500/10 text-gray-300";

  if (
    normalized === "paid" ||
    normalized === "delivered"
  ) {
    styles =
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  } else if (
    normalized === "pending" ||
    normalized === "processing" ||
    normalized === "shipped"
  ) {
    styles =
      "border-amber-500/20 bg-amber-500/10 text-amber-400";
  } else if (
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    styles =
      "border-red-500/20 bg-red-500/10 text-red-400";
  }

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      {status || (type === "payment" ? "Pending" : "Pending")}
    </span>
  );
}

function SectionHeading({
  title,
  description,
  action,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon = Package,
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#252825]">
        <Icon className="h-6 w-6 text-gray-500" />
      </div>

      <h3 className="mt-4 font-medium text-gray-200">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#141615] text-center">
      <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />

      <div>
        <p className="font-medium text-white">
          Loading dashboard
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Please wait while we fetch your store data.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#141615] px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#1E1E1E] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
          <CircleAlert className="h-7 w-7 text-red-400" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          Something went wrong while retrieving your order data.
          Please try again.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#216f44] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  // Supports common API response formats.
  const orders = Array.isArray(data)
    ? data
    : Array.isArray(data?.orders)
      ? data.orders
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.data?.orders)
          ? data.data.orders
          : [];

  const paidOrders = orders.filter(isOrderPaid);

  const totalSales = paidOrders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  );

  const pendingOrders = orders.filter(
    (order) => !isOrderPaid(order)
  );

  const deliveredOrders = orders.filter(
    isOrderDelivered
  );

  const customerIds = new Set(
    orders
      .map((order) => {
        const user = order?.user;

        if (typeof user === "object" && user !== null) {
          return user._id || user.id || user.email;
        }

        return user;
      })
      .filter(Boolean)
      .map(String)
  );

  const customersCount = customerIds.size;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b?.createdAt || 0).getTime() -
        new Date(a?.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const productsMap = new Map();

  orders.forEach((order) => {
    getOrderItems(order).forEach((item) => {
      const id = String(getProductId(item));
      const existing = productsMap.get(id);

      if (existing) {
        existing.quantity += getItemQuantity(item);
      } else {
        productsMap.set(id, {
          id,
          name: getProductName(item),
          quantity: getItemQuantity(item),
        });
      }
    });
  });

  const topProducts = [...productsMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const averageOrderValue = paidOrders.length
    ? totalSales / paidOrders.length
    : 0;

  const paidPercentage = orders.length
    ? Math.round((paidOrders.length / orders.length) * 100)
    : 0;

  return (
    <main
      dir="ltr"
      className="min-h-screen bg-[#141615] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8"
    >
      <div className="mx-auto max-w-[1600px] space-y-8">
        {/* Page Header */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#1E2420]">
          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <Activity className="h-3.5 w-3.5" />
                Store Overview
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                Monitor your store performance, track orders,
                and review your latest sales activity.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-black/10 px-4 py-3 text-sm text-gray-300">
                <CalendarDays className="h-4 w-4 text-emerald-400" />
                {formatDate(new Date())}
              </div>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#278653] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#216f44] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    isFetching ? "animate-spin" : ""
                  }`}
                />
                Refresh Data
              </button>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <SectionHeading
            title="Store Performance"
            description="A quick overview of your store's current activity."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Sales"
              value={formatPrice(totalSales)}
              description="From paid orders"
              icon={Banknote}
              iconColor="text-emerald-400"
            />

            <StatCard
              title="Total Orders"
              value={orders.length.toLocaleString("en-US")}
              description={`${paidOrders.length} paid orders`}
              icon={ShoppingCart}
              iconColor="text-blue-400"
            />

            <StatCard
              title="Total Customers"
              value={customersCount.toLocaleString("en-US")}
              description="Unique customers in orders"
              icon={Users}
              iconColor="text-violet-400"
            />

            <StatCard
              title="Delivered Orders"
              value={deliveredOrders.length.toLocaleString("en-US")}
              description="Successfully delivered"
              icon={BadgeCheck}
              iconColor="text-amber-400"
            />
          </div>
        </section>

        {/* Sales Summary */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#1E1E1E] p-5 sm:p-6 lg:col-span-2">
            <SectionHeading
              title="Sales Summary"
              description="Payment and order performance at a glance."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.05] bg-[#252825] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-400">
                    Paid Orders
                  </span>
                  <span className="rounded-lg bg-emerald-500/10 p-2">
                    <CreditCard className="h-4 w-4 text-emerald-400" />
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-white">
                  {paidOrders.length}
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${paidPercentage}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {paidPercentage}% of all orders
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-[#252825] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-400">
                    Pending Payments
                  </span>
                  <span className="rounded-lg bg-amber-500/10 p-2">
                    <Clock3 className="h-4 w-4 text-amber-400" />
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-white">
                  {pendingOrders.length}
                </p>

                <p className="mt-3 text-xs text-gray-500">
                  Orders not marked as paid
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.05] bg-[#252825] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-400">
                    Average Order Value
                  </span>
                  <span className="rounded-lg bg-blue-500/10 p-2">
                    <ShoppingBag className="h-4 w-4 text-blue-400" />
                  </span>
                </div>

                <p className="mt-4 break-words text-xl font-bold text-white sm:text-2xl">
                  {formatPrice(averageOrderValue)}
                </p>

                <p className="mt-3 text-xs text-gray-500">
                  Average per paid order
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#1E1E1E] p-5 sm:p-6">
            <SectionHeading
              title="Order Status"
              description="Current order delivery progress."
            />

            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-300">
                    Delivered
                  </span>
                  <span className="font-semibold text-white">
                    {deliveredOrders.length}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${
                        orders.length
                          ? (deliveredOrders.length / orders.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-300">
                    Pending Payment
                  </span>
                  <span className="font-semibold text-white">
                    {pendingOrders.length}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{
                      width: `${
                        orders.length
                          ? (pendingOrders.length / orders.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="border-t border-white/[0.07] pt-4">
                <p className="text-sm text-gray-400">
                  Total revenue
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {formatPrice(totalSales)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Products and Recent Orders */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          {/* Top Products */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#1E1E1E] p-5 sm:p-6 xl:col-span-2">
            <SectionHeading
              title="Top Products"
              description="Products ranked by units in recorded orders."
            />

            {topProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No products yet"
                description="Product sales will appear here when orders contain product items."
              />
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-[#252825] p-3 transition hover:border-white/[0.1]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-[#1E1E1E] text-sm font-bold text-emerald-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-100">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {product.quantity} units sold
                      </p>
                    </div>

                    <Box className="h-4 w-4 shrink-0 text-gray-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#1E1E1E] p-5 sm:p-6 xl:col-span-3">
            <SectionHeading
              title="Recent Orders"
              description="The latest orders placed in your store."
              action={
                <Link
                  href="/dashboard/orders"
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              }
            />

            {recentOrders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No orders found"
                description="New customer orders will appear here."
              />
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr className="border-b border-white/[0.07] text-xs uppercase tracking-wider text-gray-500">
                        <th className="px-3 py-4 font-medium">
                          Order
                        </th>
                        <th className="px-3 py-4 font-medium">
                          Customer
                        </th>
                        <th className="px-3 py-4 font-medium">
                          Total
                        </th>
                        <th className="px-3 py-4 font-medium">
                          Payment
                        </th>
                        <th className="px-3 py-4 font-medium">
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.06]">
                      {recentOrders.map((order) => {
                        const orderId = getOrderId(order);

                        return (
                          <tr
                            key={orderId || order.createdAt}
                            className="transition hover:bg-white/[0.02]"
                          >
                            <td className="px-3 py-4">
                              <p className="font-medium text-white">
                                #{String(orderId).slice(-7).toUpperCase() || "N/A"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {formatDate(order.createdAt)}
                              </p>
                            </td>

                            <td className="px-3 py-4">
                              <p className="max-w-[160px] truncate text-sm text-gray-200">
                                {getCustomerName(order)}
                              </p>
                              <p className="mt-1 max-w-[160px] truncate text-xs text-gray-500">
                                {getCustomerEmail(order)}
                              </p>
                            </td>

                            <td className="px-3 py-4 text-sm font-semibold text-white">
                              {formatPrice(getOrderTotal(order))}
                            </td>

                            <td className="px-3 py-4">
                              <StatusBadge
                                status={getPaymentLabel(order)}
                                type="payment"
                              />
                            </td>

                            <td className="px-3 py-4">
                              {orderId ? (
                                <Link
                                  href={`/dashboard/orders/${orderId}`}
                                  aria-label={`View order ${orderId}`}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-[#252825] text-gray-300 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  N/A
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 md:hidden">
                  {recentOrders.map((order) => {
                    const orderId = getOrderId(order);

                    return (
                      <div
                        key={orderId || order.createdAt}
                        className="rounded-xl border border-white/[0.06] bg-[#252825] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              Order #
                              {String(orderId).slice(-7).toUpperCase() || "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>

                          <StatusBadge
                            status={getPaymentLabel(order)}
                            type="payment"
                          />
                        </div>

                        <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-3">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-gray-400">
                              Customer
                            </span>
                            <span className="max-w-[60%] truncate text-right text-gray-200">
                              {getCustomerName(order)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-gray-400">
                              Total
                            </span>
                            <span className="font-semibold text-white">
                              {formatPrice(getOrderTotal(order))}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-gray-400">
                              Delivery
                            </span>
                            <StatusBadge
                              status={getDeliveryLabel(order)}
                            />
                          </div>
                        </div>

                        {orderId && (
                          <Link
                            href={`/dashboard/orders/${orderId}`}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-[#1E1E1E] px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-emerald-500/30 hover:text-emerald-400"
                          >
                            <Eye className="h-4 w-4" />
                            View Order Details
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Footer Note */}
        <footer className="flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            EVO STORE Admin Dashboard
          </p>

          <p className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Dashboard data is based on the orders returned by your API.
          </p>
        </footer>
      </div>
    </main>
  );
}
