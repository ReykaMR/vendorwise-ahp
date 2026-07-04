import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-muted/30">
      <h1 className="text-6xl font-bold text-teal-800">404</h1>
      <h2 className="text-xl font-semibold text-gray-700">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-sm text-gray-500 max-w-md text-center">
        Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/dashboard"
        className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 transition-colors"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
