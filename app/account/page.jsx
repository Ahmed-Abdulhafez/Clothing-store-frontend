
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/authService";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  LoaderCircle,
  RefreshCw,
  CircleUserRound,
} from "lucide-react";

export default function AccountPage() {
  const {
    isError,
    error,
    isLoading,
    data,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
    retry: 1,
  });

  // عدّل المسار حسب شكل الـ response الذي يرجع من الـ API
  const user = data?.data?.user ?? data?.data ?? data?.user ?? data;

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      >
        <LoaderCircle className="h-10 w-10 animate-spin text-[#278653]" />
        <p className="text-sm text-gray-500">
          جاري تحميل بيانات حسابك...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        dir="rtl"
        className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <div className="rounded-full bg-red-50 p-4">
          <UserRound className="h-8 w-8 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-[#26382D]">
          تعذر تحميل بيانات الحساب
        </h2>

        <p className="text-sm text-gray-500">
          {error?.response?.data?.message ||
            error?.message ||
            "حدث خطأ أثناء الاتصال بالخادم."}
        </p>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-xl bg-[#278653] px-5 py-3 font-semibold text-white transition hover:bg-[#206d43] disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={isFetching ? "animate-spin" : ""}
          />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const fullName =
    user?.username || user?.name || "مستخدم EVO STORE";

  const email = user?.email || "غير متوفر";
  const phone = user?.phone || "غير مضاف";
  const role = user?.role || "user";

  const initial = fullName.trim().charAt(0).toUpperCase() || "U";

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F7F8F5] px-4 py-8 pt-25  sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div  className="flex w-fit items-center gap-2 rounded-full border border-green-100 bg-white px-4 py-2 text-x1 text-[#278653] shadow-sm">
            <p className=" font-semibold tracking-wider ">
              EVO STORE
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-green-100 bg-white px-4 py-2 text-x1 text-[#278653] shadow-sm">
            <ShieldCheck size={18} />
            <span>Your Account</span>
          </div>
        </div>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-l from-[#26382D] via-[#326A48] to-[#278653]" />

          <div className="px-5 pb-7 sm:px-8">
            <div className="-mt-12 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#E6F1E8] text-3xl font-bold text-[#278653] shadow-sm">
                  {initial}
                </div>

                <div className="pb-0">
                  <h2 className="text-xl font-bold text-[#26382D]">
                    {fullName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {email}
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-lg bg-[#E6F1E8] px-3 py-2 text-xs font-bold text-[#278653]">
                {role === "admin" ? "Admin" : "Customer"}
              </span>
            </div>

            <div className="mb-7 border-t border-gray-100" />

            <h3 className="mb-5 text-lg font-bold text-[#26382D]">
             Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Username */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAFBF9] p-4 transition hover:border-green-200">
                <div className="rounded-xl bg-[#E6F1E8] p-3 text-[#278653]">
                  <CircleUserRound size={22} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-ms text-gray-500">
                  Username
                  </p>
                  <p className="break-words font-semibold text-[#26382D]">
                    {fullName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAFBF9] p-4 transition hover:border-green-200">
                <div className="rounded-xl bg-[#E6F1E8] p-3 text-[#278653]">
                  <Mail size={22} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-ms text-gray-500">
                    Email Address
                  </p>
                  <p className="break-all font-semibold text-[#26382D]">
                    {email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAFBF9] p-4 transition hover:border-green-200">
                <div className="rounded-xl bg-[#E6F1E8] p-3 text-[#278653]">
                  <Phone size={22} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-ms text-gray-500">
                   Phone Number
                  </p>
                  <p className="font-semibold text-[#26382D]" dir="ltr">
                    {phone}
                  </p>
                </div>
              </div>

              {/* Account Role */}
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-[#FAFBF9] p-4 transition hover:border-green-200">
                <div className="rounded-xl bg-[#E6F1E8] p-3 text-[#278653]">
                  <ShieldCheck size={22} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-ms text-gray-500">
                   Account Type
                  </p>
                  <p className="font-semibold text-[#26382D]">
                    {role === "admin" ? "Admin" : "Customer"}
                  </p>
                </div>
              </div>
            </div>


          </div>
        </section>
      </div>
    </main>
  );
}
