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
  Smartphone
} from "lucide-react";
import { validateOtp, generateDeviceId } from "~/utils/auth-utils";
import pengelolaAuthService from "~/services/auth/pengelola.service";
import { createUserSession } from "~/sessions.server";

// Progress Indicator Component
const ProgressIndicator = ({ currentStep = 2, totalSteps = 5 }) => {
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

// Interfaces
interface LoaderData {
  phone: string;
  otpSentAt: string;
  expiryMinutes: number;
}

interface VerifyOTPActionData {
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
    return redirect("/authpengelola/requestotpforregister");
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
    try {
      // Call API untuk resend OTP
      const response = await pengelolaAuthService.requestOtpRegister({
        phone,
        role_name: "pengelola"
      });

      if (response.meta.status === 200) {
        return json<VerifyOTPActionData>({
          success: true,
          message: "Kode OTP baru telah dikirim ke WhatsApp Anda",
          otpSentAt: new Date().toISOString()
        });
      } else {
        return json<VerifyOTPActionData>(
          {
            errors: {
              general: response.meta.message || "Gagal mengirim ulang OTP"
            }
          },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      return json<VerifyOTPActionData>(
        {
          errors: { general: "Gagal mengirim ulang OTP. Silakan coba lagi." }
        },
        { status: 500 }
      );
    }
  }

  if (actionType === "verify") {
    // Validation
    const errors: { otp?: string; general?: string } = {};

    if (!otp) {
      errors.otp = "Kode OTP wajib diisi";
    } else if (!validateOtp(otp)) {
      errors.otp = "Kode OTP harus 4 digit angka";
    }

    if (Object.keys(errors).length > 0) {
      return json<VerifyOTPActionData>({ errors }, { status: 400 });
    }

    try {
      // Generate device ID
      const deviceId = generateDeviceId("pengelola_");

      // Call API untuk verifikasi OTP
      const response = await pengelolaAuthService.verifyOtpRegister({
        phone,
        otp,
        device_id: deviceId,
        role_name: "pengelola"
      });

      if (response.meta.status === 200 && response.data) {
        // OTP valid, create session
        return createUserSession({
          request,
          sessionData: {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            sessionId: response.data.session_id,
            role: "pengelola",
            deviceId: deviceId,
            phone: phone,
            tokenType: response.data.token_type,
            registrationStatus: response.data.registration_status,
            nextStep: response.data.next_step
          },
          redirectTo: "/authpengelola/completingcompanyprofile"
        });
      } else {
        return json<VerifyOTPActionData>(
          {
            errors: {
              otp:
                response.meta.message ||
                "Kode OTP tidak valid atau sudah kedaluwarsa"
            }
          },
          { status: 401 }
        );
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);

      // Handle specific API errors
      if (error.response?.data?.meta?.message) {
        return json<VerifyOTPActionData>(
          {
            errors: { otp: error.response.data.meta.message }
          },
          { status: error.response.status || 500 }
        );
      }

      return json<VerifyOTPActionData>(
        {
          errors: { general: "Gagal memverifikasi OTP. Silakan coba lagi." }
        },
        { status: 500 }
      );
    }
  }

  return json<VerifyOTPActionData>(
    {
      errors: { general: "Aksi tidak valid" }
    },
    { status: 400 }
  );
};

export default function VerifyOTPToRegister() {
  const { phone, otpSentAt, expiryMinutes } = useLoaderData<LoaderData>();
  const actionData = useActionData<VerifyOTPActionData>();
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
      <ProgressIndicator currentStep={2} totalSteps={5} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-fit">
            <Smartphone className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifikasi WhatsApp
          </h1>
          <p className="text-muted-foreground mt-2">
            Masukkan kode OTP 4 digit yang dikirim ke
          </p>
          <p className="font-medium text-green-600 text-lg">
            {formatPhone(phone)}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Alert */}
          {actionData?.success && actionData?.message && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {actionData.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {(actionData?.errors?.otp || actionData?.errors?.general) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {actionData.errors.otp || actionData.errors.general}
              </AlertDescription>
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
                      className={`w-14 h-14 text-center text-xl font-bold ${
                        actionData?.errors?.otp ? "border-red-500" : ""
                      }`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <p className="text-center text-xs text-gray-500">
                  Tempel kode OTP atau ketik manual
                </p>
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Kode kedaluwarsa dalam {formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <div className="text-sm text-red-600 font-medium">
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
                    Verifikasi Kode
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </Form>

          {/* Resend OTP */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Tidak menerima kode?</p>
            <Form method="post" className="inline">
              <input type="hidden" name="phone" value={phone} />
              <input type="hidden" name="_action" value="resend" />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={!canResend || isSubmitting}
                className="text-green-600 border-green-600 hover:bg-green-50"
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

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/authpengelola/requestotpforregister"
              className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Ganti nomor WhatsApp
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
              href="https://wa.me/6281234567890?text=Halo%20saya%20butuh%20bantuan%20verifikasi%20OTP"
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
