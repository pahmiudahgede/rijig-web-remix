import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import {
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  RefreshCw,
  FileText,
  Shield,
  AlertCircle,
  Users
} from "lucide-react";

// Progress Indicator Component
const ProgressIndicator = ({ currentStep = 4, totalSteps = 5 }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  isActive
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                    : isCompleted
                    ? "bg-green-100 text-green-600 border-2 border-green-200"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                }
              `}
            >
              {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`w-8 h-0.5 mx-2 ${
                  stepNumber < currentStep ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Interface
interface LoaderData {
  phone: string;
  submittedAt: string;
  estimatedApprovalTime: string; // "1-3 hari kerja"
  applicationId: string;
}

export const loader = async ({
  request
}: LoaderFunctionArgs): Promise<Response> => {
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");

  if (!phone) {
    return redirect("/authpengelola/requestotpforregister");
  }

  // Simulasi data - dalam implementasi nyata, ambil dari database
  return json<LoaderData>({
    phone,
    submittedAt: new Date().toISOString(),
    estimatedApprovalTime: "1-3 hari kerja",
    applicationId: "WF" + Date.now().toString().slice(-6)
  });
};

export default function WaitingApprovalFromAdministrator() {
  const { phone, submittedAt, estimatedApprovalTime, applicationId } =
    useLoaderData<LoaderData>();
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer untuk menunjukkan berapa lama sudah menunggu
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const submitted = new Date(submittedAt).getTime();
      const elapsed = Math.floor((now - submitted) / 1000 / 60); // minutes
      setTimeElapsed(elapsed);
    }, 60000); // Update setiap menit

    return () => clearInterval(interval);
  }, [submittedAt]);

  // Format phone display
  const formatPhone = (phoneNumber: string) => {
    if (phoneNumber.length <= 2) return phoneNumber;
    if (phoneNumber.length <= 5)
      return `${phoneNumber.substring(0, 2)} ${phoneNumber.substring(2)}`;
    if (phoneNumber.length <= 9)
      return `${phoneNumber.substring(0, 2)} ${phoneNumber.substring(
        2,
        5
      )} ${phoneNumber.substring(5)}`;
    return `${phoneNumber.substring(0, 2)} ${phoneNumber.substring(
      2,
      5
    )} ${phoneNumber.substring(5, 9)} ${phoneNumber.substring(9)}`;
  };

  // Format elapsed time
  const formatElapsedTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari yang lalu`;
  };

  // Simulasi status checker - dalam implementasi nyata, polling ke server
  const checkStatus = () => {
    // Untuk demo, redirect ke step berikutnya setelah beberapa detik
    setTimeout(() => {
      window.location.href = `/authpengelola/createanewpin?phone=${encodeURIComponent(
        phone
      )}`;
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={4} totalSteps={5} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-fit">
            <Clock className="h-8 w-8 text-yellow-600 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Menunggu Persetujuan Administrator
          </h1>
          <p className="text-muted-foreground mt-2">
            Aplikasi Anda sedang dalam proses verifikasi
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Info */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-800">
                Status: Dalam Review
              </span>
            </div>
            <p className="text-sm text-gray-600">
              ID Aplikasi:{" "}
              <span className="font-mono font-medium">{applicationId}</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Progress Verifikasi
              </span>
              <span className="text-sm text-gray-500">75%</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-gray-500">
              Estimasi waktu: {estimatedApprovalTime}
            </p>
          </div>

          {/* Submitted Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                Aplikasi Berhasil Dikirim
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-green-700">
                  <strong>Nomor WhatsApp:</strong> {formatPhone(phone)}
                </p>
              </div>
              <div>
                <p className="text-green-700">
                  <strong>Waktu Kirim:</strong> {formatElapsedTime(timeElapsed)}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Proses Selanjutnya
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Verifikasi Data Perusahaan
                  </p>
                  <p className="text-xs text-gray-600">
                    Administrator akan memverifikasi informasi yang Anda berikan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-600 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Pengecekan Dokumen
                  </p>
                  <p className="text-xs text-gray-600">
                    Validasi legalitas dan kredibilitas perusahaan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Persetujuan & Aktivasi
                  </p>
                  <p className="text-xs text-gray-600">
                    Akun akan diaktivasi dan Anda bisa membuat PIN
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Butuh Bantuan atau Informasi?
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <a
                      href="tel:+6281234567890"
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      +62 812-3456-7890
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a
                      href="mailto:admin@wasteflow.com"
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      admin@wasteflow.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <a
                      href={`https://wa.me/6281234567890?text=Halo%20saya%20ingin%20bertanya%20tentang%20aplikasi%20${applicationId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      WhatsApp Admin
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={checkStatus}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Cek Status Persetujuan
            </Button>

            <Link to="/authpengelola">
              <Button variant="outline" className="w-full h-12">
                Kembali ke Halaman Utama
              </Button>
            </Link>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Penting untuk Diingat
                </p>
                <ul className="text-xs text-amber-700 mt-1 space-y-1">
                  <li>
                    • Jangan tutup aplikasi ini, bookmark halaman untuk akses
                    mudah
                  </li>
                  <li>
                    • Anda akan mendapat notifikasi WhatsApp saat disetujui
                  </li>
                  <li>
                    • Proses verifikasi dilakukan pada hari kerja (Senin-Jumat)
                  </li>
                  <li>
                    • Pastikan nomor WhatsApp aktif untuk menerima notifikasi
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Card */}
      <Card className="border border-green-200 bg-green-50/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-green-800 mb-2">
              Demo Mode:
            </p>
            <p className="text-xs text-green-700">
              Klik "Cek Status Persetujuan" untuk simulasi approval dan lanjut
              ke step terakhir
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
