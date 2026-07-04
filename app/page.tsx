import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  Package,
  Scale,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-teal-50 to-white">
      <header className="border-b border-teal-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white text-sm font-bold">
              V
            </div>
            <span className="text-lg font-semibold text-teal-800">
              VendorWise AHP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-900 leading-tight">
            Sistem Pemilihan Pemasok Bahan Baku
            <br />
            <span className="text-orange-500">Dengan Metode AHP</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            VendorWise AHP membantu Anda memilih pemasok bahan baku terbaik
            menggunakan metode <strong>Analytic Hierarchy Process (AHP)</strong>{" "}
            secara objektif, transparan, dan konsisten.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 text-base"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-teal-200 text-teal-700 hover:bg-teal-50 px-8 text-base"
              >
                Masuk ke Akun
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-teal-800 text-center mb-12">
            Mengapa VendorWise AHP?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-teal-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 mb-2">
                  <Scale className="h-6 w-6" />
                </div>
                <CardTitle className="text-teal-800">
                  Perbandingan Objektif
                </CardTitle>
                <CardDescription>
                  Bandingkan pemasok berdasarkan kriteria yang Anda tentukan
                  menggunakan skala Saaty 1-9 yang terstandarisasi.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-teal-800">Uji Konsistensi</CardTitle>
                <CardDescription>
                  Setiap perbandingan diukur Consistency Ratio (CR) untuk
                  memastikan penilaian Anda konsisten dan dapat diandalkan.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-teal-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 mb-2">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-teal-800">
                  Peringkat Otomatis
                </CardTitle>
                <CardDescription>
                  Dapatkan peringkat pemasok secara otomatis berdasarkan bobot
                  prioritas dan skor akhir hasil perhitungan AHP.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="bg-teal-700 py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-8">
              Bagaimana Cara Kerjanya?
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Package,
                  title: "1. Kelola Data",
                  desc: "Tentukan kriteria dan daftar pemasok",
                },
                {
                  icon: BarChart3,
                  title: "2. Bandingkan",
                  desc: "Isi matriks perbandingan berpasangan",
                },
                {
                  icon: CheckCircle2,
                  title: "3. Hitung AHP",
                  desc: "Sistem menghitung bobot & konsistensi",
                },
                {
                  icon: TrendingUp,
                  title: "4. Dapatkan Hasil",
                  desc: "Lihat peringkat pemasok terbaik",
                },
              ].map((item) => (
                <div key={item.title} className="text-white/90">
                  <div className="flex justify-center mb-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white">
                      <item.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-teal-100">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-teal-800 mb-4">
            Siap Memilih Pemasok Terbaik?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Daftar sekarang dan mulai evaluasi pemasok bahan baku Anda dengan
            metode yang terstruktur dan ilmiah.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 text-base"
            >
              Daftar Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-teal-100 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} VendorWise AHP. Sistem Pemilihan
          Pemasok Bahan Baku dengan Metode Analytic Hierarchy Process.
        </div>
      </footer>
    </div>
  );
}
