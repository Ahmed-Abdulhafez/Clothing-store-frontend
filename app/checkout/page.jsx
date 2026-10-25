
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  MapPin,
  ShoppingBag,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
  Package,
  AlertCircle,
} from "lucide-react";

import { getUserCart } from "@/services/cartService";
import { createCheckoutSession } from "@/services/orderService";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

export default function CheckoutPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const [formError, setFormError] = useState("");

  // جلب سلة المستخدم
  const {
    data: cartResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["carts"],
    queryFn: getUserCart,
  });

  // دعم شكل الاستجابة الحالي: { message, cart }
  const cart =
    cartResponse?.cart ??
    cartResponse?.data?.cart ??
    cartResponse?.data ??
    cartResponse;

  const cartItems = Array.isArray(cart?.cartItems)
    ? cart.cartItems
    : [];

  // حساب الإجمالي من عناصر السلة
  const totalPrice = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const price = Number(
          item.price ?? item.product?.offerPrice ?? item.product?.price
        ) || 0;

        return total + price * (Number(item.quantity) || 0);
      }, 0),
    [cartItems]
  );

  // بدء عملية الدفع باستخدام Stripe
  const checkoutMutation = useMutation({
    mutationFn: (checkoutData) =>
      createCheckoutSession(cart._id, checkoutData),

    onSuccess: (response) => {
      const checkoutUrl =
        response?.url ??
        response?.checkoutUrl ??
        response?.session?.url ??
        response?.data?.url;

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      setFormError(
        "تم إنشاء الطلب، لكن رابط الدفع غير موجود في استجابة الخادم."
      );
    },

    onError: (error) => {
      setFormError(
        error.response?.data?.message ||
          error.message ||
          "تعذر بدء عملية الدفع. حاول مرة أخرى."
      );
    },
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!cart?._id) {
      setFormError("تعذر العثور على سلة التسوق.");
      return;
    }

    if (cartItems.length === 0) {
      setFormError("سلة التسوق فارغة.");
      return;
    }

    const { fullName, phone, city, address } = form;

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !address.trim()
    ) {
      setFormError("من فضلك أكمل جميع بيانات الشحن.");
      return;
    }

    checkoutMutation.mutate({
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
      },
    });
  }

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#F3F7F3]"
      >
        <div className="flex items-center gap-3 text-[#278653]">
          <LoaderCircle size={26} className="animate-spin" />
          <span>جاري تحميل بيانات السلة...</span>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#F3F7F3] px-4 text-center"
      >
        <AlertCircle size={40} className="text-red-500" />
        <h1 className="text-xl font-bold text-[#26382D]">
          تعذر تحميل سلة التسوق
        </h1>
        <p className="text-sm text-gray-500">
          {error?.response?.data?.message ||
            error?.message ||
            "حدث خطأ أثناء تحميل السلة."}
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-[#278653] px-5 py-3 font-semibold text-white"
        >
          إعادة المحاولة
        </button>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F3F7F3] px-4 text-center"
      >
        <ShoppingBag size={52} className="mb-4 text-[#91A398]" />
        <h1 className="text-2xl font-bold text-[#26382D]">
          سلة التسوق فارغة
        </h1>
        <p className="mt-2 text-gray-500">
          أضف بعض المنتجات قبل إتمام عملية الشراء.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-xl bg-[#278653] px-6 py-3 font-semibold text-white transition hover:bg-[#206B42]"
        >
          تصفح المنتجات
        </Link>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F3F7F3] pt-24 text-[#26382D]"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/cart"
            className="mb-5 inline-flex items-center gap-2 text-sm text-[#718075] transition hover:text-[#278653]"
          >
            <ArrowRight size={17} />
            العودة إلى السلة
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#278653]">
                EVO STORE
              </p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                إتمام الشراء
              </h1>
              <p className="mt-2 text-sm text-[#718075]">
                أدخل بياناتك لإتمام طلبك بأمان.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#DCE8DD] bg-white px-4 py-3 text-sm">
              <ShieldCheck size={20} className="text-[#278653]" />
              <span>دفع آمن</span>
            </div>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_390px]"
        >
          {/* Customer information */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#E1E9E1] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5EC] text-[#278653]">
                  <MapPin size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    بيانات الشحن
                  </h2>
                  <p className="mt-1 text-sm text-[#718075]">
                    أدخل عنوان استلام الطلب.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold"
                  >
                    الاسم بالكامل
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="أدخل اسمك بالكامل"
                    className="h-12 w-full rounded-xl border border-[#DCE6DC] bg-[#F8FAF8] px-4 text-sm outline-none transition focus:border-[#278653] focus:ring-2 focus:ring-[#278653]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold"
                  >
                    رقم الهاتف
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                    maxLength={20}
                    placeholder="01xxxxxxxxx"
                    className="h-12 w-full rounded-xl border border-[#DCE6DC] bg-[#F8FAF8] px-4 text-sm outline-none transition focus:border-[#278653] focus:ring-2 focus:ring-[#278653]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-semibold"
                  >
                    المحافظة / المدينة
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    required
                    maxLength={100}
                    placeholder="مثال: الإسماعيلية"
                    className="h-12 w-full rounded-xl border border-[#DCE6DC] bg-[#F8FAF8] px-4 text-sm outline-none transition focus:border-[#278653] focus:ring-2 focus:ring-[#278653]/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold"
                  >
                    العنوان بالتفصيل
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    required
                    maxLength={500}
                    rows={3}
                    placeholder="الشارع، رقم المبنى، المنطقة..."
                    className="w-full resize-y rounded-xl border border-[#DCE6DC] bg-[#F8FAF8] p-4 text-sm outline-none transition focus:border-[#278653] focus:ring-2 focus:ring-[#278653]/10"
                  />
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-[#E1E9E1] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5EC] text-[#278653]">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    طريقة الدفع
                  </h2>
                  <p className="mt-1 text-sm text-[#718075]">
                    الدفع الإلكتروني عبر Stripe.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#278653] bg-[#F4FAF5] p-4">
                <CreditCard size={22} className="text-[#278653]" />
                <div className="flex-1">
                  <p className="text-sm font-bold">
                    بطاقة بنكية
                  </p>
                  <p className="mt-1 text-xs text-[#718075]">
                    ستنتقل إلى صفحة Stripe الآمنة لإتمام الدفع.
                  </p>
                </div>
                <span className="h-4 w-4 rounded-full border-[5px] border-[#278653]" />
              </div>
            </section>

            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <p>{formError}</p>
              </div>
            )}
          </div>

          {/* Order summary */}
          <aside className="rounded-2xl border border-[#E1E9E1] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">ملخص الطلب</h2>
              <span className="rounded-full bg-[#EAF5EC] px-3 py-1 text-xs font-bold text-[#278653]">
                {cartItems.length} منتج
              </span>
            </div>

            <div className="max-h-80 space-y-4 overflow-y-auto">
              {cartItems.map((item, index) => {
                const product = item.product ?? {};
                const image =
                  typeof product.images?.[0] === "string"
                    ? product.images[0]
                    : product.images?.[0]?.url || product.image?.url || product.image;

                const price =
                  Number(item.price ?? product.offerPrice ?? product.price) || 0;

                return (
                  <div
                    key={item._id || product._id || index}
                    className="flex gap-3"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0F5F0]">
                      {image ? (
                        <img
                          src={image}
                          alt={product.title || product.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={25} className="text-[#91A398]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {product.title || product.name || "منتج"}
                      </p>
                      <p className="mt-1 text-xs text-[#718075]">
                        الكمية: {item.quantity}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#278653]">
                        {formatPrice(price * (Number(item.quantity) || 0))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="my-5 border-t border-dashed border-[#DCE6DC]" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[#718075]">عدد المنتجات</span>
                <span className="font-semibold">
                  {cartItems.reduce(
                    (sum, item) => sum + (Number(item.quantity) || 0),
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#718075]">الشحن</span>
                <span className="font-semibold">يحدد عند تأكيد الطلب</span>
              </div>
            </div>

            <div className="my-5 border-t border-[#E1E9E1]" />

            <div className="flex items-center justify-between gap-3">
              <span className="font-bold">إجمالي المنتجات</span>
              <span className="text-xl font-extrabold text-[#278653]">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#718075]">
              المبلغ النهائي وطريقة احتساب الشحن يجب أن يتوافقا مع حسابات
              الخادم عند إنشاء جلسة الدفع.
            </p>

            <button
              type="submit"
              disabled={checkoutMutation.isPending || !cart?._id}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#278653] px-4 text-sm font-bold text-white transition hover:bg-[#206B42] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutMutation.isPending ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  جاري الانتقال للدفع...
                </>
              ) : (
                <>
                  <CreditCard size={19} />
                  تأكيد ومتابعة الدفع
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#718075]">
              <ShieldCheck size={16} className="text-[#278653]" />
              بيانات الدفع تُدخل في صفحة Stripe
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
