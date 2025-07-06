import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  Link
} from "@remix-run/react";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  KeyRound,
  Fingerprint
} from "lucide-react";

// Progress Indicator Component untuk Login (3 steps)
const LoginProgressIndicator = ({ currentStep = 3, totalSteps = 3 }) => {
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

// Interfaces
interface LoaderData {
  phone: string;
  lastLoginAt?: string;
}

interface VerifyPINActionData {
  errors?: {
    pin?: string;
    general?: string;
  };
  success?: boolean;
}

export const loader = async ({
  request
}: LoaderFunctionArgs): Promise<Response> => {
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");

  if (!phone) {
    return redirect("/authpengelola/requestotpforlogin");
  }

  // Simulasi data user - dalam implementasi nyata, ambil dari database
  return json<LoaderData>({
    phone,
    lastLoginAt: "2025-07-05T10:30:00Z" // contoh last login
  });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  const pin = formData.get("pin") as string;

  // Validation
  const errors: { pin?: string; general?: string } = {};

  if (!pin || pin.length !== 6) {
    errors.pin = "PIN harus 6 digit";
  } else if (!/^\d{6}$/.test(pin)) {
    errors.pin = "PIN hanya boleh berisi angka";
  }

  if (Object.keys(errors).length > 0) {
    return json<VerifyPINActionData>({ errors }, { status: 400 });
  }

  // Simulasi verifikasi PIN - dalam implementasi nyata, hash dan compare dengan database
  const validPIN = "123456"; // Demo PIN

  if (pin !== validPIN) {
    return json<VerifyPINActionData>(
      {
        errors: { pin: "PIN yang Anda masukkan salah. Silakan coba lagi." }
      },
      { status: 401 }
    );
  }

  // PIN valid, buat session dan redirect ke dashboard
  try {
    console.log("PIN verified for phone:", phone);

    // Simulasi delay dan create session
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Dalam implementasi nyata:
    // const session = await getSession(request.headers.get("Cookie"));
    // session.set("pengelolaId", userId);
    // session.set("pengelolaPhone", phone);
    // session.set("loginTime", new Date().toISOString());

    // Redirect ke dashboard pengelola
    return redirect("/pengelola/dashboard");
  } catch (error) {
    return json<VerifyPINActionData>(
      {
        errors: { general: "Gagal login. Silakan coba lagi." }
      },
      { status: 500 }
    );
  }
};

export default function VerifyExistingPIN() {
  const { phone, lastLoginAt } = useLoaderData<LoaderData>();
  const actionData = useActionData<VerifyPINActionData>();
  const navigation = useNavigation();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSubmitting = navigation.state === "submitting";

  // Handle PIN input change
  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down (backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      const newPin = digits.split("");
      setPin(newPin);
      pinRefs.current[5]?.focus();
    }
  };

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

  // Format last login
  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return "Belum pernah login";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Kurang dari 1 jam yang lalu";
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Kemarin";
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const fullPin = pin.join("");

  // Track failed attempts
  if (actionData?.errors?.pin && attemptCount < 3) {
    // In real implementation, this would be tracked server-side
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <LoginProgressIndicator currentStep={3} totalSteps={3} />

      {/* Welcome Back Card */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-300">
              Selamat Datang Kembali!
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              Login terakhir: {formatLastLogin(lastLoginAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full w-fit">
            <KeyRound className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Masukkan PIN Anda
          </h1>
          <p className="text-muted-foreground mt-2">
            Akun: {formatPhone(phone)}
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
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="pin" value={fullPin} />

            {/* PIN Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">PIN Keamanan</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPin(!showPin)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex justify-center space-x-3">
                {pin.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (pinRefs.current[index] = el)}
                    type={showPin ? "text" : "password"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-lg font-bold transition-all duration-200 ${
                      actionData?.errors?.pin
                        ? "border-red-500 dark:border-red-400"
                        : ""
                    } focus:scale-105`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {actionData?.errors?.pin && (
                <div className="text-center">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {actionData.errors.pin}
                  </p>
                  {attemptCount >= 2 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Akun akan dikunci sementara setelah 3 kali percobaan gagal
                    </p>
                  )}
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Tempel PIN atau ketik manual
              </p>
            </div>

            {/* Security Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Fingerprint className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Keamanan Terjamin
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    PIN Anda dienkripsi dengan standar keamanan tinggi. Jangan
                    bagikan PIN kepada siapapun.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              disabled={isSubmitting || fullPin.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memverifikasi PIN...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Masuk ke Dashboard
                </>
              )}
            </Button>
          </Form>

          {/* Forgot PIN */}
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Lupa PIN?
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Hubungi Customer Support untuk reset PIN
              </p>
              <div className="flex items-center justify-center space-x-4">
                <a
                  href="tel:+6281234567890"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  📞 Call Support
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href={`https://wa.me/6281234567890?text=Halo%20saya%20lupa%20PIN%20untuk%20nomor%20${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to={`/authpengelola/verifyotptologin?phone=${encodeURIComponent(
                phone
              )}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali ke verifikasi OTP
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Demo Info */}
      <Card className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Demo PIN:
            </p>
            <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
              <p>
                Gunakan PIN:{" "}
                <span className="font-mono font-bold text-lg">123456</span>
              </p>
              <p>Untuk testing login flow pengelola</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Tips Keamanan
              </p>
              <ul className="text-xs text-amber-700 dark:text-amber-400 mt-1 space-y-1">
                <li>• Jangan bagikan PIN kepada siapapun</li>
                <li>• Logout dari perangkat yang bukan milik Anda</li>
                <li>• Ganti PIN secara berkala untuk keamanan</li>
                <li>• Laporkan aktivitas mencurigakan ke admin</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
