"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AlertCircle,
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Package,
  Plus,
  Save,
  Star,
  Upload,
  X,
} from "lucide-react";

import {
  getProductById,
  updateProductService,
} from "@/services/productService";

import { getCategories } from "@/services/categoriesService";

// ---------------------------------------------
// Constants
// ---------------------------------------------

const INITIAL_FORM = {
  title: "",
  desc: "",
  price: "",
  stock: "",
  brand: "Evo",
  category: "",
  isFeatured: false,
};

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-700 bg-[#252525] px-3.5 py-3 text-sm text-gray-100 outline-none transition placeholder:text-gray-500 hover:border-gray-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const LABEL_CLASS = "mb-2 block text-sm font-medium text-gray-300";

// ---------------------------------------------
// Reusable Components
// ---------------------------------------------

function FormField({ label, htmlFor, hint, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className={LABEL_CLASS}>
        {label}
      </label>

      {children}

      {hint && <p className="mt-1.5 text-xs leading-5 text-gray-500">{hint}</p>}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>

      <div>
        <h2 className="font-semibold text-gray-100">{title}</h2>

        <p className="mt-1 text-sm leading-5 text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

function ImageCard({ src, alt, onRemove, disabled }) {
  return (
    <div className="group relative w-fit rounded-xl border border-gray-700 bg-[#252525] p-2 transition hover:border-emerald-500/50">
      <img
        src={src}
        alt={alt}
        className="h-24 w-24 rounded-lg object-cover sm:h-28 sm:w-28"
      />

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${alt}`}
        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-gray-800 bg-red-600 text-white shadow transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X size={15} />
      </button>
    </div>
  );
}

// ---------------------------------------------
// Edit Product Page
// ---------------------------------------------

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // ---------------------------------------------
  // Image previews and cleanup
  // ---------------------------------------------

  useEffect(() => {
    const previews = newImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImagePreviews(previews);

    return () => {
      previews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  // ---------------------------------------------
  // Fetch product
  // ---------------------------------------------

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
    error: productErrorDetails,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const result = await getProductById(id);

      return result?.data?.data ?? result?.data ?? result;
    },
    enabled: Boolean(id),
  });

  // ---------------------------------------------
  // Fetch categories
  // ---------------------------------------------

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategories();
      const payload = result?.data?.data ?? result?.data ?? result;

      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.categories)) {
        return payload.categories;
      }

      return [];
    },
  });

  // ---------------------------------------------
  // Populate form
  // ---------------------------------------------

  useEffect(() => {
    if (!product) return;

    const currentCategory =
      typeof product.category === "object"
        ? (product.category?._id ?? "")
        : (product.category ?? "");

    setForm({
      title: product.title ?? "",
      desc: product.desc ?? "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      brand: product.brand ?? "Evo",
      category: String(currentCategory),
      isFeatured: product.isFeatured ?? false,
    });

    setExistingImages(Array.isArray(product.images) ? product.images : []);
  }, [product]);

  // ---------------------------------------------
  // Update mutation
  // ---------------------------------------------

  const updateProductMutation = useMutation({
    mutationFn: (formData) => updateProductService(id, formData),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["product", id],
        }),
      ]);

      router.push("/dashboard/products");
    },

    onError: (error) => {
      console.error("UPDATE PRODUCT ERROR:", error?.response?.data || error);

      setFormError(
        error?.response?.data?.message ||
          "An error occurred while updating the product.",
      );
    },
  });

  const pending = updateProductMutation.isPending;

  // ---------------------------------------------
  // Handle form changes
  // ---------------------------------------------

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
  }

  // ---------------------------------------------
  // Handle image selection
  // ---------------------------------------------

  function handleImageChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    // Allow selecting the same file again.
    event.target.value = "";

    setFormError("");

    const validFiles = [];
    const errors = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: The file is not an image.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: Maximum image size is 5 MB.`);
        continue;
      }

      validFiles.push(file);
    }

    const remainingSlots =
      MAX_IMAGES - existingImages.length - newImages.length;

    if (remainingSlots <= 0) {
      setFormError(`The maximum number of images is ${MAX_IMAGES}.`);
      return;
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      errors.push(`You can add only ${remainingSlots} more image(s).`);
    }

    setNewImages((previous) => [...previous, ...filesToAdd]);

    if (errors.length > 0) {
      setFormError(errors.join(" "));
    }
  }

  // ---------------------------------------------
  // Remove images
  // ---------------------------------------------

  function removeExistingImage(imageToRemove) {
    setExistingImages((previous) =>
      previous.filter((image) => image !== imageToRemove),
    );
  }

  function removeNewImage(indexToRemove) {
    setNewImages((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
  }

  // ---------------------------------------------
  // Submit form
  // ---------------------------------------------

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (
      !form.title.trim() ||
      !form.desc.trim() ||
      form.price === "" ||
      form.stock === "" ||
      !form.category
    ) {
      setFormError(
        "Please enter the product title, description, price, stock, and category.",
      );
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(stock) ||
      price < 0 ||
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      setFormError(
        "Price and stock must be non-negative, and stock must be a whole number.",
      );
      return;
    }

    if (existingImages.length + newImages.length > MAX_IMAGES) {
      setFormError(`The maximum number of images is ${MAX_IMAGES}.`);
      return;
    }

    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("desc", form.desc.trim());
    formData.append("price", String(price));
    formData.append("stock", String(stock));
    formData.append("brand", form.brand);
    formData.append("category", form.category);
    formData.append("isFeatured", String(form.isFeatured));

    // Existing images that should remain.
    formData.append(
      "existingImages",
      JSON.stringify(
        existingImages.map((image) => image.public_id).filter(Boolean),
      ),
    );

    // Upload only newly selected images.
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    updateProductMutation.mutate(formData);
  }

  // ---------------------------------------------
  // Loading state
  // ---------------------------------------------

  if (productLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-[#171717] p-6">
        <div className="flex items-center gap-3 text-gray-300">
          <LoaderCircle className="h-5 w-5 animate-spin text-emerald-400" />
          <span>Loading product details...</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // Product loading error
  // ---------------------------------------------

  if (productError) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-500/10 p-5 text-red-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <h2 className="font-semibold">Failed to load product</h2>

            <p className="mt-2 text-sm leading-6">
              {productErrorDetails?.response?.data?.message ||
                productErrorDetails?.message ||
                "An unexpected error occurred."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/dashboard/products")}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-[#292929]"
            >
              <ArrowLeft size={16} />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="rounded-xl border border-gray-700 bg-[#1e1e1e] p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-gray-500" />

          <h2 className="mt-4 font-semibold text-gray-100">
            Product not found
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            The product may have been removed or the ID is invalid.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------
  // Page UI
  // ---------------------------------------------

  return (
    <div className="mx-auto min-w-0 max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-emerald-400">Edit</span>
          </div>

          <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-100">
            <Package className="h-7 w-7 text-emerald-400" />
            Edit Product
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Update your product details, pricing, inventory, and images.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292929] hover:text-gray-100 disabled:opacity-50 sm:self-center"
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
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-900/60 bg-red-500/10 p-4 text-sm text-red-300"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="flex-1 leading-6">{formError}</div>

              <button
                type="button"
                onClick={() => setFormError("")}
                aria-label="Dismiss error"
                className="rounded p-1 transition hover:bg-red-500/10 hover:text-red-200"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Basic Information */}
          <section>
            <SectionHeader
              icon={Package}
              title="Basic Information"
              description="Update the product name and description."
            />

            <div className="space-y-5">
              <FormField label="Product Title *" htmlFor="title">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={200}
                  required
                  disabled={pending}
                  placeholder="Enter product title"
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField
                label="Description *"
                htmlFor="desc"
                hint="Provide useful details about this product."
              >
                <textarea
                  id="desc"
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  rows={4}
                  required
                  disabled={pending}
                  placeholder="Enter product description..."
                  className={`${INPUT_CLASS} min-h-28 resize-y`}
                />
              </FormField>
            </div>
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Pricing and Inventory */}
          <section>
            <SectionHeader
              icon={Package}
              title="Pricing & Inventory"
              description="Manage your selling price, brand, and stock quantity."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Price *" htmlFor="price">
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  disabled={pending}
                  placeholder="0.00"
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label="Stock Quantity *" htmlFor="stock">
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  disabled={pending}
                  placeholder="0"
                  className={INPUT_CLASS}
                />
              </FormField>

              <FormField label="Brand" htmlFor="brand">
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  value={form.brand}
                  onChange={handleChange}
                  disabled={pending}
                  placeholder="Evo"
                  className={INPUT_CLASS}
                />
              </FormField>
            </div>
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Category */}
          <section>
            <SectionHeader
              icon={Package}
              title="Product Category"
              description="Choose the category that matches this product."
            />

            <FormField label="Category *" htmlFor="category">
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                disabled={pending || categoriesLoading || categoriesError}
                className={`${INPUT_CLASS} cursor-pointer`}
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
                    No categories found.
                  </p>
                )}
            </FormField>
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Existing Images */}
          <section>
            <SectionHeader
              icon={ImagePlus}
              title="Current Images"
              description="These images are currently associated with this product. Remove any image you no longer need."
            />

            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-400">
                {existingImages.length} existing image(s)
              </span>

              <span className="text-xs text-gray-500">
                {existingImages.length + newImages.length}/{MAX_IMAGES} images
              </span>
            </div>

            {existingImages.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {existingImages.map((image, index) => (
                  <ImageCard
                    key={image.public_id || image.url || index}
                    src={image.url}
                    alt={`Current image ${index + 1}`}
                    disabled={pending}
                    onRemove={() => removeExistingImage(image)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-700 bg-[#252525] px-4 py-8 text-center">
                <ImagePlus className="mx-auto h-8 w-8 text-gray-500" />

                <p className="mt-3 text-sm text-gray-400">
                  No current images. You can upload new images below.
                </p>
              </div>
            )}
          </section>

          <div className="border-t border-gray-700/80" />

          {/* New Images */}
          <section>
            <SectionHeader
              icon={Upload}
              title="Add New Images"
              description="Upload additional images without replacing the images you want to keep."
            />

            <label
              htmlFor="product-images"
              className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-600 bg-[#252525] px-5 py-8 text-center transition ${
                existingImages.length + newImages.length >= MAX_IMAGES
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-emerald-500/70 hover:bg-emerald-500/5"
              }`}
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Upload className="h-6 w-6 text-emerald-400" />
              </div>

              <p className="text-sm font-medium text-gray-200">
                Click to select product images
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                JPG, PNG, or WebP · Maximum 5 MB per image
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-[#292929]">
                <Plus size={16} />
                Choose Images
              </span>

              <input
                id="product-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                disabled={
                  pending ||
                  existingImages.length + newImages.length >= MAX_IMAGES
                }
                className="sr-only"
              />
            </label>

            {imagePreviews.length > 0 && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-[#252525] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-200">
                    New Images ({newImages.length})
                  </p>

                  <button
                    type="button"
                    onClick={() => setNewImages([])}
                    disabled={pending}
                    className="text-xs text-red-400 transition hover:text-red-300 disabled:opacity-50"
                  >
                    Remove all
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map(({ file, url }, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="relative w-fit rounded-xl border border-gray-700 bg-[#1e1e1e] p-2"
                    >
                      <img
                        src={url}
                        alt={`New image ${index + 1}`}
                        className="h-24 w-24 rounded-lg object-cover sm:h-28 sm:w-28"
                      />

                      <div className="mt-2 max-w-28">
                        <p className="truncate text-xs text-gray-300">
                          {file.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        disabled={pending}
                        aria-label={`Remove new image ${index + 1}`}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-gray-800 bg-red-600 text-white shadow transition hover:bg-red-500 disabled:opacity-50"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="border-t border-gray-700/80" />

          {/* Product Settings */}
          <section>
            <SectionHeader
              icon={Star}
              title="Additional Settings"
              description="Configure whether this product should be featured in your store."
            />

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
                disabled={pending}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-600 bg-[#1e1e1e] accent-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-200">
                  Featured Product
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Highlight this product in your store.
                </p>
              </div>

              <Star
                size={19}
                className={form.isFeatured ? "text-amber-400" : "text-gray-600"}
              />
            </label>
          </section>
        </div>

        {/* Form Actions */}
        <footer className="flex flex-col gap-4 border-t border-gray-700 bg-[#1b1b1b] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-gray-500">
            Fields marked with * are required.
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-[#292929] hover:text-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={pending || categoriesLoading || categoriesError}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
