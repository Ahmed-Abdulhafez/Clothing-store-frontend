"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, LoaderCircle } from "lucide-react";

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role?.toLowerCase() !== "admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1e1e1e] px-4 text-gray-100">
        {/* Background Glow */}
        <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

        {/* Loading Card */}
        <div className="relative flex w-full max-w-sm flex-col items-center rounded-2xl border border-gray-700/70 bg-[#252525]/90 px-8 py-10 text-center shadow-2xl backdrop-blur-xl">
          {/* Icon */}
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <ShieldCheck
              size={38}
              strokeWidth={1.5}
              className="text-emerald-400"
            />

            <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#252525] bg-emerald-500">
              <LoaderCircle
                size={16}
                className="animate-spin text-white"
              />
            </span>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-xl font-semibold tracking-wide text-gray-100">
            جاري التحقق من الصلاحيات
          </h2>

          <p className="mb-7 text-sm leading-6 text-gray-400">
            برجاء الانتظار، نتحقق من هويتك وصلاحية الوصول إلى لوحة التحكم.
          </p>

          {/* Progress Indicator */}
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
            <div className="h-full w-1/3 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-emerald-400" />
          </div>

          <span className="text-xs font-medium tracking-widest text-emerald-400">
            SECURE ACCESS
          </span>
        </div>

        <style jsx>{`
          @keyframes loading {
            0% {
              transform: translateX(-120%);
            }
            100% {
              transform: translateX(350%);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!user || user.role?.toLowerCase() !== "admin") {
    return null;
  }

  return children;
}