"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/authService";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  RefreshCw,
  CircleUserRound,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/Loading";

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

  const user = data?.data?.user ?? data?.data ?? data?.user ?? data;

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-red-50 p-4">
          <UserRound className="h-8 w-8 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-800">
          Failed to load account data
        </h2>

        <p className="text-sm text-gray-500">
          {error?.response?.data?.message ||
            error?.message ||
            "An error occurred while connecting to the server."}
        </p>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={isFetching ? "animate-spin" : ""}
          />
          Try Again
        </button>
      </div>
    );
  }

  const fullName = user?.username || user?.name || "EVO STORE User";
  const email = user?.email || "Not available";
  const phone = user?.phone || "Not added";
  const role = user?.role || "user";

  const initial = fullName.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 pt-25 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <p className="font-semibold tracking-wider">EVO STORE</p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <ShieldCheck size={18} />
            <span>Your Account</span>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500" />

          <div className="px-5 pb-7 sm:px-8">
            <div className="-mt-12 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-sm">
                  {initial}
                </div>

                <div className="pb-0">
                  <h2 className="text-xl font-bold text-gray-900">
                    {fullName}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/orders"
                  className="flex items-center gap-2 rounded-lg bg-white border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  <ShoppingBag size={18} />
                  My Orders
                </Link>
                <span className="w-fit rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700">
                  {role === "admin" ? "Admin" : "Customer"}
                </span>
              </div>
            </div>

            <div className="mb-7 border-t border-gray-100" />

            <h3 className="mb-5 text-lg font-bold text-gray-900">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-emerald-200">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <CircleUserRound size={22} />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-gray-500">Username</p>
                  <p className="break-words font-semibold text-gray-900">{fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-emerald-200">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <Mail size={22} />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-gray-500">Email Address</p>
                  <p className="break-all font-semibold text-gray-900">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-emerald-200">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <Phone size={22} />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-gray-500">Phone Number</p>
                  <p className="font-semibold text-gray-900">{phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-emerald-200">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <ShieldCheck size={22} />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-gray-500">Account Type</p>
                  <p className="font-semibold text-gray-900">
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
