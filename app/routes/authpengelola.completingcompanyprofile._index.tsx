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
  Phone
} from "lucide-react";

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
  phone: string;
}

interface CompanyProfileActionData {
  errors?: {
    companyName?: string;
    ownerName?: string;
    companyType?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    businessType?: string;
    employeeCount?: string;
    serviceArea?: string;
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

  return json<LoaderData>({ phone });
};

export const action = async ({
  request
}: ActionFunctionArgs): Promise<Response> => {
  const formData = await request.formData();
  const phone = formData.get("phone") as string;

  // Extract form data
  const companyData = {
    companyName: formData.get("companyName") as string,
    ownerName: formData.get("ownerName") as string,
    companyType: formData.get("companyType") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    postalCode: formData.get("postalCode") as string,
    businessType: formData.get("businessType") as string,
    employeeCount: formData.get("employeeCount") as string,
    serviceArea: formData.get("serviceArea") as string,
    description: formData.get("description") as string
  };

  // Validation
  const errors: { [key: string]: string } = {};

  if (!companyData.companyName?.trim()) {
    errors.companyName = "Nama perusahaan wajib diisi";
  }

  if (!companyData.ownerName?.trim()) {
    errors.ownerName = "Nama pemilik/direktur wajib diisi";
  }

  if (!companyData.companyType) {
    errors.companyType = "Jenis badan usaha wajib dipilih";
  }

  if (!companyData.address?.trim()) {
    errors.address = "Alamat lengkap wajib diisi";
  }

  if (!companyData.city?.trim()) {
    errors.city = "Kota wajib diisi";
  }

  if (!companyData.postalCode?.trim()) {
    errors.postalCode = "Kode pos wajib diisi";
  } else if (!/^\d{5}$/.test(companyData.postalCode)) {
    errors.postalCode = "Kode pos harus 5 digit angka";
  }

  if (!companyData.businessType) {
    errors.businessType = "Jenis usaha wajib dipilih";
  }

  if (!companyData.employeeCount) {
    errors.employeeCount = "Jumlah karyawan wajib dipilih";
  }

  if (!companyData.serviceArea?.trim()) {
    errors.serviceArea = "Area layanan wajib diisi";
  }

  if (Object.keys(errors).length > 0) {
    return json<CompanyProfileActionData>({ errors }, { status: 400 });
  }

  // Simulasi menyimpan data - dalam implementasi nyata, simpan ke database
  try {
    console.log("Saving company profile:", { phone, ...companyData });

    // Simulasi delay API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect ke step berikutnya
    return redirect(
      `/authpengelola/waitingapprovalfromadministrator?phone=${encodeURIComponent(
        phone
      )}`
    );
  } catch (error) {
    return json<CompanyProfileActionData>(
      {
        errors: { general: "Gagal menyimpan data. Silakan coba lagi." }
      },
      { status: 500 }
    );
  }
};

export default function CompletingCompanyProfile() {
  const { phone } = useLoaderData<LoaderData>();
  const actionData = useActionData<CompanyProfileActionData>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

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
          <Form method="post" className="space-y-6">
            <input type="hidden" name="phone" value={phone} />

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
                <Label htmlFor="companyName">Nama Perusahaan *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="PT/CV/Koperasi Nama Perusahaan"
                  className={
                    actionData?.errors?.companyName ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.companyName && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companyName}
                  </p>
                )}
              </div>

              {/* Owner Name */}
              <div className="space-y-2">
                <Label htmlFor="ownerName">Nama Pemilik/Direktur *</Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  placeholder="Nama lengkap pemilik atau direktur"
                  className={
                    actionData?.errors?.ownerName ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.ownerName && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.ownerName}
                  </p>
                )}
              </div>

              {/* Company Type */}
              <div className="space-y-2">
                <Label htmlFor="companyType">Jenis Badan Usaha *</Label>
                <Select name="companyType" required>
                  <SelectTrigger
                    className={
                      actionData?.errors?.companyType ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Pilih jenis badan usaha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">PT (Perseroan Terbatas)</SelectItem>
                    <SelectItem value="cv">
                      CV (Commanditaire Vennootschap)
                    </SelectItem>
                    <SelectItem value="koperasi">Koperasi</SelectItem>
                    <SelectItem value="ud">UD (Usaha Dagang)</SelectItem>
                    <SelectItem value="firma">Firma</SelectItem>
                    <SelectItem value="yayasan">Yayasan</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                {actionData?.errors?.companyType && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.companyType}
                  </p>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Alamat Perusahaan
                </h3>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Jalan, nomor, RT/RW, Kelurahan, Kecamatan"
                  className={
                    actionData?.errors?.address ? "border-red-500" : ""
                  }
                  rows={3}
                  required
                />
                {actionData?.errors?.address && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.address}
                  </p>
                )}
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Kota *</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Jakarta/Bandung/Surabaya/dll"
                    className={actionData?.errors?.city ? "border-red-500" : ""}
                    required
                  />
                  {actionData?.errors?.city && (
                    <p className="text-sm text-red-600">
                      {actionData.errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    placeholder="12345"
                    maxLength={5}
                    className={
                      actionData?.errors?.postalCode ? "border-red-500" : ""
                    }
                    required
                  />
                  {actionData?.errors?.postalCode && (
                    <p className="text-sm text-red-600">
                      {actionData.errors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">
                  Informasi Usaha
                </h3>
              </div>

              {/* Business Type */}
              <div className="space-y-2">
                <Label htmlFor="businessType">
                  Jenis Usaha Pengelolaan Sampah *
                </Label>
                <Select name="businessType" required>
                  <SelectTrigger
                    className={
                      actionData?.errors?.businessType ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Pilih jenis usaha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collection">
                      Pengumpulan & Pengangkutan
                    </SelectItem>
                    <SelectItem value="processing">
                      Pengolahan & Daur Ulang
                    </SelectItem>
                    <SelectItem value="disposal">Pembuangan Akhir</SelectItem>
                    <SelectItem value="integrated">
                      Terintegrasi (Semua Layanan)
                    </SelectItem>
                    <SelectItem value="consulting">
                      Konsultan Pengelolaan Sampah
                    </SelectItem>
                  </SelectContent>
                </Select>
                {actionData?.errors?.businessType && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.businessType}
                  </p>
                )}
              </div>

              {/* Employee Count */}
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Jumlah Karyawan *</Label>
                <Select name="employeeCount" required>
                  <SelectTrigger
                    className={
                      actionData?.errors?.employeeCount ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Pilih jumlah karyawan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 orang</SelectItem>
                    <SelectItem value="6-10">6-10 orang</SelectItem>
                    <SelectItem value="11-25">11-25 orang</SelectItem>
                    <SelectItem value="26-50">26-50 orang</SelectItem>
                    <SelectItem value="51-100">51-100 orang</SelectItem>
                    <SelectItem value="100+">Lebih dari 100 orang</SelectItem>
                  </SelectContent>
                </Select>
                {actionData?.errors?.employeeCount && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.employeeCount}
                  </p>
                )}
              </div>

              {/* Service Area */}
              <div className="space-y-2">
                <Label htmlFor="serviceArea">Area Layanan *</Label>
                <Input
                  id="serviceArea"
                  name="serviceArea"
                  type="text"
                  placeholder="Jakarta Utara, Bekasi, Tangerang, dll"
                  className={
                    actionData?.errors?.serviceArea ? "border-red-500" : ""
                  }
                  required
                />
                {actionData?.errors?.serviceArea && (
                  <p className="text-sm text-red-600">
                    {actionData.errors.serviceArea}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Usaha (Opsional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Ceritakan lebih detail tentang usaha pengelolaan sampah Anda..."
                  rows={3}
                />
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
              to={`/authpengelola/verifyotptoregister?phone=${encodeURIComponent(
                phone
              )}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali ke verifikasi OTP
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
