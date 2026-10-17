"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  GalleryHorizontal,
  ImagePlus,
  LoaderCircle,
  PackagePlus,
  Plus,
  Star,
  Upload,
  X,
} from "lucide-react";

import { createProduct } from "@/services/productService";
import { getCategories } from "@/services/categoriesService";

const INITIAL_FORM = {
  title: "",
  desc: "",
  price: "",
  offerPrice: "",
  brand: "Evo",
  stock: "",
  category: "",
  isFeatured: false,
  showInProductSlider: false,
  rating: "",
  numReviews: "",
  images: [],
};

const inputClass =
  "w-full rounded-lg border border-gray-700 bg-[#252525] px-3.5 py-3 text-sm text-gray-100 outline-none transition placeholder:text-gray-500 hover:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-2 block text-sm font-medium text-gray-300";

function FormField({ label, htmlFor, hint, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>

      {children}

      {hint && <p className="mt-1.5 text-xs leading-5 text-gray-500">{hint}</p>}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>

      <div>
        <h2 className="font-semibold text-gray-100">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default function DashboardCreateProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Support common API response structures.
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : Array.isArray(categoriesResponse?.data)
      ? categoriesResponse.data
      : Array.isArray(categoriesResponse?.categories)
        ? categoriesResponse.categories
        : Array.isArray(categoriesResponse?.data?.categories)
          ? categoriesResponse.data.categories
          : [];
          
  const createProductMutation = useMutation({
    mutationFn: createProduct,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.push("/dashboard/products");
    },

    onError: (error) => {
      console.error(
        "Product creation error:",
        error?.response?.data || error?.message,
      );

      const serverErrors = error?.response?.data?.errors;

      setErrorMessage(
        error?.response?.data?.message ||
          (Array.isArray(serverErrors)
            ? serverErrors.join(", ")
            : typeof serverErrors === "string"
              ? serverErrors
              : "") ||
          "An error occurred while creating the product.",
      );
    },
  });

  const isSubmitting = createProductMutation.isPending;

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  function handleImagesChange(event) {
    const files = Array.from(event.target.files || []);

    setForm((previous) => ({
      ...previous,
      images: files,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  function removeImage(index) {
    setForm((previous) => ({
      ...previous,
      images: previous.images.filter((_, i) => i !== index),
    }));

    // Allow selecting the same file again after removal.
    const input = document.getElementById("images");

    if (input) {
      input.value = "";
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!form.title.trim()) {
      setErrorMessage("Please enter a product title.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setErrorMessage("Please enter a valid product price.");
      return;
    }

    if (
      form.offerPrice !== "" &&
      (!Number.isFinite(Number(form.offerPrice)) || Number(form.offerPrice) < 0)
    ) {
      setErrorMessage("Please enter a valid offer price.");
      return;
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setErrorMessage("Please enter a valid stock quantity.");
      return;
    }

    if (!form.category) {
      setErrorMessage("Please select a product category.");
      return;
    }

    if (form.images.length === 0) {
      setErrorMessage("Please select at least one product image.");
      return;
    }

    if (
      form.rating !== "" &&
      (!Number.isFinite(Number(form.rating)) ||
        Number(form.rating) < 0 ||
        Number(form.rating) > 5)
    ) {
      setErrorMessage("Rating must be between 0 and 5.");
      return;
    }

    if (
      form.numReviews !== "" &&
      (!Number.isInteger(Number(form.numReviews)) ||
        Number(form.numReviews) < 0)
    ) {
      setErrorMessage("Number of reviews must be a non-negative integer.");
      return;
    }

    createProductMutation.mutate({
      ...form,
      title: form.title.trim(),
      price: Number(form.price),
      offerPrice: form.offerPrice === "" ? 0 : Number(form.offerPrice),
      stock: Number(form.stock),
      rating: form.rating === "" ? 0 : Number(form.rating),
      numReviews: form.numReviews === "" ? 0 : Number(form.numReviews),
    });
  }

  return (
    <div className="mx-auto min-w-0 max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-emerald-400">Create</span>
          </div>

          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-100">
            <PackagePlus className="h-7 w-7 text-emerald-400" />
            Create Product
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Add a new product to your Evo store inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292929] hover:text-gray-100 sm:self-center"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>
      </header>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="overflow-hidden rounded-xl border border-gray-700 bg-[#1e1e1e] shadow-sm"
      >
        <div className="space-y-8 p-5 sm:p-7">
          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-900/60 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="flex-1 leading-6">{errorMessage}</div>

              <button
                type="button"
                onClick={() => setErrorMessage("")}
                aria-label="Dismiss error"
                className="rounded p-1 text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Basic Information */}
          <section>
            <SectionHeader
              icon={PackagePlus}
              title="Basic Information"
              description="Enter the product name and describe what makes it special."
            />

            <div className="space-y-5">
              <FormField label="Product Title *" htmlFor="title">
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  maxLength={200}
                  required
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Description"
                htmlFor="desc"
                hint="Provide useful details about the product."
              >
                <textarea
                  id="desc"
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  rows={4}
                  disabled={isSubmitting}
                  className={`${inputClass} min-h-28 resize-y`}
                />
              </FormField>
            </div>
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Pricing */}
          <section>
            <SectionHeader
              icon={PackagePlus}
              title="Pricing & Inventory"
              description="Set your selling price, optional offer, and available quantity."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Price *" htmlFor="price">
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    disabled={isSubmitting}
                    className={`${inputClass} pr-14`}
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    Price
                  </span>
                </div>
              </FormField>

              <FormField
                label="Offer Price"
                htmlFor="offerPrice"
                hint="Leave empty if no discount applies."
              >
                <input
                  id="offerPrice"
                  type="number"
                  name="offerPrice"
                  value={form.offerPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Brand" htmlFor="brand">
                <input
                  id="brand"
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Evo"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Stock Quantity *" htmlFor="stock">
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Category */}
          <section>
            <SectionHeader
              icon={PackagePlus}
              title="Product Category"
              description="Choose the category that best matches this product."
            />

            <FormField label="Category *" htmlFor="category">
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                disabled={isSubmitting || categoriesLoading}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((category) => {
                  const categoryId = category._id || category.id;

                  if (!categoryId) return null;

                  return (
                    <option key={categoryId} value={categoryId}>
                      {category.name || category.title || "Unnamed Category"}
                    </option>
                  );
                })}
              </select>

              {categoriesError && (
                <p className="mt-2 text-sm text-red-400">
                  Failed to load categories. Please refresh and try again.
                </p>
              )}

              {!categoriesLoading &&
                !categoriesError &&
                categories.length === 0 && (
                  <p className="mt-2 text-sm text-amber-400">
                    No categories found. Create a category before adding this
                    product.
                  </p>
                )}
            </FormField>
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Images */}
          <section>
            <SectionHeader
              icon={ImagePlus}
              title="Product Images"
              description="Upload one or more images to display your product."
            />

            <label
              htmlFor="images"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-600 bg-[#252525] px-5 py-8 text-center transition hover:border-emerald-500/70 hover:bg-emerald-500/5"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Upload className="h-6 w-6 text-emerald-400" />
              </div>

              <p className="text-sm font-medium text-gray-200">
                Click to select product images
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Image files only · You can select multiple images
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-[#292929]">
                <Plus size={16} />
                Choose Images
              </span>

              <input
                id="images"
                type="file"
                name="images"
                accept="image/*"
                multiple
                disabled={isSubmitting}
                onChange={handleImagesChange}
                className="sr-only"
              />
            </label>

            {form.images.length > 0 && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-[#252525] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-200">
                    Selected images ({form.images.length})
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setForm((previous) => ({
                        ...previous,
                        images: [],
                      }));

                      const input = document.getElementById("images");
                      if (input) input.value = "";
                    }}
                    disabled={isSubmitting}
                    className="text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
                  >
                    Remove all
                  </button>
                </div>

                <ul className="space-y-2">
                  {form.images.map((file, index) => (
                    <li
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="flex min-w-0 items-center gap-3 rounded-lg border border-gray-700/70 bg-[#1e1e1e] px-3 py-2.5"
                    >
                      <ImagePlus className="h-4 w-4 shrink-0 text-emerald-400" />

                      <span className="min-w-0 flex-1 truncate text-sm text-gray-300">
                        {file.name}
                      </span>

                      <span className="shrink-0 text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={isSubmitting}
                        aria-label={`Remove ${file.name}`}
                        className="shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Product Settings */}
          <section>
            <SectionHeader
              icon={Star}
              title="Additional Settings"
              description="Configure featured status and optional review information."
            />

            {/* Featured Product */}
            <label
              htmlFor="isFeatured"
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-700 bg-[#252525] p-4 transition hover:border-emerald-500/40"
            >
              <input
                id="isFeatured"
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-600 bg-[#1e1e1e] accent-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-200">
                  Featured Product
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Highlight this product in the featured products section.
                </p>
              </div>

              <Star
                size={19}
                className={form.isFeatured ? "text-amber-400" : "text-gray-600"}
              />
            </label>
            {/* Show in Product Slider */}
            <label
              htmlFor="showInProductSlider"
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-700 bg-[#252525] p-4 transition hover:border-emerald-500/40"
            >
              <input
                id="showInProductSlider"
                type="checkbox"
                name="showInProductSlider"
                checked={form.showInProductSlider}
                onChange={handleChange}
                disabled={isSubmitting}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-600 bg-[#1e1e1e] accent-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-200">
                  Show in Product Slider
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Display this product in the product slider on the homepage.
                </p>
              </div>

              <GalleryHorizontal
                size={19}
                className={
                  form.showInProductSlider
                    ? "text-emerald-400"
                    : "text-gray-600"
                }
              />
            </label>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                label="Rating"
                htmlFor="rating"
                hint="Optional value between 0 and 5."
              >
                <input
                  id="rating"
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="0 - 5"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="Number of Reviews"
                htmlFor="numReviews"
                hint="Enter a non-negative whole number."
              >
                <input
                  id="numReviews"
                  type="number"
                  name="numReviews"
                  value={form.numReviews}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="0"
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </FormField>
            </div>
          </section>
        </div>

        {/* Form Actions */}
        <footer className="flex flex-col-reverse gap-3 border-t border-gray-700 bg-[#1b1b1b] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-gray-500">
            Fields marked with * are required.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292929] hover:text-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting || categoriesLoading || categories.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Check size={17} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
