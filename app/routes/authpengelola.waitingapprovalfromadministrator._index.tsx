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
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Progress } from "~/components/ui/progress";
import {
  Clock,
  CheckCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  FileCheck
} from "lucide-react";
import pengelolaAuthService from "~/services/auth/pengelola.service";
import { getUserSession, createUserSession } from "~/sessions.server";

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

// Interfaces
interface LoaderData {
  userSession: any;
  lastChecked: string;
}

interface CheckApprovalActionData {
  success?: boolean;
  approved?: boolean;
  message?: string;
  errors?: {
    general?: string;
  };
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
  if (userSession.registrationStatus !== "awaiting_approval") {
    // Redirect based on current status
    switch (userSession.registrationStatus) {
      case "uncomplete":
        return redirect("/authpengelola/completingcompanyprofile");
      case "approved":
        return redirect("/authpengelola/createanewpin");
      case "complete":
        return redirect("/pengelola/dashboard");
      default:
        break;
    }
  }

  return json<LoaderData>({
    userSession,
    lastChecked: new Date().toISOString()
  });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const userSession = await getUserSession(request);

  if (!userSession || userSession.role !== "pengelola") {
    return redirect("/authpengelola");
  }

  try {
    // Call API untuk check approval status
    const response = await pengelolaAuthService.checkApproval();

    if (response.meta.status === 200 && response.data) {
      if (response.data.registration_status === "approved") {
        // User sudah di-approve, update session dan redirect
        return createUserSession({
          request,
          sessionData: {
            ...userSession,
            ...(response.data.access_token && {
              accessToken: response.data.access_token
            }),
            ...(response.data.refresh_token && {
              refreshToken: response.data.refresh_token
            }),
            ...(response.data.session_id && {
              sessionId: response.data.session_id
            }),
            tokenType: response.data.token_type,
            registrationStatus: response.data.registration_status,
            nextStep: response.data.next_step
          },
          redirectTo: "/authpengelola/createanewpin"
        });
      } else {
        // Masih awaiting approval
        return json<CheckApprovalActionData>({
          success: true,
          approved: false,
          message:
            response.data.message || "Masih menunggu persetujuan administrator"
        });
      }
    } else {
      return json<CheckApprovalActionData>(
        {
          errors: {
            general:
              response.meta.message || "Gagal mengecek status persetujuan"
          }
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Check approval error:", error);

    // Handle specific API errors
    if (error.response?.data?.meta?.message) {
      return json<CheckApprovalActionData>(
        {
          errors: { general: error.response.data.meta.message }
        },
        { status: error.response.status || 500 }
      );
    }

    return json<CheckApprovalActionData>(
      {
        errors: {
          general: "Gagal mengecek status persetujuan. Silakan coba lagi."
        }
      },
      { status: 500 }
    );
  }
};

export default function WaitingApprovalFromAdministrator() {
  const { userSession, lastChecked } = useLoaderData<LoaderData>();
  const actionData = useActionData<CheckApprovalActionData>();
  const navigation = useNavigation();

  const [timeWaiting, setTimeWaiting] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const isSubmitting = navigation.state === "submitting";

  // Calculate time waiting
  useEffect(() => {
    const updateTimeWaiting = () => {
      const now = new Date();
      const submitted = new Date(lastChecked);
      const diffMs = now.getTime() - submitted.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeWaiting(`${hours} jam ${minutes} menit`);
      } else {
        setTimeWaiting(`${minutes} menit`);
      }
    };

    updateTimeWaiting();
    const interval = setInterval(updateTimeWaiting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastChecked]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Trigger form submission to check approval
      const form = document.getElementById(
        "check-approval-form"
      ) as HTMLFormElement;
      if (form && !isSubmitting) {
        form.requestSubmit();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, isSubmitting]);

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={4} totalSteps={5} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full w-fit">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Menunggu Persetujuan
          </h1>
          <p className="text-muted-foreground mt-2">
            Profil perusahaan Anda sedang ditinjau oleh administrator
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Alert */}
          {actionData?.success && !actionData.approved && (
            <Alert className="border-blue-200 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {actionData.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {actionData?.errors?.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{actionData.errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Waiting Status */}
          <div className="space-y-4">
            {/* Progress Animation */}
            <div className="relative">
              <div className="flex items-center justify-center space-x-8 py-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    Data Dikirim
                  </span>
                </div>

                <div className="flex-1 h-0.5 bg-orange-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-400 animate-pulse"></div>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                    <UserCheck className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-orange-600">
                    Verifikasi Admin
                  </span>
                </div>

                <div className="flex-1 h-0.5 bg-gray-200"></div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-400">
                    Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Time Waiting */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Telah menunggu:</p>
              <p className="text-lg font-semibold text-gray-900">
                {timeWaiting}
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FileCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Proses Verifikasi
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Administrator sedang memverifikasi dokumen dan informasi
                      perusahaan yang Anda berikan. Proses ini biasanya memakan
                      waktu 1-24 jam.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Yang Diverifikasi
                    </p>
                    <div className="text-xs text-yellow-700 mt-1 space-y-1">
                      <p>• Kebenaran informasi perusahaan</p>
                      <p>• Validitas dokumen NPWP/Tax ID</p>
                      <p>• Kesesuaian bidang usaha</p>
                      <p>• Kelengkapan data kontak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Check Status Form */}
          <Form method="post" id="check-approval-form">
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 border-2 border-orange-200 hover:bg-orange-50 text-orange-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mengecek Status...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Cek Status Persetujuan
                </>
              )}
            </Button>
          </Form>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span>Auto-refresh setiap 30 detik</span>
            </label>
          </div>

          {/* Contact Support */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Sudah lebih dari 24 jam? Hubungi administrator
            </p>
            <div className="flex flex-col space-y-2">
              <a
                href="https://wa.me/6281234567890?text=Halo%20saya%20butuh%20bantuan%20verifikasi%20akun%20pengelola"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-sm text-green-600 hover:text-green-800 font-medium"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                WhatsApp: +62 812-3456-7890
              </a>
              <a
                href="mailto:admin@wasteflow.com?subject=Bantuan%20Verifikasi%20Akun%20Pengelola"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Email: admin@wasteflow.com
              </a>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center border-t pt-4">
            <Link
              to="/authpengelola/completingcompanyprofile"
              className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Edit profil perusahaan
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border border-gray-200 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">
              💡 Tips: Pastikan informasi yang diberikan akurat
            </p>
            <p className="text-xs text-gray-600">
              Jika ada kesalahan data, admin akan menghubungi Anda untuk revisi
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
