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
import { useState } from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Building,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  MapPin,
  User,
  FileText,
  Phone,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { formatDateToDDMMYYYY, validatePhoneNumber } from "~/utils/auth-utils";
import pengelolaAuthService from "~/services/auth/pengelola.service";
import { getUserSession, createUserSession } from "~/sessions.server";

// Progress Indicator Component
const ProgressIndicator = ({ currentStep = 3, totalSteps = 5 }) => {
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
}

interface CompanyProfileActionData {
  errors?: {
    companyname?: string;
    companyaddress?: string;
    companyphone?: string;
    companyemail?: string;
    companywebsite?: string;
    taxid?: string;
    foundeddate?: string;
    companytype?: string;
    companydescription?: string;
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
  if (userSession.registrationStatus !== "uncomplete") {
    // Redirect based on current status
    switch (userSession.registrationStatus) {
      case "awaiting_approval":
        return redirect("/authpengelola/waitingapprovalfromadministrator");
      case "approved":
        return redirect("/authpengelola/createanewpin");
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

  // Extract form data sesuai dengan API requirements
  const companyData = {
    companyname: formData.get("companyname") as string,
    companyaddress: formData.get("companyaddress") as string,
    companyphone: formData.get("companyphone") as string,
    companyemail: formData.get("companyemail") as string,
    companywebsite: formData.get("companywebsite") as string,
    taxid: formData.get("taxid") as string,
    foundeddate: formData.get("foundeddate") as string,
    companytype: formData.get("companytype") as string,
    companydescription: formData.get("companydescription") as string,
    company_logo: formData.get("company_logo") as File | null
  };

  // Validation
  const errors: { [key: string]: string } = {};

  if (!companyData.companyname?.trim()) {
    errors.companyname = "Nama perusahaan wajib diisi";
  }

  if (!companyData.companyaddress?.trim()) {
    errors.companyaddress = "Alamat perusahaan wajib diisi";
  }

  if (!companyData.companyphone?.trim()) {
    errors.companyphone = "Nomor telepon perusahaan wajib diisi";
  } else if (!validatePhoneNumber(companyData.companyphone)) {
    errors.companyphone =
      "Format nomor telepon tidak valid (gunakan format 628xxxxxxxxx)";
  }

  if (!companyData.companyemail?.trim()) {
    errors.companyemail = "Email perusahaan wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.companyemail)) {
    errors.companyemail = "Format email tidak valid";
  }

  if (!companyData.companywebsite?.trim()) {
    errors.companywebsite = "Website perusahaan wajib diisi";
  } else if (!/^https?:\/\/.+\..+/.test(companyData.companywebsite)) {
    errors.companywebsite =
      "Format website tidak valid (harus dimulai dengan http:// atau https://)";
  }

  if (!companyData.taxid?.trim()) {
    errors.taxid = "NPWP/Tax ID wajib diisi";
  }

  if (!companyData.foundeddate?.trim()) {
    errors.foundeddate = "Tanggal berdiri wajib diisi";
  } else {
    // Validate date format DD-MM-YYYY
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(companyData.foundeddate)) {
      errors.foundeddate = "Format tanggal harus DD-MM-YYYY";
    }
  }

  if (!companyData.companytype?.trim()) {
    errors.companytype = "Jenis perusahaan wajib dipilih";
  }

  if (!companyData.companydescription?.trim()) {
    errors.companydescription = "Deskripsi perusahaan wajib diisi";
  }

  if (Object.keys(errors).length > 0) {
    return json<CompanyProfileActionData>({ errors }, { status: 400 });
  }

  try {
    // Prepare data untuk API call
    const apiData = {
      companyname: companyData.companyname.trim(),
      companyaddress: companyData.companyaddress.trim(),
      companyphone: companyData.companyphone.trim(),
      companyemail: companyData.companyemail.trim(),
      companywebsite: companyData.companywebsite.trim(),
      taxid: companyData.taxid.trim(),
      foundeddate: companyData.foundeddate.trim(),
      companytype: companyData.companytype.trim(),
      companydescription: companyData.companydescription.trim(),
      ...(companyData.company_logo && {
        company_logo: companyData.company_logo
      })
    };

    // Call API untuk create company profile
    const response = await pengelolaAuthService.createCompanyProfile(apiData);

    if (response.meta.status === 200 && response.data) {
      // Update session dengan data terbaru
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
        redirectTo: "/authpengelola/waitingapprovalfromadministrator"
      });
    } else {
      return json<CompanyProfileActionData>(
        {
          errors: {
            general:
              response.meta.message || "Gagal menyimpan profil perusahaan"
          }
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Create company profile error:", error);

    // Handle specific API errors
    if (error.response?.data?.meta?.message) {
      return json<CompanyProfileActionData>(
        {
          errors: { general: error.response.data.meta.message }
        },
        { status: error.response.status || 500 }
      );
    }

    return json<CompanyProfileActionData>(
      {
        errors: {
          general: "Gagal menyimpan profil perusahaan. Silakan coba lagi."
        }
      },
      { status: 500 }
    );
  }
};

export default function CompletingCompanyProfile() {
  const { userSession } = useLoaderData<LoaderData>();
  const actionData = useActionData<CompanyProfileActionData>();
  const navigation = useNavigation();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const isSubmitting = navigation.state === "submitting";

  // Handle logo file change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={3} totalSteps={5} />

      {/* Main Card */}
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-fit">
            <Building className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Profil Perusahaan
          </h1>
          <p className="text-muted-foreground mt-2">
            Lengkapi informasi perusahaan untuk verifikasi admin
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
          <Form
            method="post"
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* Company Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Informasi Perusahaan
                </h3>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyname">Nama Perusahaan *</Label>
                <Input
                  id="companyname"
                  name="companyname"
                  type="text"
                  placeholder="PT/CV/Koperasi Nama Perusahaan"
                  className={
                    actionData?.errors?.companyname ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.companyname && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companyname}
                  </p>
                )}
              </div>

              {/* Company Address */}
              <div className="space-y-2">
                <Label htmlFor="companyaddress">Alamat Perusahaan *</Label>
                <Textarea
                  id="companyaddress"
                  name="companyaddress"
                  placeholder="Alamat lengkap perusahaan"
                  className={
                    actionData?.errors?.companyaddress ? "border-red-500" : ""
                  }
                  rows={3}
                  required
                />
                {actionData?.errors?.companyaddress && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companyaddress}
                  </p>
                )}
              </div>

              {/* Company Phone */}
              <div className="space-y-2">
                <Label htmlFor="companyphone">Nomor Telepon Perusahaan *</Label>
                <Input
                  id="companyphone"
                  name="companyphone"
                  type="text"
                  placeholder="628xxxxxxxxx"
                  className={
                    actionData?.errors?.companyphone ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.companyphone && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companyphone}
                  </p>
                )}
              </div>

              {/* Company Email */}
              <div className="space-y-2">
                <Label htmlFor="companyemail">Email Perusahaan *</Label>
                <Input
                  id="companyemail"
                  name="companyemail"
                  type="email"
                  placeholder="info@company.com"
                  className={
                    actionData?.errors?.companyemail ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.companyemail && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companyemail}
                  </p>
                )}
              </div>

              {/* Company Website */}
              <div className="space-y-2">
                <Label htmlFor="companywebsite">Website Perusahaan *</Label>
                <Input
                  id="companywebsite"
                  name="companywebsite"
                  type="url"
                  placeholder="https://company.com"
                  className={
                    actionData?.errors?.companywebsite ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.companywebsite && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companywebsite}
                  </p>
                )}
              </div>

              {/* Tax ID */}
              <div className="space-y-2">
                <Label htmlFor="taxid">NPWP/Tax ID *</Label>
                <Input
                  id="taxid"
                  name="taxid"
                  type="text"
                  placeholder="123456789123456"
                  className={actionData?.errors?.taxid ? "border-red-500" : ""}
                  required
                />
                {actionData?.errors?.taxid && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.taxid}
                  </p>
                )}
              </div>

              {/* Founded Date */}
              <div className="space-y-2">
                <Label htmlFor="foundeddate">Tanggal Berdiri *</Label>
                <Input
                  id="foundeddate"
                  name="foundeddate"
                  type="text"
                  placeholder="DD-MM-YYYY (contoh: 10-09-2015)"
                  className={
                    actionData?.errors?.foundeddate ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.foundeddate && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.foundeddate}
                  </p>
                )}
              </div>

              {/* Company Type */}
              <div className="space-y-2">
                <Label htmlFor="companytype">Jenis Perusahaan *</Label>
                <Input
                  id="companytype"
                  name="companytype"
                  type="text"
                  placeholder="Waste recycle"
                  className={
                    actionData?.errors?.companytype ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.companytype && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companytype}
                  </p>
                )}
              </div>

              {/* Company Description */}
              <div className="space-y-2">
                <Label htmlFor="companydescription">
                  Deskripsi Perusahaan *
                </Label>
                <Textarea
                  id="companydescription"
                  name="companydescription"
                  placeholder="Ceritakan tentang perusahaan Anda..."
                  className={
                    actionData?.errors?.companydescription
                      ? "border-red-500"
                      : ""
                  }
                  rows={4}
                  required
                />
                {actionData?.errors?.companydescription && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companydescription}
                  </p>
                )}
              </div>

              {/* Company Logo */}
              <div className="space-y-2">
                <Label htmlFor="company_logo">Logo Perusahaan (Opsional)</Label>
                <div className="space-y-3">
                  <Input
                    id="company_logo"
                    name="company_logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="cursor-pointer"
                  />
                  {logoPreview && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="text-sm font-medium">Preview Logo</p>
                        <p className="text-xs text-gray-500">
                          Ukuran maksimal 2MB, format JPG/PNG
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Informasi Penting
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Data yang Anda masukkan akan diverifikasi oleh
                    administrator. Pastikan semua informasi akurat dan sesuai
                    dengan dokumen perusahaan.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan Profil...
                </>
              ) : (
                <>
                  Lanjutkan ke Verifikasi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </Form>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/authpengelola"
              className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali ke halaman utama
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
