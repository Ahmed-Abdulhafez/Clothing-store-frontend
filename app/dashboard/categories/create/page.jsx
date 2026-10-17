
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Save,
  Tag,
  Upload,
  X,
} from "lucide-react";

import { createCategory } from "@/services/categoriesService";

export default function DashboardCreateCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: createCategory,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      router.push("/dashboard/categories");
    },

    onError: (error) => {
      console.error(
        "CREATE CATEGORY ERROR:",
        error.response?.data || error,
      );

      setErrorMessage(
        error.response?.data?.message ||
          "حدث خطأ أثناء إنشاء التصنيف. حاول مرة أخرى.",
      );
    },
  });

  // Create and clean up the image preview URL
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  function handleImageChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("من فضلك اختر ملف صورة صالحًا.");
      event.target.value = "";
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxFileSize) {
      setErrorMessage("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");
      event.target.value = "";
      return;
    }

    setImage(selectedFile);
    setErrorMessage("");
  }

  function handleRemoveImage() {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("اسم التصنيف مطلوب.");
      return;
    }

    if (!image) {
      setErrorMessage("من فضلك اختر صورة للتصنيف.");
      return;
    }

    createMutation.mutate({
      name: trimmedName,
      image,
    });
  }

  const isPending = createMutation.isPending;

  return (
    <main className="min-h-screen bg-[#171717] p-4 text-gray-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-7">

        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-emerald-400">
              <Tag size={19} />
              <span className="text-sm font-medium">
                Store Management
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              إنشاء تصنيف جديد
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              أضف اسم التصنيف وصورته إلى متجرك.
            </p>
          </div>

          <Link
            href="/dashboard/categories"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-[#1e1e1e] px-4 py-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-[#252525] hover:text-white"
          >
            <ArrowLeft size={18} />
            العودة للتصنيفات
          </Link>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-800 bg-[#1e1e1e]"
        >
          {/* Form Header */}
          <div className="border-b border-gray-800 px-5 py-5 sm:px-7">
            <h2 className="font-semibold text-gray-100">
              بيانات التصنيف
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              أدخل البيانات المطلوبة ثم احفظ التصنيف.
            </p>
          </div>

          <div className="space-y-7 p-5 sm:p-7">

            {/* Category Name */}
            <div className="space-y-2">
              <label
                htmlFor="category-name"
                className="block text-sm font-medium text-gray-300"
              >
                اسم التصنيف
                <span className="mr-1 text-red-400">*</span>
              </label>

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="مثال: زيوت الشعر"
                maxLength={100}
                required
                disabled={isPending}
                className="w-full rounded-xl border border-gray-700 bg-[#252525] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60"
              />

              <p className="text-xs text-gray-500">
                اختر اسمًا واضحًا يسهل على العملاء فهمه.
              </p>
            </div>

            {/* Category Image */}
            <div className="space-y-3">
              <label
                htmlFor="category-image"
                className="block text-sm font-medium text-gray-300"
              >
                صورة التصنيف
                <span className="mr-1 text-red-400">*</span>
              </label>

              <input
                ref={fileInputRef}
                id="category-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isPending}
                required={!image}
                className="sr-only"
              />

              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-gray-700 bg-[#252525]">
                  <img
                    src={preview}
                    alt="معاينة صورة التصنيف"
                    className="h-64 w-full object-contain sm:h-80"
                  />

                  {!isPending && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="إزالة الصورة"
                      className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white transition hover:bg-red-600"
                    >
                      <X size={16} />
                      إزالة الصورة
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-700 bg-[#252525] p-6 text-center transition hover:border-emerald-500/60 hover:bg-emerald-500/5 disabled:opacity-60"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <ImagePlus size={32} />
                  </div>

                  <span className="font-semibold text-gray-200">
                    اختر صورة التصنيف
                  </span>

                  <span className="mt-2 text-sm text-gray-500">
                    اضغط لاختيار صورة من جهازك
                  </span>

                  <span className="mt-3 text-xs text-gray-500">
                    PNG, JPG, WEBP — حتى 5 ميجابايت
                  </span>
                </button>
              )}

              {image && (
                <div className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-[#252525] p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                      <Upload size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-200">
                        {image.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {(image.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {!isPending && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
                    >
                      تغيير الصورة
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
              >
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p>{errorMessage}</p>
              </div>
            )}

            {/* Success Feedback */}
            {createMutation.isSuccess && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                <CheckCircle2 size={19} />
                تم إنشاء التصنيف بنجاح.
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-800 bg-[#1b1b1b] px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
            <Link
              href="/dashboard/categories"
              className="inline-flex items-center justify-center rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-[#292929]"
            >
              إلغاء
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  جاري إنشاء التصنيف...
                </>
              ) : (
                <>
                  <Save size={18} />
                  إنشاء التصنيف
                </>
              )}
            </button>
          </div>
        </form>

        {/* Hint */}
        <p className="text-center text-xs leading-6 text-gray-500">
          تأكد من صحة اسم التصنيف والصورة قبل الحفظ.
        </p>
      </div>
    </main>
  );
}
