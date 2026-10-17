"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCategoryById } from "@/services/productService";

export default function ProductId() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>جاري تحميل المنتج...</div>;
  }

  if (isError) {
    return <div>حدث خطأ: {error.message}</div>;
  }

  return (
    <div>
      <h1>{data?.name}</h1>
    </div>
  );
}