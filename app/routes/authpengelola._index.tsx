import { Link } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { UserPlus, LogIn, Building, CheckCircle } from "lucide-react";

export default function AuthPengelolaIndex() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Selamat Datang di WasteFlow
          </CardTitle>
          <CardDescription className="text-base">
            Platform Pengelolaan Sampah untuk Bisnis Anda
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefits */}
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Kelola operasional sampah secara digital</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Monitoring real-time armada dan pegawai</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Laporan analytics dan insights</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Koordinasi tim yang efisien</span>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Register Button */}
            <Link to="/authpengelola/requestotpforregister">
              <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg">
                <UserPlus className="mr-2 h-5 w-5" />
                Daftar Sebagai Pengelola Baru
              </Button>
            </Link>

            {/* Login Button */}
            <Link to="/authpengelola/requestotpforlogin">
              <Button variant="outline" className="w-full h-12 border-2 hover:bg-gray-50">
                <LogIn className="mr-2 h-5 w-5" />
                Sudah Punya Akun? Masuk
              </Button>
            </Link>
          </div>

          <Separator />

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Building className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Khusus Pengelola Sampah
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Platform ini diperuntukkan bagi perusahaan atau koperasi 
                  pengelolaan sampah yang membutuhkan sistem manajemen digital.
                </p>
              </div>
            </div>
          </div>

          {/* Admin Contact */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Butuh bantuan? Hubungi Administrator
            </p>
            <a 
              href="tel:+6281234567890" 
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              +62 812-3456-7890
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}