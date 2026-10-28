"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LoaderCircle,
  Package,
  Search,
  ShoppingCart,
  CheckCircle,
  Truck,
  Eye,
} from "lucide-react";

import {
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "@/services/orderService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-[#1e1e1e] p-5 shadow-sm transition-colors hover:border-gray-600">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-100">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
          <Icon className="h-5 w-5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardOrdersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: getAllOrders,
  });

  const orders = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.orders)) return data.orders;
    if (Array.isArray(data?.data?.orders)) return data.data.orders;
    return [];
  }, [data]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) =>
      [order._id, order.shippingAddress?.fullName, order.shippingAddress?.phone]
        .some((val) => String(val ?? "").toLowerCase().includes(term))
    );
  }, [orders, searchTerm]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0),
    [orders]
  );

  const paidOrdersCount = orders.filter((o) => o.isPaid).length;
  const deliveredOrdersCount = orders.filter((o) => o.isDelivered).length;

  const payMutation = useMutation({
    mutationFn: (id) => updateOrderToPaid(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminOrders"] }),
  });

  const deliverMutation = useMutation({
    mutationFn: (id) => updateOrderToDelivered(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminOrders"] }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-emerald-400" />
          <p className="text-sm text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-900/60 bg-[#1e1e1e] p-6 text-white">
        <h2 className="font-semibold text-red-400">Failed to load orders</h2>
        <p className="mt-2 text-sm text-gray-400">
          {error?.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center pt-5 gap-2 text-emerald-400">
            <ShoppingCart size={19} />
            <span className="text-sm font-medium">Orders Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-100">Orders</h1>
          <p className="mt-1 text-sm text-gray-400">Monitor and manage store orders.</p>
        </div>
      </header>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} />
        <StatCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={Package} />
        <StatCard title="Paid Orders" value={paidOrdersCount} icon={CheckCircle} />
        <StatCard title="Delivered Orders" value={deliveredOrdersCount} icon={Truck} />
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-gray-700 bg-[#1e1e1e] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-700 p-5 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold text-gray-100">All Orders</h2>
          <div className="relative w-full md:max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, or phone..."
              className="w-full rounded-lg border border-gray-700 bg-[#252525] py-2.5 pl-10 pr-4 text-sm text-gray-100 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-700 bg-[#292929] text-left text-xs uppercase tracking-wide text-gray-300">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Delivery</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/70 text-sm text-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#292929]">
                    <td className="px-5 py-4 font-mono text-xs">{order._id}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{order.shippingAddress?.fullName || order.user?.username || "Guest"}</p>
                      <p className="text-xs text-gray-400">{order.shippingAddress?.phone || order.user?.email || "—"}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-400">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${order.isPaid ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${order.isDelivered ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/orders/${order._id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
