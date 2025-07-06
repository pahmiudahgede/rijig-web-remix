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
  useSearchParams
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
  Loader2
} from "lucide-react";

interface LoaderData {
  email: string;
  otpSentAt: string;
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

export const loader = async ({
  request
}: LoaderFunctionArgs): Promise<Response> => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) {
    return redirect("/sys-rijig-administrator/sign-infirst");
  }

  return json<LoaderData>({
    email,
    otpSentAt: new Date().toISOString(),
    expiryMinutes: 5
  });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const otp = formData.get("otp") as string;
  const email = formData.get("email") as string;
  const action = formData.get("_action") as string;

  if (action === "resend") {
    console.log("Resending OTP to:", email);

    return json<OTPActionData>({
      success: true,
      message: "Kode OTP baru telah dikirim ke email Anda",
      otpSentAt: new Date().toISOString()
    });
  }

  if (action === "verify") {
    const errors: { otp?: string; general?: string } = {};

    if (!otp || otp.length !== 4) {
      errors.otp = "Kode OTP harus 4 digit";
    } else if (!/^\d{4}$/.test(otp)) {
      errors.otp = "Kode OTP hanya boleh berisi angka";
    }

    if (Object.keys(errors).length > 0) {
      return json<OTPActionData>({ errors, success: false }, { status: 400 });
    }

    if (otp === "1234") {
      return redirect("/sys-rijig-adminpanel/dashboard");
    }

    return json<OTPActionData>(
      {
        errors: { otp: "Kode OTP tidak valid atau sudah kedaluwarsa" },
        success: false
      },
      { status: 401 }
    );
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
  const { email, otpSentAt, expiryMinutes } = useLoaderData<LoaderData>();
  const actionData = useActionData<OTPActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSubmitting = navigation.state === "submitting";
  const isResending = navigation.formData?.get("_action") === "resend";
  const isVerifying = navigation.formData?.get("_action") === "verify";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verifikasi Email
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Masukkan kode OTP 4 digit yang telah dikirim ke
            </p>
            <p className="font-medium text-green-600">{maskedEmail}</p>
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
            {actionData?.errors?.otp && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{actionData.errors.otp}</AlertDescription>
              </Alert>
            )}

            {/* OTP Input Form */}
            <Form method="post">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="_action" value="verify" />
              <input type="hidden" name="otp" value={otp.join("")} />

              <div className="space-y-4">
                {/* OTP Input Fields */}
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
                      className={cn(
                        "w-12 h-12 text-center text-lg font-bold",
                        actionData?.errors?.otp && "border-red-500"
                      )}
                      autoFocus={index === 0}
                    />
                  ))}
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
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={
                    otp.join("").length !== 4 || isSubmitting || timeLeft === 0
                  }
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    "Verifikasi Kode"
                  )}
                </Button>
              </div>
            </Form>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Tidak menerima kode?</p>
              <Form method="post" className="inline">
                <input type="hidden" name="email" value={email} />
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

            {/* Back to Login */}
            <div className="text-center">
              <a
                href="/sys-rijig-administrator/sign-infirst"
                className="inline-flex items-center text-sm text-gray-600 hover:text-green-600"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Kembali ke Login
              </a>
            </div>

            {/* Demo Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Demo OTP:
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  Gunakan kode:{" "}
                  <span className="font-mono font-bold">1234</span>
                </p>
                <p>Atau tunggu countdown habis untuk test resend</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Sistem Pengelolaan Sampah Terpadu
          </p>
        </div>
      </div>
    </div>
  );
}
