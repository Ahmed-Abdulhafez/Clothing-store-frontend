
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AlertCircle,
  FolderOpen,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteCategory,
  getCategories,
} from "@/services/categoriesService";

export default function DashboardCategoriesPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Normalize API response
  const categories = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.categories)) return data.categories;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.categories)) {
      return data.data.categories;
    }

    return [];
  }, [data]);

  // Search categories
  const filteredCategories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return categories;

    return categories.filter((category) =>
      category.name?.toLowerCase().includes(search),
    );
  }, [categories, searchTerm]);

  // Delete category
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,

    onSuccess: async () => {
      setCategoryToDelete(null);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
      ]);
    },

    onError: (error) => {
      console.error(
        "DELETE CATEGORY ERROR:",
        error.response?.data || error,
      );
    },
  });

  function handleDeleteClick(category) {
    deleteMutation.reset();
    setCategoryToDelete(category);
  }

  function handleConfirmDelete() {
    if (!categoryToDelete?._id || deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutate(categoryToDelete._id);
  }

  function handleCloseDeleteDialog() {
    if (deleteMutation.isPending) return;

    setCategoryToDelete(null);
    deleteMutation.reset();
  }

  const deleteErrorMessage =
    deleteMutation.error?.response?.data?.message ||
    deleteMutation.error?.message ||
    "حدث خطأ أثناء حذف التصنيف.";

  return (
    <main className="min-h-screen bg-[#171717] p-4 text-gray-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Page Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-emerald-400">
              <Tag size={19} />

              <span className="text-sm font-medium">
                Store Management
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Categories
            </h1>

            <p className="mt-2 text-sm text-gray-400">
             Manage categories and their images in the store.
            </p>
          </div>

          <Link
            href="/dashboard/categories/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <Plus size={19} />
            Create Category
          </Link>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            icon={FolderOpen}
            label="Total Categories"
            value={categories.length}
            iconClass="bg-emerald-500/10 text-emerald-400"
          />

          <StatCard
            icon={Search}
            label="Search Results"
            value={filteredCategories.length}
            iconClass="bg-sky-500/10 text-sky-400"
          />
        </section>

        {/* Search */}
        <section className="rounded-2xl border border-gray-800 bg-[#1e1e1e] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="ابحث عن تصنيف بالاسم..."
                aria-label="البحث عن تصنيف"
                className="w-full rounded-xl border border-gray-700 bg-[#252525] py-3 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="مسح البحث"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-white"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-400">
              {filteredCategories.length} Categoru
            </p>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-64 items-center justify-center gap-3 text-gray-400">
            <LoaderCircle
              size={24}
              className="animate-spin text-emerald-400"
            />

           Loading categories...
          </div>
        )}

        {/* Fetch Error */}
        {isError && !isLoading && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-[#1e1e1e] p-8 text-center"
          >
            <AlertCircle
              size={34}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-4 font-semibold">
              Try Again
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {error?.response?.data?.message ||
                error?.message ||
                "حدث خطأ أثناء الاتصال بالخادم."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
             Try Again
            </button>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !isError && (
          <>
            {filteredCategories.length === 0 ? (
              <EmptyState
                hasSearch={Boolean(searchTerm.trim())}
                onClearSearch={() => setSearchTerm("")}
              />
            ) : (
              <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    onDelete={() => handleDeleteClick(category)}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {categoryToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDeleteDialog();
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#1e1e1e] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2
                id="delete-dialog-title"
                className="text-lg font-semibold text-gray-100"
              >
               Confirm Deletion
              </h2>

              <button
                type="button"
                onClick={handleCloseDeleteDialog}
                disabled={deleteMutation.isPending}
                aria-label="إغلاق النافذة"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-[#292929] hover:text-white disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <Trash2 size={27} className="text-red-400" />
              </div>

              <p
                id="delete-dialog-description"
                className="mt-4 text-sm leading-6 text-gray-400"
              >
               Are you sure you want to delete this category?
                This action cannot be undone.
              </p>

              <p className="mt-3 break-words font-semibold text-gray-100">
                {categoryToDelete.name}
              </p>

              {deleteMutation.isError && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-right text-sm text-red-300"
                >
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{deleteErrorMessage}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseDeleteDialog}
                disabled={deleteMutation.isPending}
                className="rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292929] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* Statistics Card */
function StatCard({ icon: Icon, label, value, iconClass }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-[#1e1e1e] p-5">
      <div className={`rounded-xl p-3 ${iconClass}`}>
        <Icon size={24} />
      </div>

      <div>
        <p className="text-sm text-gray-400">{label}</p>

        <p className="mt-1 text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

/* Category Card */
function CategoryCard({ category, onDelete }) {
  const imageUrl = category.images?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#1e1e1e] transition duration-200 hover:border-gray-700 hover:bg-[#222222]">
      {/* Image */}
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#252525]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name || "Category"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <ImagePlus size={42} />
            <span className="text-sm">No Image</span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-gray-200 backdrop-blur-sm">
          Category
        </span>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Tag size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              className="truncate font-semibold text-gray-100"
              title={category.name}
            >
              {category.name}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Category Name
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-800 pt-4">
          <Link
            href={`/dashboard/categories/${category._id}/edit`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700 bg-[#252525] px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            <Pencil size={16} />
            Update
          </Link>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

/* Empty State */
function EmptyState({ hasSearch, onClearSearch }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-[#1e1e1e] px-5 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#292929] text-gray-500">
        <FolderOpen size={30} />
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        {hasSearch
          ? "لا توجد نتائج"
          : "لا توجد تصنيفات حتى الآن"}
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        {hasSearch
          ? "جرّب البحث باسم مختلف."
          : "ابدأ بإضافة أول تصنيف لمتجرك."}
      </p>

      {hasSearch ? (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-5 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
        >
         Clear Search
        </button>
      ) : (
        <Link
          href="/dashboard/categories/create"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <Plus size={18} />
          Create Category
        </Link>
      )}
    </div>
  );
}
