"use client";

import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "إجمالي المبيعات",
      value: "$24,560",
      change: "+12.5%",
      positive: true,
      icon: DollarSign,
    },
    {
      title: "إجمالي الطلبات",
      value: "1,248",
      change: "+8.2%",
      positive: true,
      icon: ShoppingCart,
    },
    {
      title: "المنتجات",
      value: "356",
      change: "+4.6%",
      positive: true,
      icon: Package,
    },
    {
      title: "المستخدمين",
      value: "8,642",
      change: "-2.4%",
      positive: false,
      icon: Users,
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-1001",
      customer: "Ahmed Mohamed",
      product: "Premium T-Shirt",
      amount: "$120",
      status: "Completed",
    },
    {
      id: "#ORD-1002",
      customer: "Mohamed Ali",
      product: "Classic Shoes",
      amount: "$85",
      status: "Pending",
    },
    {
      id: "#ORD-1003",
      customer: "Omar Hassan",
      product: "Leather Bag",
      amount: "$150",
      status: "Completed",
    },
    {
      id: "#ORD-1004",
      customer: "Youssef Ahmed",
      product: "Smart Watch",
      amount: "$220",
      status: "Cancelled",
    },
    {
      id: "#ORD-1005",
      customer: "Mahmoud Samir",
      product: "Denim Jacket",
      amount: "$95",
      status: "Completed",
    },
  ];

  const topProducts = [
    {
      name: "Premium T-Shirt",
      sales: 245,
      revenue: "$4,900",
    },
    {
      name: "Classic Shoes",
      sales: 186,
      revenue: "$3,720",
    },
    {
      name: "Leather Bag",
      sales: 154,
      revenue: "$3,080",
    },
    {
      name: "Smart Watch",
      sales: 132,
      revenue: "$2,640",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>

          <h1 className="text-lg text-gray-300">
            مرحباً بك مرة أخرى، إليك ملخص متجرك اليوم.
          </h1>
        </div>

        <div className="text-sm text-gray-300">
          آخر تحديث: اليوم، 10:30 PM
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>

                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.positive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}

                  {stat.change}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">{stat.title}</p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Sales Overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                ملخص المبيعات خلال آخر 7 أيام
              </p>
            </div>

            <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          {/* Fake Chart */}
          <div className="mt-8 flex h-64 items-end gap-3 border-b border-l border-gray-100 px-4">
            {[45, 65, 52, 78, 60, 88, 72, 95, 80, 100, 85, 92].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-md bg-gray-900 transition-all group-hover:bg-gray-700"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ),
            )}
          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Top Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                المنتجات الأكثر مبيعاً
              </p>
            </div>

            <button className="rounded-lg p-2 hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-900">
                  {product.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              أحدث الطلبات التي تمت على المتجر
            </p>
          </div>

          <button className="text-sm font-medium text-gray-900 hover:underline">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.product}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {order.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}