"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProductById } from "@/services/productService";

export default function ProductId() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
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
      <h1>{data?.title}</h1>
      <p>{data?.desc}</p>
      <p>{data?.price}</p>
      <p>{data?.stock}</p>
    </div>
  );
}