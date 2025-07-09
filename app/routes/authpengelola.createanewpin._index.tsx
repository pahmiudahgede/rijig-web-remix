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
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Star
} from "lucide-react";
import { validatePin } from "~/utils/auth-utils";
import pengelolaAuthService from "~/services/auth/pengelola.service";
import { getUserSession, createUserSession } from "~/sessions.server";

// Progress Indicator Component
const ProgressIndicator = ({ currentStep = 5, totalSteps = 5 }) => {
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
              {isCompleted || isActive ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                stepNumber
              )}
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
  userSession: any;
}

interface CreatePinActionData {
  errors?: {
    userpin?: string;
    confirmPin?: string;
    general?: string;
  };
  success?: boolean;
}

export const loader = async ({
  request
}: LoaderFunctionArgs): Promise<Response> => {
  const userSession = await getUserSession(request);

  // Check if user is authenticated and has pengelola role
  if (!userSession || userSession.role !== "pengelola") {
    return redirect("/authpengelola");
  }

  // Check if user should be on this step
  if (userSession.registrationStatus !== "approved") {
    // Redirect based on current status
    switch (userSession.registrationStatus) {
      case "uncomplete":
        return redirect("/authpengelola/completingcompanyprofile");
      case "awaiting_approval":
        return redirect("/authpengelola/waitingapprovalfromadministrator");
      case "complete":
        return redirect("/pengelola/dashboard");
      default:
        break;
    }
  }

  return json<LoaderData>({ userSession });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const userSession = await getUserSession(request);

  if (!userSession || userSession.role !== "pengelola") {
    return redirect("/authpengelola");
  }

  const formData = await request.formData();
  const userpin = formData.get("userpin") as string;
  const confirmPin = formData.get("confirmPin") as string;

  // Validation
  const errors: { [key: string]: string } = {};

  if (!userpin) {
    errors.userpin = "PIN wajib diisi";
  } else if (!validatePin(userpin)) {
    errors.userpin = "PIN harus 6 digit angka";
  }

  if (!confirmPin) {
    errors.confirmPin = "Konfirmasi PIN wajib diisi";
  } else if (userpin !== confirmPin) {
    errors.confirmPin = "PIN dan konfirmasi PIN tidak sama";
  }

  if (Object.keys(errors).length > 0) {
    return json<CreatePinActionData>({ errors }, { status: 400 });
  }

  try {
    // Call API untuk create PIN
    const response = await pengelolaAuthService.createPin({
      userpin
    });

    if (response.meta.status === 200 && response.data) {
      // PIN berhasil dibuat, update session dan redirect ke dashboard
      return createUserSession({
        request,
        sessionData: {
          ...userSession,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          sessionId: response.data.session_id,
          tokenType: response.data.token_type,
          registrationStatus: response.data.registration_status,
          nextStep: response.data.next_step
        },
        redirectTo: "/pengelola/dashboard"
      });
    } else {
      return json<CreatePinActionData>(
        {
          errors: { general: response.meta.message || "Gagal membuat PIN" }
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Create PIN error:", error);

    // Handle specific API errors
    if (error.response?.data?.meta?.message) {
      return json<CreatePinActionData>(
        {
          errors: { general: error.response.data.meta.message }
        },
        { status: error.response.status || 500 }
      );
    }

    return json<CreatePinActionData>(
      {
        errors: { general: "Gagal membuat PIN. Silakan coba lagi." }
      },
      { status: 500 }
    );
  }
};

export default function CreateANewPin() {
  const { userSession } = useLoaderData<LoaderData>();
  const actionData = useActionData<CreatePinActionData>();
  const navigation = useNavigation();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSubmitting = navigation.state === "submitting";

  // Handle PIN input change
  const handlePinChange = (
    index: number,
    value: string,
    isPinField: boolean = true
  ) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const currentPin = isPinField ? pin : confirmPin;
    const setCurrentPin = isPinField ? setPin : setConfirmPin;
    const refs = isPinField ? pinRefs : confirmPinRefs;

    const newPin = [...currentPin];
    newPin[index] = value;
    setCurrentPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  // Handle key down (backspace)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    isPinField: boolean = true
  ) => {
    const currentPin = isPinField ? pin : confirmPin;
    const refs = isPinField ? pinRefs : confirmPinRefs;

    if (e.key === "Backspace" && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent, isPinField: boolean = true) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      const newPin = digits.split("");
      if (isPinField) {
        setPin(newPin);
        pinRefs.current[5]?.focus();
      } else {
        setConfirmPin(newPin);
        confirmPinRefs.current[5]?.focus();
      }
    }
  };

  const pinValue = pin.join("");
  const confirmPinValue = confirmPin.join("");
  const isPinComplete = pinValue.length === 6 && confirmPinValue.length === 6;
  const isPinMatching = pinValue === confirmPinValue && pinValue.length === 6;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={5} totalSteps={5} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Buat PIN Keamanan
          </h1>
          <p className="text-muted-foreground mt-2">
            Langkah terakhir! Buat PIN 6 digit untuk mengamankan akun Anda
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
            <input type="hidden" name="userpin" value={pinValue} />
            <input type="hidden" name="confirmPin" value={confirmPinValue} />

            {/* PIN Input */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Masukkan PIN Baru
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPin(!showPin)}
                    className="h-8 px-2 text-gray-500 hover:text-gray-700"
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
                      onChange={(e) =>
                        handlePinChange(index, e.target.value, true)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e, true)}
                      onPaste={(e) => handlePaste(e, true)}
                      className={`w-14 h-14 text-center text-xl font-bold ${
                        actionData?.errors?.userpin ? "border-red-500" : ""
                      }`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {actionData?.errors?.userpin && (
                  <p className="text-sm text-red-600 text-center">
                    {actionData.errors.userpin}
                  </p>
                )}
              </div>

              {/* Confirm PIN Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Konfirmasi PIN
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="h-8 px-2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPin ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex justify-center space-x-3">
                  {confirmPin.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (confirmPinRefs.current[index] = el)}
                      type={showConfirmPin ? "text" : "password"}
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handlePinChange(index, e.target.value, false)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e, false)}
                      onPaste={(e) => handlePaste(e, false)}
                      className={`w-14 h-14 text-center text-xl font-bold ${
                        actionData?.errors?.confirmPin ? "border-red-500" : ""
                      } ${
                        isPinComplete && !isPinMatching ? "border-red-500" : ""
                      } ${isPinMatching ? "border-green-500" : ""}`}
                    />
                  ))}
                </div>

                {actionData?.errors?.confirmPin && (
                  <p className="text-sm text-red-600 text-center">
                    {actionData.errors.confirmPin}
                  </p>
                )}

                {isPinComplete &&
                  !isPinMatching &&
                  !actionData?.errors?.confirmPin && (
                    <p className="text-sm text-red-600 text-center">
                      PIN tidak sama, silakan periksa kembali
                    </p>
                  )}

                {isPinMatching && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>PIN cocok!</span>
                  </div>
                )}
              </div>
            </div>

            {/* PIN Requirements */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Syarat PIN Keamanan
                  </p>
                  <div className="text-xs text-blue-700 mt-1 space-y-1">
                    <p>• Harus terdiri dari 6 digit angka</p>
                    <p>
                      • Hindari urutan angka (123456) atau angka sama (111111)
                    </p>
                    <p>• Jangan gunakan tanggal lahir atau nomor telepon</p>
                    <p>
                      • PIN akan digunakan untuk verifikasi transaksi penting
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              disabled={!isPinMatching || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Membuat PIN...
                </>
              ) : (
                <>
                  <Star className="mr-2 h-5 w-5" />
                  Selesaikan Registrasi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </Form>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/authpengelola/waitingapprovalfromadministrator"
              className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali ke status persetujuan
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="border border-gray-200 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">
              🔒 Tips Keamanan PIN
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Jangan berikan PIN kepada siapa pun</p>
              <p>• Ganti PIN secara berkala untuk keamanan optimal</p>
              <p>• PIN dapat diubah melalui menu pengaturan setelah login</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
