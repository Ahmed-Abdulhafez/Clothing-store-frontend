"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  LoaderCircle,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  UserRound,
  Phone,
  CreditCard,
  AlertCircle,
  CalendarDays,
  Clock3,
  BadgeCheck,
  Banknote,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

import {
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "@/services/orderService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function StatusBadge({ active, activeLabel, inactiveLabel }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        active
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-amber-500/20 bg-amber-500/10 text-amber-400"
      }`}
    >
      {active ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}

      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-emerald-400">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-200">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });

  const order = data?.data?.order ?? data?.order ?? data?.data ?? data;

  const refreshOrderData = () => {
    queryClient.invalidateQueries({
      queryKey: ["order", id],
    });

    queryClient.invalidateQueries({
      queryKey: ["adminOrders"],
    });
  };

  const payMutation = useMutation({
    mutationFn: () => updateOrderToPaid(id),
    onSuccess: refreshOrderData,
  });

  const deliverMutation = useMutation({
    mutationFn: () => updateOrderToDelivered(id),
    onSuccess: refreshOrderData,
  });

  const mutationError = payMutation.error || deliverMutation.error;

  const mutationSuccess = payMutation.isSuccess || deliverMutation.isSuccess;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-gray-400">
        <LoaderCircle size={36} className="animate-spin text-emerald-400" />
        <p className="text-sm">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order?._id) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-red-500/20 bg-[#181a19] p-8 text-center text-white">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <AlertCircle size={28} />
        </div>

        <h2 className="mt-5 text-lg font-semibold">Unable to load order</h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          {error?.message || "The order could not be found. Please try again."}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5"
          >
            <RefreshCw size={16} />
            Try again
          </button>

          <Link
            href="/dashboard/orders"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium hover:bg-emerald-500"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const shipping = order.shippingAddress || {};

  const items = Array.isArray(order.cartItems) ? order.cartItems : [];

  const paymentMethod =
    order.paymentMethodType === "cash"
      ? "Cash on Delivery"
      : order.paymentMethodType === "card"
        ? "Credit / Debit Card"
        : "—";

  const subtotal = items.reduce((total, item) => {
    return total + (Number(item.price) || 0) * (Number(item.quantity) || 1);
  }, 0);

  const shippingPrice = Number(order.shippingPrice ?? order.shippingCost ?? 0);

  const taxPrice = Number(order.taxPrice ?? 0);

  const totalPrice = Number(
    order.totalPrice ?? subtotal + shippingPrice + taxPrice,
  );

  return (
    <div className="min-w-0 space-y-6 pb-10 text-white">
      {/* Header */}
      <header className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#1c2420] via-[#181a19] to-[#181a19] p-5 sm:p-7">
        <Link
          href="/dashboard/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShoppingBag size={21} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                EVO STORE
              </span>
            </div>

            <p className="text-sm text-gray-400">Order Details</p>

            <h1 className="mt-1 break-all text-2xl font-bold tracking-tight sm:text-3xl">
              #{order._id}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm text-gray-400">
              <CalendarDays size={16} />
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge
              active={order.isPaid}
              activeLabel="Paid"
              inactiveLabel="Payment Pending"
            />

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                order.isDelivered
                  ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                  : "border-gray-500/20 bg-white/[0.04] text-gray-400"
              }`}
            >
              {order.isDelivered ? (
                <CheckCircle2 size={14} />
              ) : (
                <Truck size={14} />
              )}

              {order.isDelivered ? "Delivered" : "Not Delivered"}
            </span>
          </div>
        </div>
      </header>

      {/* Mutation feedback */}
      {mutationError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-300"
        >
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Failed to update order</p>
            <p className="mt-1 text-red-300/80">
              {mutationError.message ||
                "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      )}

      {mutationSuccess && !mutationError && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-300"
        >
          <CheckCircle2 size={19} />
          Order updated successfully.
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        {/* Main Content */}
        <div className="min-w-0 space-y-6 xl:col-span-2">
          {/* Order Items */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#181a19] p-5 sm:p-6">
            <SectionHeader
              icon={Package}
              title="Order Items"
              subtitle={`${items.length} ${
                items.length === 1 ? "product" : "products"
              } in this order`}
            />

            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-500">
                No items found in this order.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.07]">
                {items.map((item, index) => {
                  const quantity = Number(item.quantity) || 1;

                  const unitPrice = Number(item.price) || 0;

                  const productName =
                    item.product?.title || item.title || item.name || "Product";

                  const image =
                    item.product?.images?.[0]?.url ||
                    item.product?.image ||
                    item.image?.url ||
                    item.image;

                  return (
                    <div
                      key={item._id || item.product?._id || index}
                      className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#222523]">
                          {typeof image === "string" && image ? (
                            <img
                              src={image}
                              alt={productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={27} className="text-gray-500" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="break-words font-semibold text-gray-100">
                            {productName}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            SKU: {item.product?._id || item.product || "—"}
                          </p>

                          <p className="mt-2 text-sm text-gray-400">
                            {formatPrice(unitPrice)}{" "}
                            <span className="text-gray-600">×</span> {quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <span className="text-xs text-gray-500 sm:hidden">
                          Item Total
                        </span>

                        <p className="font-bold text-emerald-400">
                          {formatPrice(unitPrice * quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Shipping Information */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#181a19] p-5 sm:p-6">
            <SectionHeader
              icon={MapPin}
              title="Shipping Information"
              subtitle="Delivery address and contact details"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoItem
                icon={UserRound}
                label="Full Name"
                value={shipping.fullName}
              />

              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={shipping.phone}
              />

              <InfoItem icon={MapPin} label="City" value={shipping.city} />

              <InfoItem
                icon={Truck}
                label="Full Address"
                value={shipping.address}
              />
            </div>
          </section>

          {/* Payment Information */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#181a19] p-5 sm:p-6">
            <SectionHeader
              icon={CreditCard}
              title="Payment Information"
              subtitle="Payment method and transaction status"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoItem
                icon={Banknote}
                label="Payment Method"
                value={paymentMethod}
              />

              <InfoItem
                icon={BadgeCheck}
                label="Payment Status"
                value={order.isPaid ? "Paid" : "Pending"}
              />
            </div>

            {order.paidAt && (
              <p className="mt-4 text-xs text-gray-500">
                Paid on {formatDate(order.paidAt)}
              </p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-6">
          {/* Summary */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#181a19] p-5 sm:p-6">
            <SectionHeader
              icon={CreditCard}
              title="Order Summary"
              subtitle="Price breakdown"
            />

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-200">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium text-gray-200">
                  {formatPrice(shippingPrice)}
                </span>
              </div>

              {taxPrice > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-400">Tax</span>
                  <span className="font-medium text-gray-200">
                    {formatPrice(taxPrice)}
                  </span>
                </div>
              )}

              <div className="border-t border-white/[0.08] pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-200">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    order.isPaid
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {order.isPaid ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Clock3 size={20} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-200">
                    {order.isPaid ? "Payment Completed" : "Awaiting Payment"}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {order.isPaid
                      ? "This order has been paid."
                      : "Payment has not been confirmed."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Actions */}
          <section className="rounded-2xl border border-white/[0.08] bg-[#181a19] p-5 sm:p-6">
            <SectionHeader
              icon={Truck}
              title="Order Actions"
              subtitle="Update order status"
            />

            <div className="space-y-3">
              {!order.isPaid ? (
                <button
                  type="button"
                  onClick={() => {
                    payMutation.reset();
                    deliverMutation.reset();
                    payMutation.mutate();
                  }}
                  disabled={payMutation.isPending || deliverMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {payMutation.isPending ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}

                  {payMutation.isPending
                    ? "Updating Payment..."
                    : "Mark as Paid"}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm font-medium text-emerald-400">
                  <CheckCircle2 size={18} />
                  Payment Confirmed
                </div>
              )}

              {!order.isDelivered ? (
                <button
                  type="button"
                  onClick={() => {
                    payMutation.reset();
                    deliverMutation.reset();
                    deliverMutation.mutate();
                  }}
                  disabled={deliverMutation.isPending || payMutation.isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deliverMutation.isPending ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <Truck size={18} />
                  )}

                  {deliverMutation.isPending
                    ? "Updating Delivery..."
                    : "Mark as Delivered"}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/[0.06] px-4 py-3 text-sm font-medium text-blue-400">
                  <CheckCircle2 size={18} />
                  Order Delivered
                </div>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              Make sure the order status is correct before confirming any
              updates.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
