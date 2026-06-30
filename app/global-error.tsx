"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/30">
          <h2 className="text-xl font-semibold text-red-600">
            Terjadi Kesalahan
          </h2>
          <p className="text-sm text-gray-500 max-w-md text-center">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
