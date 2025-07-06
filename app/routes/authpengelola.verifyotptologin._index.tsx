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
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  Clock,
  RefreshCw,
  CheckCircle,
  Smartphone,
  Shield
} from "lucide-react";

// Progress Indicator Component untuk Login (3 steps)
const LoginProgressIndicator = ({ currentStep = 2, totalSteps = 3 }) => {
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
  otpSentAt: string;
  expiryMinutes: number;
}

interface VerifyOTPLoginActionData {
  success?: boolean;
  message?: string;
  otpSentAt?: string;
  errors?: {
    otp?: string;
    general?: string;
  };
}

export const loader = async ({
  request
}: LoaderFunctionArgs): Promise<Response> => {
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");

  if (!phone) {
    return redirect("/authpengelola/requestotpforlogin");
  }

  return json<LoaderData>({
    phone,
    otpSentAt: new Date().toISOString(),
    expiryMinutes: 5
  });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const otp = formData.get("otp") as string;
  const phone = formData.get("phone") as string;
  const actionType = formData.get("_action") as string;

  if (actionType === "resend") {
    // Simulasi resend OTP
    console.log("Resending login OTP to WhatsApp:", phone);

    return json<VerifyOTPLoginActionData>({
      success: true,
      message: "Kode OTP baru telah dikirim ke WhatsApp Anda",
      otpSentAt: new Date().toISOString()
    });
  }

  if (actionType === "verify") {
    // Validation
    const errors: { otp?: string; general?: string } = {};

    if (!otp || otp.length !== 4) {
      errors.otp = "Kode OTP harus 4 digit";
    } else if (!/^\d{4}$/.test(otp)) {
      errors.otp = "Kode OTP hanya boleh berisi angka";
    }

    if (Object.keys(errors).length > 0) {
      return json<VerifyOTPLoginActionData>({ errors }, { status: 400 });
    }

    // Simulasi verifikasi OTP - dalam implementasi nyata, cek ke database/cache
    if (otp === "1234") {
      // OTP valid, lanjut ke verifikasi PIN
      return redirect(
        `/authpengelola/verifyexistingpin?phone=${encodeURIComponent(phone)}`
      );
    }

    return json<VerifyOTPLoginActionData>(
      {
        errors: { otp: "Kode OTP tidak valid atau sudah kedaluwarsa" }
      },
      { status: 401 }
    );
  }

  return json<VerifyOTPLoginActionData>(
    {
      errors: { general: "Aksi tidak valid" }
    },
    { status: 400 }
  );
};

export default function VerifyOTPToLogin() {
  const { phone, otpSentAt, expiryMinutes } = useLoaderData<LoaderData>();
  const actionData = useActionData<VerifyOTPLoginActionData>();
  const navigation = useNavigation();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSubmitting = navigation.state === "submitting";
  const isResending = navigation.formData?.get("_action") === "resend";
  const isVerifying = navigation.formData?.get("_action") === "verify";

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset timer when OTP is resent
  useEffect(() => {
    if (actionData?.success && actionData?.otpSentAt) {
      setTimeLeft(expiryMinutes * 60);
      setCanResend(false);
    }
  }, [actionData, expiryMinutes]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down (backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 4);

    if (digits.length === 4) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRefs.current[3]?.focus();
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <LoginProgressIndicator currentStep={2} totalSteps={3} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full w-fit">
            <Smartphone className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Verifikasi Login
          </h1>
          <p className="text-muted-foreground mt-2">
            Masukkan kode OTP 4 digit yang dikirim ke
          </p>
          <p className="font-medium text-primary text-lg">
            {formatPhone(phone)}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Alert */}
          {actionData?.success && actionData?.message && (
            <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                {actionData.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {actionData?.errors?.otp && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{actionData.errors.otp}</AlertDescription>
            </Alert>
          )}

          {/* OTP Input Form */}
          <Form method="post">
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="_action" value="verify" />
            <input type="hidden" name="otp" value={otp.join("")} />

            <div className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-3">
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-14 h-14 text-center text-xl font-bold transition-all duration-200 ${
                        actionData?.errors?.otp
                          ? "border-red-500 dark:border-red-400"
                          : ""
                      } focus:scale-105`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Tempel kode OTP atau ketik manual
                </p>
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Kode kedaluwarsa dalam {formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                    Kode OTP telah kedaluwarsa
                  </div>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                disabled={
                  otp.join("").length !== 4 || isSubmitting || timeLeft === 0
                }
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Verifikasi & Lanjutkan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </Form>

          {/* Resend OTP */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Tidak menerima kode?
            </p>
            <Form method="post" className="inline">
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="_action" value="resend" />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={!canResend || isSubmitting}
                className="text-primary border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Kirim Ulang OTP
                  </>
                )}
              </Button>
            </Form>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Keamanan Login
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                  Setelah verifikasi OTP, Anda akan diminta memasukkan PIN 6
                  digit untuk mengakses dashboard pengelola.
                </p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/authpengelola/requestotpforlogin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Ganti nomor WhatsApp
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Demo Info */}
      <Card className="border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Demo OTP:
            </p>
            <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
              <p>
                Gunakan kode:{" "}
                <span className="font-mono font-bold text-lg">1234</span>
              </p>
              <p>Atau tunggu countdown habis untuk test resend</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
