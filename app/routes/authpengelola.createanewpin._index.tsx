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
  useNavigation
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
  Sparkles
} from "lucide-react";

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
  approvedAt: string;
}

interface CreatePINActionData {
  errors?: {
    pin?: string;
    confirmPin?: string;
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
    return redirect("/authpengelola/requestotpforregister");
  }

  return json<LoaderData>({
    phone,
    approvedAt: new Date().toISOString()
  });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;
  const pin = formData.get("pin") as string;
  const confirmPin = formData.get("confirmPin") as string;

  // Validation
  const errors: { pin?: string; confirmPin?: string; general?: string } = {};

  if (!pin || pin.length !== 6) {
    errors.pin = "PIN harus 6 digit";
  } else if (!/^\d{6}$/.test(pin)) {
    errors.pin = "PIN hanya boleh berisi angka";
  } else if (/^(.)\1{5}$/.test(pin)) {
    errors.pin = "PIN tidak boleh angka yang sama semua (111111)";
  } else if (pin === "123456" || pin === "654321" || pin === "000000") {
    errors.pin = "PIN terlalu mudah ditebak, gunakan kombinasi yang lebih aman";
  }

  if (!confirmPin) {
    errors.confirmPin = "Konfirmasi PIN wajib diisi";
  } else if (pin !== confirmPin) {
    errors.confirmPin = "PIN dan konfirmasi PIN tidak sama";
  }

  if (Object.keys(errors).length > 0) {
    return json<CreatePINActionData>({ errors }, { status: 400 });
  }

  // Simulasi menyimpan PIN - dalam implementasi nyata, hash dan simpan ke database
  try {
    console.log("Creating PIN for phone:", phone);

    // Simulasi delay API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect ke dashboard pengelola setelah berhasil
    return redirect("/pengelola/dashboard");
  } catch (error) {
    return json<CreatePINActionData>(
      {
        errors: { general: "Gagal membuat PIN. Silakan coba lagi." }
      },
      { status: 500 }
    );
  }
};

export default function CreateANewPIN() {
  const { phone, approvedAt } = useLoaderData<LoaderData>();
  const actionData = useActionData<CreatePINActionData>();
  const navigation = useNavigation();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [pinStrength, setPinStrength] = useState(0);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isSubmitting = navigation.state === "submitting";

  // Handle PIN input change
  const handlePinChange = (
    index: number,
    value: string,
    isConfirm: boolean = false
  ) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;

    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
      calculatePinStrength(newPin.join(""));
    }

    // Auto-focus next input
    if (value && index < 5) {
      const refs = isConfirm ? confirmPinRefs : pinRefs;
      refs.current[index + 1]?.focus();
    }
  };

  // Handle key down (backspace)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    isConfirm: boolean = false
  ) => {
    if (e.key === "Backspace") {
      const currentPin = isConfirm ? confirmPin : pin;
      const refs = isConfirm ? confirmPinRefs : pinRefs;

      if (!currentPin[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  // Calculate PIN strength
  const calculatePinStrength = (pinValue: string) => {
    if (pinValue.length < 6) {
      setPinStrength(0);
      return;
    }

    let strength = 0;

    // Check for sequential numbers
    const isSequential =
      /012345|123456|234567|345678|456789|987654|876543|765432|654321|543210/.test(
        pinValue
      );
    if (!isSequential) strength += 25;

    // Check for repeated numbers
    const hasRepeated = /(.)\1{2,}/.test(pinValue);
    if (!hasRepeated) strength += 25;

    // Check for common patterns
    const isCommon = [
      "123456",
      "654321",
      "111111",
      "000000",
      "222222",
      "333333",
      "444444",
      "555555",
      "666666",
      "777777",
      "888888",
      "999999"
    ].includes(pinValue);
    if (!isCommon) strength += 25;

    // Check for variety
    const uniqueDigits = new Set(pinValue.split("")).size;
    if (uniqueDigits >= 4) strength += 25;

    setPinStrength(strength);
  };

  // Get strength color and text
  const getStrengthInfo = () => {
    if (pinStrength === 0)
      return {
        color: "bg-gray-200",
        text: "Masukkan PIN",
        textColor: "text-gray-500"
      };
    if (pinStrength <= 25)
      return { color: "bg-red-500", text: "Lemah", textColor: "text-red-600" };
    if (pinStrength <= 50)
      return {
        color: "bg-yellow-500",
        text: "Sedang",
        textColor: "text-yellow-600"
      };
    if (pinStrength <= 75)
      return {
        color: "bg-blue-500",
        text: "Bagus",
        textColor: "text-blue-600"
      };
    return {
      color: "bg-green-500",
      text: "Sangat Kuat",
      textColor: "text-green-600"
    };
  };

  const strengthInfo = getStrengthInfo();
  const fullPin = pin.join("");
  const fullConfirmPin = confirmPin.join("");

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={5} totalSteps={5} />

      {/* Success Alert */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">
              Selamat! Akun Anda Telah Disetujui
            </p>
            <p className="text-sm text-green-700">
              Administrator telah memverifikasi dan menyetujui aplikasi Anda
            </p>
          </div>
        </div>
      </div>

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
            Langkah terakhir untuk mengamankan akun Anda
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
            <input type="hidden" name="confirmPin" value={fullConfirmPin} />

            {/* PIN Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">PIN 6 Digit</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPin(!showPin)}
                  className="text-gray-500 hover:text-gray-700"
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
                    className={`w-12 h-12 text-center text-lg font-bold ${
                      actionData?.errors?.pin ? "border-red-500" : ""
                    }`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {actionData?.errors?.pin && (
                <p className="text-sm text-red-600 text-center">
                  {actionData.errors.pin}
                </p>
              )}

              {/* PIN Strength Indicator */}
              {fullPin.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Kekuatan PIN</span>
                    <span
                      className={`text-sm font-medium ${strengthInfo.textColor}`}
                    >
                      {strengthInfo.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                      style={{ width: `${pinStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm PIN Input */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Konfirmasi PIN</Label>

              <div className="flex justify-center space-x-3">
                {confirmPin.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (confirmPinRefs.current[index] = el)}
                    type={showPin ? "text" : "password"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handlePinChange(index, e.target.value, true)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e, true)}
                    className={`w-12 h-12 text-center text-lg font-bold ${
                      actionData?.errors?.confirmPin ? "border-red-500" : ""
                    }`}
                  />
                ))}
              </div>

              {actionData?.errors?.confirmPin && (
                <p className="text-sm text-red-600 text-center">
                  {actionData.errors.confirmPin}
                </p>
              )}

              {/* PIN Match Indicator */}
              {fullPin.length === 6 && fullConfirmPin.length === 6 && (
                <div className="text-center">
                  {fullPin === fullConfirmPin ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">PIN cocok</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        PIN tidak cocok
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PIN Guidelines */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    Tips PIN yang Aman:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Hindari angka berurutan (123456, 654321)</li>
                    <li>• Jangan gunakan angka yang sama semua (111111)</li>
                    <li>• Hindari kombinasi mudah ditebak (000000, 123456)</li>
                    <li>• Gunakan kombinasi angka yang hanya Anda ketahui</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              disabled={
                isSubmitting ||
                fullPin.length !== 6 ||
                fullConfirmPin.length !== 6 ||
                fullPin !== fullConfirmPin ||
                pinStrength < 50
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Membuat Akun...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Selesaikan Registrasi
                </>
              )}
            </Button>
          </Form>

          {/* Final Note */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-800 mb-1">
                🎉 Hampir selesai!
              </p>
              <p className="text-xs text-gray-600">
                Setelah membuat PIN, Anda akan langsung dapat mengakses
                dashboard pengelola
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
