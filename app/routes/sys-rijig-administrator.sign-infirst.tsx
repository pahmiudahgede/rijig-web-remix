import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Recycle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Boxes } from "~/components/ui/background-boxes";
import { ThemeFloatingDock } from "~/components/ui/floatingthemeswitch";

// Interface untuk action response
interface LoginActionData {
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
  success: boolean;
}

// Loader - cek apakah user sudah login
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Dalam implementasi nyata, cek session/cookie
  // const session = await getSession(request.headers.get("Cookie"));
  // if (session.has("adminId")) {
  //   return redirect("/admin/dashboard");
  // }

  return json({});
};

// Action untuk handle login
export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const remember = formData.get("remember") === "on";

  // Validation
  const errors: { email?: string; password?: string; general?: string } = {};

  if (!email) {
    errors.email = "Email wajib diisi";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Format email tidak valid";
  }

  if (!password) {
    errors.password = "Password wajib diisi";
  } else if (password.length < 6) {
    errors.password = "Password minimal 6 karakter";
  }

  if (Object.keys(errors).length > 0) {
    return json<LoginActionData>({ errors, success: false }, { status: 400 });
  }

  // Simulasi autentikasi - dalam implementasi nyata, cek ke database
  if (email === "admin@wastemanagement.com" && password === "admin123") {
    // Set session dan redirect
    // const session = await getSession(request.headers.get("Cookie"));
    // session.set("adminId", "admin-001");
    // session.set("adminName", "Administrator");
    // session.set("adminEmail", email);

    // Redirect ke OTP verification
    return redirect(
      `/sys-rijig-administator/emailotpverifyrequired?email=${encodeURIComponent(
        email
      )}`
    );
  }

  return json<LoginActionData>(
    {
      errors: { general: "Email atau password salah" },
      success: false
    },
    { status: 401 }
  );
};

export default function AdminLogin() {
  const actionData = useActionData<LoginActionData>();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="h-full relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 z-20"> */}
      <div className="min-h-screen flex items-center justify-center w-full max-w-4xl z-20">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Form Login */}
              <div className="p-6 md:p-8">
                <Form method="post" className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-green-100 rounded-full">
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Portal Administrator
                    </h1>
                    <p className="text-muted-foreground text-balance mt-2">
                      Sistem Pengelolaan Sampah Terpadu
                    </p>
                  </div>

                  {/* Error Alert */}
                  {actionData?.errors?.general && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {actionData.errors.general}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Email Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email Administrator</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@wastemanagement.com"
                        className={cn(
                          "pl-10",
                          actionData?.errors?.email && "border-red-500"
                        )}
                        required
                      />
                    </div>
                    {actionData?.errors?.email && (
                      <p className="text-sm text-red-600">
                        {actionData.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="/admin/forgot-password"
                        className="text-sm text-green-600 hover:text-green-800 underline-offset-2 hover:underline"
                      >
                        Lupa password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        className={cn(
                          "pl-10 pr-10",
                          actionData?.errors?.password && "border-red-500"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {actionData?.errors?.password && (
                      <p className="text-sm text-red-600">
                        {actionData.errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Ingat saya selama 30 hari
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : (
                      "Masuk ke Dashboard"
                    )}
                  </Button>

                  {/* Demo Credentials */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Demo Credentials:
                    </p>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>Email: admin@wastemanagement.com</p>
                      <p>Password: admin123</p>
                    </div>
                  </div>
                </Form>
              </div>

              {/* Side Image */}
              <div className="bg-gradient-to-br from-green-600 to-blue-600 relative hidden md:block">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative h-full flex flex-col justify-center items-center text-white p-8">
                  <div className="mb-6 p-4 bg-white/20 rounded-full backdrop-blur-sm">
                    <Recycle className="h-16 w-16" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Kelola Sistem Sampah
                  </h2>
                  <p className="text-white/90 text-center text-balance leading-relaxed">
                    Platform terpadu untuk mengelola pengumpulan, pengolahan,
                    dan monitoring sampah di seluruh wilayah dengan efisiensi
                    maksimal.
                  </p>

                  {/* Features List */}
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Monitoring Real-time</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Manajemen Armada</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Laporan Analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm">Koordinasi Tim</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ThemeFloatingDock className="fixed bottom-5 left-1/2 transform -translate-x-1/2" />
      </div>
    </div>
  );
}
