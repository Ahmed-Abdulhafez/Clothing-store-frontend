"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Save,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { getCategoryById, updateCategory } from "@/services/categoriesService";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch the current category.
  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
  });

  // Fill the form with the current category data.
  useEffect(() => {
    if (!category) return;

    setName(category.name ?? "");
    setPreview(category.images?.[0]?.url ?? "");
  }, [category]);

  // Generate and clean up the selected image preview URL.
  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const updateMutation = useMutation({
    mutationFn: (updatedCategory) => updateCategory(id, updatedCategory),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["category", id],
        }),
      ]);

      router.push("/dashboard/categories");
    },

    onError: (error) => {
      console.error("UPDATE CATEGORY ERROR:", error.response?.data || error);

      setErrorMessage(
        error.response?.data?.message || "حدث خطأ أثناء تحديث التصنيف.",
      );
    },
  });

  const isPending = updateMutation.isPending;

  function handleImageChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrorMessage("من فضلك اختر ملف صورة صالحًا.");
      event.target.value = "";
      return;
    }

    setImage(selectedFile);
    setErrorMessage("");
  }

  function handleRemoveNewImage() {
    setImage(null);
    setPreview(category?.images?.[0]?.url ?? "");

    const input = document.getElementById("category-image");

    if (input) input.value = "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage("اسم التصنيف مطلوب.");
      return;
    }

    updateMutation.mutate({
      name: trimmedName,
      image,
    });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-300">
        <LoaderCircle className="mr-3 h-6 w-6 animate-spin text-emerald-400" />
        جاري تحميل بيانات التصنيف...
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-red-500/20 bg-[#1e1e1e] p-6 text-center">
        <p className="text-red-400">
          {error?.response?.data?.message || "تعذر تحميل بيانات التصنيف."}
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-5 rounded-lg bg-gray-700 px-4 py-2 text-sm text-white transition hover:bg-gray-600"
        >
          العودة
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#171717] p-4 text-gray-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Page Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="العودة"
            className="rounded-xl border border-gray-700 bg-[#252525] p-3 text-gray-300 transition hover:bg-[#303030] hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">تعديل التصنيف</h1>

            <p className="mt-2 text-sm text-gray-400">
              عدّل اسم التصنيف أو استبدل صورته.
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-800 bg-[#1e1e1e] p-5 shadow-xl sm:p-8"
        >
          {/* Category Name */}
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              اسم التصنيف
            </label>

            <div className="relative">
              <Tag
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="اكتب اسم التصنيف"
                required
                disabled={isPending}
                className="w-full rounded-xl border border-gray-700 bg-[#252525] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Category Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              صورة التصنيف
            </label>

            <div className="rounded-xl border border-dashed border-gray-700 bg-[#252525] p-4 sm:p-6">
              {preview ? (
                <div className="relative mx-auto max-w-sm overflow-hidden rounded-xl border border-gray-700 bg-[#1b1b1b]">
                  <img
                    src={preview}
                    alt={`صورة التصنيف ${name}`}
                    className="h-64 w-full object-contain"
                  />

                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveNewImage}
                      disabled={isPending}
                      aria-label="إلغاء الصورة الجديدة"
                      className="absolute right-3 top-3 rounded-lg bg-black/70 p-2 text-white transition hover:bg-red-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-gray-500">
                  <ImagePlus size={42} strokeWidth={1.5} />

                  <p className="mt-3 text-sm">لا توجد صورة لهذا التصنيف</p>
                </div>
              )}

              <div className="mt-5 flex justify-center">
                <label
                  htmlFor="category-image"
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-emerald-500 hover:bg-emerald-500/5 ${
                    isPending ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <Upload size={17} />

                  {image ? "اختيار صورة أخرى" : "استبدال الصورة"}
                </label>

                <input
                  id="category-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isPending}
                  className="hidden"
                />
              </div>

              <p className="mt-3 text-center text-xs text-gray-500">
                اترك الصورة كما هي إذا كنت لا تريد تغييرها.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-800 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isPending}
              className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-[#303030] disabled:opacity-50"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save size={18} />
                  حفظ التعديلات
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
