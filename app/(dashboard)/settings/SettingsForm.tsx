"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SettingsFormProps = {
  user: { name: string; email: string };
};

export function SettingsForm({ user }: SettingsFormProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-teal-800">
            Informasi Akun
          </CardTitle>
          <CardDescription>
            Data akun Anda saat ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Nama</span>
            <span className="font-medium text-gray-800">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800">{user.email}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
