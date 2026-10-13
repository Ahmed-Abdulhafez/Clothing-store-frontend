
"use client";

export default function Error({ error, reset }) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">
                حدث خطأ!
            </h1>

            <p className="text-gray-600">
                {error?.message || "حدث خطأ غير متوقع"}
            </p>

            <button
                onClick={() => reset()}
                className="rounded-lg bg-black px-5 py-2 text-white"
            >
                حاول مرة أخرى
            </button>
        </div>
    );
}
