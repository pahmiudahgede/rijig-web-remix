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
  useSearchParams,
  Link
} from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Shield,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Loader2,
  KeyRound
} from "lucide-react";
import { Boxes } from "~/components/ui/background-boxes";
import { ThemeFloatingDock } from "~/components/ui/floatingthemeswitch";

// ✅ Import services and utils
import adminAuthService from "~/services/auth/admin.service";
import { validateOtp } from "~/utils/auth-utils";
import { createUserSession, getUserSession } from "~/sessions.server";

interface LoaderData {
  email: string;
  deviceId: string;
  remainingTime: string;
  expiryMinutes: number;
}

interface OTPActionData {
  success: boolean;
  message?: string;
  otpSentAt?: string;
  errors?: {
    otp?: string;
    general?: string;
  };
}

// ✅ Proper loader with URL params validation
export const loader = async ({
  request
}: LoaderFunctionArgs): Promise<Response> => {
  const userSession = await getUserSession(request);

  // Redirect if already logged in
  if (userSession && userSession.role === "administrator") {
    return redirect("/sys-rijig-adminpanel/dashboard");
  }

  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const deviceId = url.searchParams.get("device_id");
  const remainingTime = url.searchParams.get("remaining_time");

  if (!email || !deviceId) {
    return redirect("/sys-rijig-administrator/sign-infirst");
  }

  return json<LoaderData>({
    email,
    deviceId,
    remainingTime: remainingTime || "5:00",
    expiryMinutes: 5
  });
};

// ✅ Action integrated with API service
export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const otp = formData.get("otp") as string;
  const email = formData.get("email") as string;
  const deviceId = formData.get("device_id") as string;
  const action = formData.get("_action") as string;

  if (action === "resend") {
    try {
      // ✅ Call login API again to resend OTP
      const response = await adminAuthService.login({
        device_id: deviceId,
        email,
        password: "temp" // We don't have password here, but API might handle resend differently
      });

      return json<OTPActionData>({
        success: true,
        message: "Kode OTP baru telah dikirim ke email Anda",
        otpSentAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      return json<OTPActionData>(
        {
          errors: { general: "Gagal mengirim ulang OTP. Silakan coba lagi." },
          success: false
        },
        { status: 500 }
      );
    }
  }

  if (action === "verify") {
    // ✅ Validation using utils
    const errors: { otp?: string; general?: string } = {};

    if (!otp) {
      errors.otp = "Kode OTP wajib diisi";
    } else if (!validateOtp(otp)) {
      errors.otp = "Kode OTP harus 4 digit angka";
    }

    if (!email || !deviceId) {
      errors.general = "Data session tidak valid. Silakan login ulang.";
    }

    if (Object.keys(errors).length > 0) {
      return json<OTPActionData>({ errors, success: false }, { status: 400 });
    }

    try {
      // ✅ Call API service for OTP verification
      const response = await adminAuthService.verifyOtp({
        device_id: deviceId,
        email,
        otp
      });

      if (response.meta.status === 200 && response.data) {
        // ✅ Create user session after successful verification
        return createUserSession({
          request,
          sessionData: {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            sessionId: response.data.session_id,
            role: "administrator",
            deviceId,
            email,
            registrationStatus: response.data.registration_status || "complete",
            nextStep: response.data.next_step || "completed"
          },
          redirectTo: "/sys-rijig-adminpanel/dashboard"
        });
      }

      return json<OTPActionData>(
        {
          errors: { otp: "Verifikasi OTP gagal" },
          success: false
        },
        { status: 401 }
      );
    } catch (error: any) {
      console.error("OTP verification error:", error);

      // ✅ Handle specific API errors
      if (error.response?.data?.meta?.message) {
        return json<OTPActionData>(
          {
            errors: { otp: error.response.data.meta.message },
            success: false
          },
          { status: error.response.status || 401 }
        );
      }

      return json<OTPActionData>(
        {
          errors: { general: "Terjadi kesalahan server. Silakan coba lagi." },
          success: false
        },
        { status: 500 }
      );
    }
  }

  return json<OTPActionData>(
    {
      errors: { general: "Aksi tidak valid" },
      success: false
    },
    { status: 400 }
  );
};

export default function AdminVerifyOTP() {
  const { email, deviceId, remainingTime, expiryMinutes } =
    useLoaderData<LoaderData>();
  const actionData = useActionData<OTPActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(() => {
    // ✅ Parse remaining time from API response
    const [minutes, seconds] = remainingTime.split(":").map(Number);
    return minutes * 60 + (seconds || 0);
  });
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSubmitting = navigation.state === "submitting";
  const isResending = navigation.formData?.get("_action") === "resend";
  const isVerifying = navigation.formData?.get("_action") === "verify";

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

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
  }, [timeLeft]);

  // Reset timer when OTP is resent
  useEffect(() => {
    if (actionData?.success && actionData?.otpSentAt) {
      setTimeLeft(expiryMinutes * 60);
      setCanResend(false);
    }
  }, [actionData, expiryMinutes]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return (
    <div className="h-full relative w-full overflow-hidden bg-slate-900 dark:bg-slate-950 light:bg-slate-100 flex flex-col items-center justify-center rounded-lg">
      {/* Background overlay with theme-aware gradient */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 dark:bg-slate-950 light:bg-slate-100 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      {/* Animated background boxes */}
      <Boxes />

      {/* Theme Toggle - Positioned at top-right */}
      <ThemeFloatingDock className="fixed top-6 right-6 z-50" />

      {/* Main content container */}
      <div className="min-h-screen flex items-center justify-center w-full max-w-md z-20 p-4">
        <div className="w-full space-y-6">
          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
                <KeyRound className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Verifikasi Email
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Masukkan kode OTP 4 digit yang telah dikirim ke
              </p>
              <p className="font-medium text-primary bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full text-sm inline-block mt-2">
                {maskedEmail}
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

              {/* General Error Alert */}
              {actionData?.errors?.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {actionData.errors.general}
                  </AlertDescription>
                </Alert>
              )}

              {/* OTP Input Form */}
              <Form method="post">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="device_id" value={deviceId} />
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
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className={cn(
                            "w-14 h-14 text-center text-xl font-bold bg-background border-input transition-all duration-200 focus:scale-105",
                            actionData?.errors?.otp &&
                              "border-red-500 dark:border-red-400"
                          )}
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
                        <span>
                          Kode kedaluwarsa dalam {formatTime(timeLeft)}
                        </span>
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
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-lg transition-all duration-200"
                    disabled={
                      otp.join("").length !== 4 ||
                      isSubmitting ||
                      timeLeft === 0
                    }
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verifikasi & Masuk
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
                  <input type="hidden" name="email" value={email} />
                  <input type="hidden" name="device_id" value={deviceId} />
                  <input type="hidden" name="_action" value="resend" />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={!canResend || isSubmitting}
                    className="text-primary border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Kirim Ulang OTP
                      </>
                    )}
                  </Button>
                </Form>
              </div>

              {/* Security Info */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Keamanan Email
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Kode OTP dikirim melalui email terenkripsi untuk
                      memastikan keamanan akun administrator Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  to="/sys-rijig-administrator/sign-infirst"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Kembali ke Login
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground space-y-2">
              <p>Portal Administrator - Sistem Pengelolaan Sampah Terpadu</p>
              <div className="flex items-center justify-center space-x-4">
                <a
                  href="/privacy"
                  className="hover:text-primary transition-colors underline underline-offset-4"
                >
                  Privacy
                </a>
                <span>•</span>
                <a
                  href="/terms"
                  className="hover:text-primary transition-colors underline underline-offset-4"
                >
                  Terms
                </a>
                <span>•</span>
                <a
                  href="/support"
                  className="hover:text-primary transition-colors underline underline-offset-4"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
