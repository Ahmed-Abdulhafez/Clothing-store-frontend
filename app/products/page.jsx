
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/productService";

export default function GetAllProducts() {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <p className="p-6">جاري تحميل المنتجات...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        حدث خطأ أثناء تحميل المنتجات: {error.message}
      </p>
    );
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">
        جميع المنتجات
      </h1>

      {!products || products.length === 0 ? (
        <p>لا توجد منتجات حاليًا.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product._id}
              className="rounded-xl border p-4 shadow-sm"
            >
              <h2 className="font-semibold">
                {product.title}
              </h2>

              <p className="mt-2 text-gray-600">
                {product.price} جنيه
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
