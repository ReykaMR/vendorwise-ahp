export function AppFooter() {
  return (
    <footer className="border-t border-teal-100 bg-white py-5 text-center text-sm text-gray-600">
      <div className="container mx-auto px-5">
        <p>
          © {new Date().getFullYear()} VendorWise AHP. Sistem Pendukung
          Keputusan Pemilihan Pemasok.
        </p>
      </div>
    </footer>
  );
}
