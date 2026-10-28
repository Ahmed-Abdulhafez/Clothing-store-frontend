import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <LoaderCircle className="h-10 w-10 animate-spin text-emerald-600" />
      <p className="text-sm font-medium text-gray-500">Loading...</p>
    </div>
  );
}
