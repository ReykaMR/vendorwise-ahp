"use client";

import { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Package,
  ListTree,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: ListTree,
    title: "Kelola Kriteria",
    description:
      "Tentukan kriteria yang akan digunakan untuk menilai pemasok, seperti Harga, Kualitas, atau Ketepatan Waktu. Kriteria dapat memiliki subkriteria.",
  },
  {
    icon: Package,
    title: "Kelola Pemasok",
    description:
      "Daftarkan pemasok bahan baku yang akan dievaluasi beserta informasi kontaknya.",
  },
  {
    icon: BarChart3,
    title: "Perbandingan Berpasangan",
    description:
      "Bandingkan kepentingan antar kriteria dan antar pemasok menggunakan skala Saaty 1–9. Sistem akan menghitung bobot prioritas secara otomatis.",
  },
  {
    icon: ArrowRight,
    title: "Lihat Hasil & Peringkat",
    description:
      "Dapatkan peringkat pemasok terbaik berdasarkan perhitungan AHP yang konsisten dan objektif. Hasil dapat diexport ke PDF atau Excel.",
  },
];

export function OnboardingGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("vendorwise-onboarding");
    if (!seen) {
      const id = setTimeout(() => setOpen(true), 0);
      return () => clearTimeout(id);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("vendorwise-onboarding", "true");
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem("vendorwise-onboarding", "true");
    setOpen(false);
  };

  if (!open) return null;

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
            <Icon className="h-6 w-6" />
          </div>
          <button
            onClick={handleSkip}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-teal-600">
            Langkah {step + 1} dari {STEPS.length}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-teal-900">
            {currentStep.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {currentStep.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full ${
                  i === step ? "bg-teal-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
                className="border-teal-200 text-teal-700"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Sebelumnya
              </Button>
            )}
            {isLast ? (
              <Button
                size="sm"
                onClick={handleComplete}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Mulai
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setStep(step + 1)}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Selanjutnya
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={handleSkip}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Lewati panduan
          </button>
        </div>
      </div>
    </div>
  );
}
