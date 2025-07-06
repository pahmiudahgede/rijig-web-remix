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
  CheckCircle,
  LogIn,
  Shield
} from "lucide-react";

// Progress Indicator Component untuk Login (3 steps)
const LoginProgressIndicator = ({ currentStep = 1, totalSteps = 3 }) => {
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
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg scale-105"
                    : isCompleted
                    ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-700"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700"
                }
              `}
            >
              {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < totalSteps && (
              <div
                className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                  stepNumber < currentStep
                    ? "bg-green-400 dark:bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
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
interface RequestOTPLoginActionData {
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
  } else {
    // Validasi format nomor HP Indonesia
    const phoneRegex = /^62[0-9]{9,14}$/;
    if (!phoneRegex.test(phone)) {
      errors.phone = "Format: 628xxxxxxxxx (9-14 digit setelah 62)";
    }
  }

  if (Object.keys(errors).length > 0) {
    return json<RequestOTPLoginActionData>({ errors }, { status: 400 });
  }

  // Simulasi cek apakah nomor terdaftar
  const registeredPhones = ["6281234567890", "6281234567891", "6281234567892"];
  if (!registeredPhones.includes(phone)) {
    return json<RequestOTPLoginActionData>(
      {
        errors: {
          phone: "Nomor tidak terdaftar. Silakan daftar terlebih dahulu."
        }
      },
      { status: 404 }
    );
  }

  // Simulasi kirim OTP - dalam implementasi nyata, integrate dengan WhatsApp Business API
  try {
    console.log("Sending login OTP to WhatsApp:", phone);

    // Simulasi delay API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect ke step berikutnya dengan nomor HP
    return redirect(
      `/authpengelola/verifyotptologin?phone=${encodeURIComponent(phone)}`
    );
  } catch (error) {
    return json<RequestOTPLoginActionData>(
      {
        errors: { general: "Gagal mengirim OTP. Silakan coba lagi." }
      },
      { status: 500 }
    );
  }
};

export default function RequestOTPForLogin() {
  const actionData = useActionData<RequestOTPLoginActionData>();
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
      <LoginProgressIndicator currentStep={1} totalSteps={3} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full w-fit">
            <LogIn className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Masuk ke Akun Anda
          </h1>
          <p className="text-muted-foreground mt-2">
            Masukkan nomor WhatsApp yang terdaftar
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
                Nomor WhatsApp Terdaftar
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="628xxxxxxxxx"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`pl-12 h-12 text-lg ${
                    actionData?.errors?.phone
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  maxLength={16}
                  required
                />
              </div>

              {/* Display formatted phone */}
              {phone.length > 2 && (
                <p className="text-sm text-muted-foreground">
                  Format: {formatPhoneDisplay(phone)}
                </p>
              )}

              {actionData?.errors?.phone && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {actionData.errors.phone}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Login Aman dengan OTP
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Kode OTP akan dikirim ke nomor WhatsApp yang sudah terdaftar
                    untuk memastikan keamanan akun Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                Demo - Nomor Terdaftar:
              </p>
              <div className="space-y-1 text-xs text-yellow-700 dark:text-yellow-400">
                <p>• 6281234567890</p>
                <p>• 6281234567891</p>
                <p>• 6281234567892</p>
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

          {/* Register Link */}
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Belum punya akun?
                </span>
              </div>
            </div>

            <Link to="/authpengelola/requestotpforregister">
              <Button variant="outline" className="w-full">
                Daftar Sebagai Pengelola Baru
              </Button>
            </Link>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/authpengelola"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali ke halaman utama
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="border border-border bg-background/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Lupa nomor yang terdaftar?
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20saya%20lupa%20nomor%20WhatsApp%20yang%20terdaftar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Hubungi Customer Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
