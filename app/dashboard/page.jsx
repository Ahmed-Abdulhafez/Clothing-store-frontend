"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  MoreHorizontal,
  LoaderCircle,
  RefreshCw,
  AlertCircle,
  Clock3,
  CheckCircle2,
  Truck,
} from "lucide-react";

import { getAllOrders } from "@/services/orderService";

// --- Formatters & Helpers ---
const currencyFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
});

const formatCurrency = (amount = 0) => currencyFormatter.format(Number(amount) || 0);

const formatDate = (date) =>
  new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

function getOrderStatus(order) {
  if (order.isDelivered) {
    return { label: "تم التسليم", className: "bg-green-100 text-green-700" };
  }
  if (order.isPaid) {
    return { label: "تم الدفع", className: "bg-blue-100 text-blue-700" };
  }
  return { label: "بانتظار الدفع", className: "bg-amber-100 text-amber-700" };
}

function getCustomerName(user) {
  if (!user) return "عميل غير معروف";
  return user.username || user.name || user.email || "عميل";
}

function getProductName(product) {
  if (!product) return "منتج محذوف";
  return product.name || product.title || "منتج";
}

// --- Sub-Components for Clean Code ---
function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 break-words text-2xl font-bold text-[#26382D]">{value}</h2>
    </div>
  );
}

// --- Main Page Component ---
export default function DashboardPage() {
  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  // استخراج مصفوفة الطلبات بأمان من مختلف أشكال الـ API Responses
  const orders = useMemo(() => {
    if (Array.isArray(ordersResponse)) return ordersResponse;
    if (Array.isArray(ordersResponse?.data)) return ordersResponse.data;
    if (Array.isArray(ordersResponse?.data?.data)) return ordersResponse.data.data;
    if (Array.isArray(ordersResponse?.orders)) return ordersResponse.orders;
    return [];
  }, [ordersResponse]);

  // حساب الإحصائيات العامة
  const { totalSales, pendingCount, deliveredCount, paidCount, uniqueCustomersCount } = useMemo(() => {
    let sales = 0;
    let pending = 0;
    let delivered = 0;
    let paid = 0;
    const customersSet = new Set();

    orders.forEach((order) => {
      if (order.isPaid) {
        sales += Number(order.totalOrderPrice) || 0;
        paid++;
      } else {
        pending++;
      }

      if (order.isDelivered) delivered++;

      const userId = order.user?._id || order.user;
      if (userId) customersSet.add(String(userId));
    });

    return {
      totalSales: sales,
      pendingCount: pending,
      deliveredCount: delivered,
      paidCount: paid,
      uniqueCustomersCount: customersSet.size,
    };
  }, [orders]);

  // المنتجات الأكثر مبيعاً
  const topProducts = useMemo(() => {
    const productMap = new Map();

    orders.forEach((order) => {
      order.cartItems?.forEach((item) => {
        const product = item.product;
        const productId = typeof product === "object" ? product?._id : product;
        if (!productId) return;

        const key = String(productId);
        const current = productMap.get(key) || {
          id: key,
          name: getProductName(product),
          sales: 0,
          revenue: 0,
        };

        current.sales += Number(item.quantity) || 0;
        current.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
        productMap.set(key, current);
      });
    });

    return [...productMap.values()].sort((a, b) => b.sales - a.sales).slice(0, 5);
  }, [orders]);

  // أحدث الطلبات
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [orders]);

  // حالات التحميل والأخطاء
  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-[#278653]" dir="rtl">
        <LoaderCircle className="h-6 w-6 animate-spin" />
        <span className="font-medium">جاري تحميل بيانات لوحة التحكم...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700" dir="rtl">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="h-5 w-5" />
          تعذر تحميل بيانات الطلبات
        </div>
        <p className="mt-2 text-sm">{error?.message || "حدث خطأ أثناء الاتصال بالخادم."}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wider text-[#278653]">EVO STORE</p>
          <h1 className="mt-1 text-2xl font-bold text-[#26382D]">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-gray-500">مرحباً بك مرة أخرى، إليك ملخص أداء متجرك.</p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          تحديث البيانات
        </button>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="إجمالي المبيعات" value={formatCurrency(totalSales)} icon={DollarSign} iconClass="bg-green-50 text-green-700" />
        <StatCard title="إجمالي الطلبات" value={orders.length.toLocaleString("en-EG")} icon={ShoppingCart} iconClass="bg-blue-50 text-blue-700" />
        <StatCard title="بانتظار الدفع" value={pendingCount.toLocaleString("en-EG")} icon={Clock3} iconClass="bg-amber-50 text-amber-700" />
        <StatCard title="تم تسليمها" value={deliveredCount.toLocaleString("en-EG")} icon={Package} iconClass="bg-purple-50 text-purple-700" />
      </div>

      {/* Main Sections Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Top Products Section */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-1">
          <div>
            <h2 className="text-lg font-bold text-[#26382D]">المنتجات الأكثر مبيعاً</h2>
            <p className="mt-1 text-sm text-gray-500">بناءً على الكميات المطلوبة</p>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">لا توجد بيانات للمنتجات حتى الآن.</div>
          ) : (
            <div className="mt-6 space-y-5">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF4ED] text-sm font-bold text-[#278653]">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">{product.name}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{product.sales.toLocaleString("en-EG")} قطعة</p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[#26382D]">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order Summary Breakdown */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#26382D]">ملخص الطلبات</h2>
              <p className="mt-1 text-sm text-gray-500">توزيع الطلبات والعملاء حسب الحالة</p>
            </div>
            <ShoppingCart className="h-6 w-6 text-[#278653]" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-4">
              <Users className="h-5 w-5 text-blue-700" />
              <p className="mt-3 text-sm font-medium text-blue-700">إجمالي العملاء</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">{uniqueCustomersCount.toLocaleString("en-EG")}</p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
              <p className="mt-3 text-sm font-medium text-green-700">الطلبات المدفوعة</p>
              <p className="mt-1 text-2xl font-bold text-green-900">{paidCount.toLocaleString("en-EG")}</p>
            </div>

            <div className="rounded-xl bg-purple-50 p-4">
              <Truck className="h-5 w-5 text-purple-700" />
              <p className="mt-3 text-sm font-medium text-purple-700">الطلبات المسلّمة</p>
              <p className="mt-1 text-2xl font-bold text-purple-900">{deliveredCount.toLocaleString("en-EG")}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Orders Table Section */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-[#26382D]">أحدث الطلبات</h2>
            <p className="mt-1 text-sm text-gray-500">آخر الطلبات المسجلة في المتجر</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-right">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                <th className="px-5 py-4 font-semibold">رقم الطلب</th>
                <th className="px-5 py-4 font-semibold">العميل</th>
                <th className="px-5 py-4 font-semibold">المنتجات</th>
                <th className="px-5 py-4 font-semibold">الإجمالي</th>
                <th className="px-5 py-4 font-semibold">الحالة</th>
                <th className="px-5 py-4 font-semibold">التاريخ</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    لا توجد طلبات حتى الآن.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const status = getOrderStatus(order);
                  const orderId = String(order._id || order.id || "");
                  const productsText = (order.cartItems || [])
                    .map((item) => getProductName(item.product))
                    .join("، ");

                  return (
                    <tr key={orderId} className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-semibold text-[#278653]">
                        #{orderId ? orderId.slice(-6).toUpperCase() : "------"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700">{getCustomerName(order.user)}</td>
                      <td className="max-w-xs px-5 py-4 text-sm text-gray-600" title={productsText}>
                        <span className="line-clamp-2">{productsText || "لا توجد منتجات"}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-gray-900">
                        {formatCurrency(order.totalOrderPrice)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {order.createdAt ? formatDate(order.createdAt) : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          يتم عرض أحدث {recentOrders.length} طلبات.
        </div>
      </section>
    </div>
  );
}