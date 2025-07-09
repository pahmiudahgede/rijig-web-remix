import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation, Link } from "@remix-run/react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Phone,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { validatePhoneNumber } from "~/utils/auth-utils";
import pengelolaAuthService from "~/services/auth/pengelola.service";

// Progress Indicator Component
const ProgressIndicator = ({ currentStep = 1, totalSteps = 5 }) => {
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

// Interface untuk action response
interface RequestOTPActionData {
  errors?: {
    phone?: string;
    general?: string;
  };
  success?: boolean;
}

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;

  // Validation
  const errors: { phone?: string; general?: string } = {};

  if (!phone) {
    errors.phone = "Nomor WhatsApp wajib diisi";
  } else if (!validatePhoneNumber(phone)) {
    errors.phone = "Format: 628xxxxxxxxx (9-14 digit setelah 62)";
  }

  if (Object.keys(errors).length > 0) {
    return json<RequestOTPActionData>({ errors }, { status: 400 });
  }

  try {
    // Call API untuk request OTP register
    const response = await pengelolaAuthService.requestOtpRegister({
      phone,
      role_name: "pengelola"
    });

    if (response.meta.status === 200) {
      // OTP berhasil dikirim, redirect ke halaman verifikasi
      return redirect(
        `/authpengelola/verifyotptoregister?phone=${encodeURIComponent(phone)}`
      );
    } else {
      return json<RequestOTPActionData>(
        {
          errors: { general: response.meta.message || "Gagal mengirim OTP" }
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Request OTP error:", error);

    // Handle specific API errors
    if (error.response?.data?.meta?.message) {
      return json<RequestOTPActionData>(
        {
          errors: { general: error.response.data.meta.message }
        },
        { status: error.response.status || 500 }
      );
    }

    return json<RequestOTPActionData>(
      {
        errors: { general: "Gagal mengirim OTP. Silakan coba lagi." }
      },
      { status: 500 }
    );
  }
};

export default function RequestOTPForRegister() {
  const actionData = useActionData<RequestOTPActionData>();
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");

  const isSubmitting = navigation.state === "submitting";

  // Format input nomor HP
  const handlePhoneChange = (value: string) => {
    // Remove non-numeric characters
    let cleaned = value.replace(/\D/g, "");

    // Ensure starts with 62
    if (cleaned.length > 0 && !cleaned.startsWith("62")) {
      if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.substring(1);
      } else if (cleaned.startsWith("8")) {
        cleaned = "62" + cleaned;
      } else {
        cleaned = "62" + cleaned;
      }
    }

    // Limit length
    if (cleaned.length > 16) {
      cleaned = cleaned.substring(0, 16);
    }

    setPhone(cleaned);
  };

  // Format display nomor HP
  const formatPhoneDisplay = (value: string) => {
    if (value.length <= 2) return value;
    if (value.length <= 5)
      return `${value.substring(0, 2)} ${value.substring(2)}`;
    if (value.length <= 9)
      return `${value.substring(0, 2)} ${value.substring(
        2,
        5
      )} ${value.substring(5)}`;
    return `${value.substring(0, 2)} ${value.substring(2, 5)} ${value.substring(
      5,
      9
    )} ${value.substring(9)}`;
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={1} totalSteps={5} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-fit">
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Selamat Datang! Mari mulai...
          </h1>
          <p className="text-muted-foreground mt-2">
            Masukkan nomor WhatsApp untuk verifikasi akun
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {actionData?.errors?.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{actionData.errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <Form method="post" className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-base font-medium">
                Nomor WhatsApp
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="628xxxxxxxxx"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`pl-12 h-12 text-lg ${
                    actionData?.errors?.phone ? "border-red-500" : ""
                  }`}
                  maxLength={16}
                  required
                />
              </div>

              {/* Display formatted phone */}
              {phone.length > 2 && (
                <p className="text-sm text-gray-600">
                  Format: {formatPhoneDisplay(phone)}
                </p>
              )}

              {actionData?.errors?.phone && (
                <p className="text-sm text-red-600">
                  {actionData.errors.phone}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Verifikasi WhatsApp
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Kode OTP akan dikirim ke nomor WhatsApp Anda. Pastikan nomor
                    yang dimasukkan aktif dan dapat menerima pesan.
                  </p>
                </div>
              </div>
            </div>

            {/* Format Guide */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Format Nomor Yang Benar:
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Dimulai dengan 62 (kode negara Indonesia)</p>
                <p>• Contoh: 628123456789 (untuk 0812-3456-789)</p>
                <p>• Panjang: 11-16 digit total</p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              disabled={isSubmitting || phone.length < 11}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mengirim OTP...
                </>
              ) : (
                <>
                  Kirim Kode OTP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </Form>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/authpengelola"
              className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali ke halaman utama
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="border border-gray-200 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Mengalami kesulitan?</p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20saya%20butuh%20bantuan%20registrasi%20pengelola"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Hubungi Customer Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
