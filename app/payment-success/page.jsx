"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  CheckCircle2,
  ShoppingBag,
  Package,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F7F8F5] px-4 py-12 flex items-center justify-center"
    >
      <section className="w-full max-w-xl rounded-3xl border border-[#E5EAE3] bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E8F5EC]">
          <CheckCircle2
            size={56}
            strokeWidth={1.7}
            className="text-[#278653]"
          />
        </div>

        <p className="mb-3 text-sm font-bold tracking-widest text-[#278653]">
          EVO STORE
        </p>

        <h1 className="mb-4 text-2xl font-extrabold text-[#26382D] sm:text-3xl">
          تم الدفع بنجاح!
        </h1>

        <p className="mx-auto mb-8 max-w-md leading-8 text-gray-600">
          شكرًا لثقتك في EVO STORE. تم إتمام عملية الدفع بنجاح،
          ونتمنى أن تستمتع بتجربتك معنا.
        </p>

        <div className="mb-8 rounded-2xl bg-[#F7F8F5] p-5 text-right">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-3">
              <Package className="text-[#278653]" size={24} />
            </div>

            <div>
              <h2 className="mb-1 font-bold text-[#26382D]">
                طلبك في طريقه للتجهيز
              </h2>
              <p className="text-sm leading-6 text-gray-500">
                يمكنك متابعة تفاصيل طلبك من حسابك بعد تأكيد
                تسجيل الطلب في المتجر.
              </p>
            </div>
          </div>
        </div>

        {sessionId && (
          <p className="mb-6 break-all text-xs text-gray-400" dir="ltr">
            Session ID: {sessionId}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#278653] px-5 py-3.5 font-bold text-white transition hover:bg-[#206D43]"
          >
            <ShoppingBag size={19} />
            متابعة التسوق
          </Link>

          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DDE5DD] px-5 py-3.5 font-bold text-[#26382D] transition hover:bg-[#F7F8F5]"
          >
            حسابي
            <ArrowLeft size={19} />
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={16} />
          <span>شكرًا لاختيارك EVO STORE</span>
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F8F5]">
          جاري تحميل الصفحة...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}