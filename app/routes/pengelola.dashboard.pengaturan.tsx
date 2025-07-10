// app/routes/dashboard.settings.tsx
import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Building2, MapPin, Save, User } from "lucide-react";

// Loader untuk mengambil data profil perusahaan
export async function loader({ request }: LoaderFunctionArgs) {
  // Simulasi data - ganti dengan query database Anda
  const companyProfile = {
    id: "1",
    name: "PT. Kelola Sampah Indonesia",
    email: "admin@kelolasampah.co.id",
    phone: "+62 21 1234 5678",
    website: "https://kelolasampah.co.id",
    description:
      "Perusahaan pengelolaan sampah terpadu dengan fokus pada daur ulang dan pengelolaan limbah yang ramah lingkungan.",
    address: {
      street: "Jl. Lingkungan Hijau No. 123",
      city: "Jakarta",
      province: "DKI Jakarta",
      postalCode: "12345",
      country: "Indonesia"
    },
    establishedYear: "2020",
    licenseNumber: "LIC-2020-001"
  };

  return json({ companyProfile });
}

// Action untuk handle form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "updateProfile") {
    // Handle update profil perusahaan
    const profileData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      website: formData.get("website"),
      description: formData.get("description"),
      establishedYear: formData.get("establishedYear"),
      licenseNumber: formData.get("licenseNumber")
    };

    // Simulasi update - ganti dengan update database Anda
    console.log("Updating profile:", profileData);

    return json({
      success: true,
      message: "Profil perusahaan berhasil diperbarui"
    });
  }

  if (intent === "updateAddress") {
    // Handle update alamat
    const addressData = {
      street: formData.get("street"),
      city: formData.get("city"),
      province: formData.get("province"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country")
    };

    // Simulasi update - ganti dengan update database Anda
    console.log("Updating address:", addressData);

    return json({
      success: true,
      message: "Alamat perusahaan berhasil diperbarui"
    });
  }

  return json({ success: false, message: "Invalid action" });
}

export default function SettingsPage() {
  const { companyProfile } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-2">
          Kelola profil perusahaan dan informasi alamat Anda
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Profil Perusahaan */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Profil Perusahaan</CardTitle>
              </div>
              <CardDescription>
                Informasi dasar tentang perusahaan pengelola sampah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="updateProfile" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Perusahaan</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={companyProfile.name}
                      placeholder="Masukkan nama perusahaan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={companyProfile.email}
                      placeholder="admin@perusahaan.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={companyProfile.phone}
                      placeholder="+62 21 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      defaultValue={companyProfile.website}
                      placeholder="https://perusahaan.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Tahun Berdiri</Label>
                    <Input
                      id="establishedYear"
                      name="establishedYear"
                      defaultValue={companyProfile.establishedYear}
                      placeholder="2020"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">No. Izin Usaha</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      defaultValue={companyProfile.licenseNumber}
                      placeholder="LIC-2020-001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Perusahaan</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={companyProfile.description}
                    placeholder="Deskripsikan perusahaan Anda..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>

          {/* Alamat Perusahaan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle>Alamat Perusahaan</CardTitle>
              </div>
              <CardDescription>
                Informasi lokasi dan alamat lengkap perusahaan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="updateAddress" />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Alamat Lengkap</Label>
                    <Input
                      id="street"
                      name="street"
                      defaultValue={companyProfile.address.street}
                      placeholder="Jl. Nama Jalan No. 123"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={companyProfile.address.city}
                        placeholder="Jakarta"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Provinsi</Label>
                      <Input
                        id="province"
                        name="province"
                        defaultValue={companyProfile.address.province}
                        placeholder="DKI Jakarta"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Kode Pos</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        defaultValue={companyProfile.address.postalCode}
                        placeholder="12345"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Negara</Label>
                      <Input
                        id="country"
                        name="country"
                        defaultValue={companyProfile.address.country}
                        placeholder="Indonesia"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Menyimpan..." : "Simpan Alamat"}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Info & Status */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Perusahaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="default" className="bg-green-600">
                    Aktif
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Verifikasi
                  </span>
                  <Badge variant="secondary">Terverifikasi</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Tahun Berdiri
                  </span>
                  <span className="text-sm font-medium">
                    {companyProfile.establishedYear}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    No. Izin
                  </span>
                  <span className="text-sm font-medium">
                    {companyProfile.licenseNumber}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Aktivitas Terakhir</p>
                <p className="text-xs text-muted-foreground">
                  Profil diperbarui 2 hari yang lalu
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profil
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Lihat Preview
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Lokasi di Peta
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Informasi Penting</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pastikan informasi yang Anda masukkan akurat dan terkini.
                    Data ini akan digunakan untuk laporan dan komunikasi dengan
                    pihak terkait.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
