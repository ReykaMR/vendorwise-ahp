"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, User, Mail, Info, Globe } from "lucide-react";

type SettingsFormProps = {
  user: { name: string; email: string; role?: string };
};

export function SettingsForm({ user }: SettingsFormProps) {
  return (
    <div className="space-y-4">
      <Card className="border-teal-100">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-teal-800 text-lg">
              Informasi Akun
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Data akun Anda saat ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm pt-0">
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Nama
            </span>
            <span className="font-medium text-gray-800">{user.name}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email
            </span>
            <span className="font-medium text-gray-800">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Peran
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                user.role === "ADMIN"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-teal-100 text-teal-700"
              }`}
            >
              {user.role === "ADMIN" ? "Administrator" : "Pengguna"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-100">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-teal-800 text-lg">Preferensi</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Pengaturan tampilan aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm pt-0">
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Bahasa</span>
            <span className="font-medium text-gray-800">Indonesia</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Tema</span>
            <span className="font-medium text-gray-800">Terang</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-100">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-teal-800 text-lg">
              Tentang Aplikasi
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Informasi versi dan teknologi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm pt-0">
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Nama Aplikasi</span>
            <span className="font-medium text-gray-800">VendorWise AHP</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Versi</span>
            <span className="font-medium text-gray-800">
              {process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0"}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500">Metode</span>
            <span className="font-medium text-gray-800">
              Analytic Hierarchy Process
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
