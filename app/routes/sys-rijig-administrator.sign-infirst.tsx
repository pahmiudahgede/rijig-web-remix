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
    <div className="h-full relative w-full overflow-hidden bg-slate-900 dark:bg-slate-950 light:bg-slate-100 flex flex-col items-center justify-center rounded-lg">
      {/* Background overlay with theme-aware gradient */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 dark:bg-slate-950 light:bg-slate-100 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      {/* Animated background boxes */}
      <Boxes />

      {/* Theme Toggle - Positioned at top-right */}
      <ThemeFloatingDock className="fixed top-6 right-6 z-50" />

      {/* Main content container */}
      <div className="min-h-screen flex items-center justify-center w-full max-w-4xl z-20 p-4">
        <div className="flex flex-col gap-6 w-full">
          <Card className="overflow-hidden border-0 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Form Login */}
              <div className="p-6 md:p-8 bg-background">
                <Form method="post" className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
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
                    <Label htmlFor="email" className="text-foreground">
                      Email Administrator
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@wastemanagement.com"
                        className={cn(
                          "pl-10 bg-background border-input",
                          actionData?.errors?.email &&
                            "border-red-500 dark:border-red-400"
                        )}
                        required
                      />
                    </div>
                    {actionData?.errors?.email && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {actionData.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-foreground">
                        Password
                      </Label>
                      <a
                        href="/admin/forgot-password"
                        className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline-offset-2 hover:underline transition-colors"
                      >
                        Lupa password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        className={cn(
                          "pl-10 pr-10 bg-background border-input",
                          actionData?.errors?.password &&
                            "border-red-500 dark:border-red-400"
                        )}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {actionData?.errors?.password && (
                      <p className="text-sm text-red-600 dark:text-red-400">
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
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-input rounded accent-green-600"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-foreground"
                    >
                      Ingat saya selama 30 hari
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-lg transition-all duration-200"
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
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Demo Credentials:
                    </p>
                    <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                      <p>Email: admin@wastemanagement.com</p>
                      <p>Password: admin123</p>
                    </div>
                  </div>
                </Form>
              </div>

              {/* Side Illustration */}
              <div className="bg-gradient-to-br from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700 relative hidden md:block">
                <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
                <div className="relative h-full flex flex-col justify-center items-center text-white p-8">
                  <div className="mb-6 p-4 bg-white/20 dark:bg-white/10 rounded-full backdrop-blur-sm">
                    <Recycle className="h-16 w-16" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    Kelola Sistem Sampah
                  </h2>
                  <p className="text-white/90 dark:text-white/80 text-center text-balance leading-relaxed">
                    Platform terpadu untuk mengelola pengumpulan, pengolahan,
                    dan monitoring sampah di seluruh wilayah dengan efisiensi
                    maksimal.
                  </p>

                  {/* Features List */}
                  <div className="mt-8 space-y-3">
                    {[
                      "Monitoring Real-time",
                      "Manajemen Armada",
                      "Laporan Analytics",
                      "Koordinasi Tim"
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 group"
                      >
                        <div className="w-2 h-2 bg-white rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                        <span className="text-sm group-hover:text-white/100 transition-colors duration-200">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
                  <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <a
                href="/privacy"
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="/terms"
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                Terms of Service
              </a>
              <span>•</span>
              <a
                href="/support"
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                Support
              </a>
            </div>
            <p>© 2025 Waste Management System. Semua hak dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
