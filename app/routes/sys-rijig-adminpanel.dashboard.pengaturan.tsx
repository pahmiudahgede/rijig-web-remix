import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { Separator } from "~/components/ui/separator"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { 
  Settings, 
  Users, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Globe,
  Palette,
  Save,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data - ganti dengan data dari database
  const settings = {
    // Pengaturan Umum
    appName: "EcoWaste Manager",
    appDescription: "Sistem Pengelolaan Sampah Terpadu untuk Lingkungan yang Lebih Bersih",
    companyName: "PT. Lingkungan Hijau Indonesia",
    companyAddress: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
    companyPhone: "+62 21 1234567",
    companyEmail: "info@ecowaste.com",
    timezone: "Asia/Jakarta",
    language: "id",
    
    // Pengaturan Sistem
    maintenanceMode: false,
    registrationEnabled: true,
    maxFileSize: "10",
    sessionTimeout: "60",
    backupFrequency: "daily",
    
    // Pengaturan Email
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@ecowaste.com",
    smtpPassword: "",
    emailFrom: "EcoWaste System <noreply@ecowaste.com>",
    
    // Pengaturan Notifikasi
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    notifyNewUser: true,
    notifyLowStock: true,
    notifySystemAlert: true,
    
    // Statistik
    totalUsers: 245,
    totalWaste: "1,250 kg",
    lastBackup: "2 jam yang lalu",
    systemUptime: "99.9%"
  }
  
  return json({ settings })
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const intent = formData.get("intent")
  
  try {
    switch (intent) {
      case "general":
        // Save general settings
        console.log("Saving general settings...")
        break
      case "system":
        // Save system settings
        console.log("Saving system settings...")
        break
      case "email":
        // Save email settings
        console.log("Saving email settings...")
        break
      case "notifications":
        // Save notification settings
        console.log("Saving notification settings...")
        break
      case "backup":
        // Trigger backup
        console.log("Creating backup...")
        break
      case "test-email":
        // Test email configuration
        console.log("Testing email...")
        break
    }
    
    return json({ success: true, message: "Pengaturan berhasil disimpan!" })
  } catch (error) {
    return json({ success: false, message: "Gagal menyimpan pengaturan." }, { status: 400 })
  }
}

export default function Pengaturan() {
  const { settings } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan dan konfigurasi sistem pengelolaan sampah
        </p>
      </div>

      {actionData && (
        <Alert className={actionData.success ? "border-green-500" : "border-red-500"}>
          <Info className="h-4 w-4" />
          <AlertDescription>{actionData.message}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sistem
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{settings.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+5 dari bulan lalu</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sampah</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{settings.totalWaste}</div>
                <p className="text-xs text-muted-foreground">Bulan ini</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{settings.systemUptime}</div>
                <p className="text-xs text-muted-foreground">30 hari terakhir</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">✓</div>
                <p className="text-xs text-muted-foreground">{settings.lastBackup}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status Sistem</CardTitle>
                <CardDescription>Kondisi sistem saat ini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Storage</span>
                  <Badge className="bg-yellow-100 text-yellow-800">75% Used</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>Log aktivitas sistem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Backup otomatis selesai</span>
                    <span className="text-muted-foreground">2 jam lalu</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>User baru terdaftar</span>
                    <span className="text-muted-foreground">4 jam lalu</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Cache dibersihkan</span>
                    <span className="text-muted-foreground">1 hari lalu</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Database dioptimasi</span>
                    <span className="text-muted-foreground">2 hari lalu</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Form method="post">
            <input type="hidden" name="intent" value="general" />
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Aplikasi</CardTitle>
                  <CardDescription>
                    Pengaturan dasar aplikasi dan identitas perusahaan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="appName">Nama Aplikasi</Label>
                      <Input 
                        id="appName" 
                        name="appName" 
                        defaultValue={settings.appName}
                        placeholder="Nama aplikasi Anda"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nama Perusahaan</Label>
                      <Input 
                        id="companyName" 
                        name="companyName" 
                        defaultValue={settings.companyName}
                        placeholder="Nama perusahaan"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appDescription">Deskripsi Aplikasi</Label>
                    <Textarea 
                      id="appDescription" 
                      name="appDescription" 
                      defaultValue={settings.appDescription}
                      placeholder="Deskripsi singkat aplikasi"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
                    <Textarea 
                      id="companyAddress" 
                      name="companyAddress" 
                      defaultValue={settings.companyAddress}
                      placeholder="Alamat lengkap perusahaan"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Telepon</Label>
                      <Input 
                        id="companyPhone" 
                        name="companyPhone" 
                        defaultValue={settings.companyPhone}
                        placeholder="+62 21 xxxxxx"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input 
                        id="companyEmail" 
                        name="companyEmail" 
                        type="email"
                        defaultValue={settings.companyEmail}
                        placeholder="info@company.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Regional</CardTitle>
                  <CardDescription>
                    Zona waktu dan bahasa aplikasi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Waktu</Label>
                      <Select name="timezone" defaultValue={settings.timezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                          <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                          <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Bahasa</Label>
                      <Select name="language" defaultValue={settings.language}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="id">Bahasa Indonesia</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Simpan Pengaturan
                </Button>
              </div>
            </div>
          </Form>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <Form method="post">
            <input type="hidden" name="intent" value="system" />
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Sistem</CardTitle>
                  <CardDescription>
                    Konfigurasi sistem dan keamanan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mode Maintenance</Label>
                      <div className="text-sm text-muted-foreground">
                        Nonaktifkan akses pengguna untuk maintenance
                      </div>
                    </div>
                    <Switch 
                      name="maintenanceMode"
                      defaultChecked={settings.maintenanceMode}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Registrasi Pengguna Baru</Label>
                      <div className="text-sm text-muted-foreground">
                        Izinkan pendaftaran pengguna baru
                      </div>
                    </div>
                    <Switch 
                      name="registrationEnabled"
                      defaultChecked={settings.registrationEnabled}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">Ukuran File Maksimal (MB)</Label>
                      <Input 
                        id="maxFileSize" 
                        name="maxFileSize" 
                        type="number"
                        defaultValue={settings.maxFileSize}
                        min="1"
                        max="100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (menit)</Label>
                      <Input 
                        id="sessionTimeout" 
                        name="sessionTimeout" 
                        type="number"
                        defaultValue={settings.sessionTimeout}
                        min="15"
                        max="480"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tindakan Sistem</CardTitle>
                  <CardDescription>
                    Aksi pemeliharaan dan optimasi sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" type="button">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" type="button">
                      <Database className="h-4 w-4 mr-2" />
                      Optimize Database
                    </Button>
                    <Button variant="outline" type="button">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Simpan Pengaturan
                </Button>
              </div>
            </div>
          </Form>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Form method="post">
            <input type="hidden" name="intent" value="notifications" />
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                  <CardDescription>
                    Pengaturan server email untuk notifikasi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input 
                        id="smtpHost" 
                        name="smtpHost" 
                        defaultValue={settings.smtpHost}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        name="smtpPort" 
                        defaultValue={settings.smtpPort}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input 
                        id="smtpUser" 
                        name="smtpUser" 
                        defaultValue={settings.smtpUser}
                        placeholder="username@gmail.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        name="smtpPassword" 
                        type="password"
                        defaultValue={settings.smtpPassword}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailFrom">Email Pengirim</Label>
                    <Input 
                      id="emailFrom" 
                      name="emailFrom" 
                      defaultValue={settings.emailFrom}
                      placeholder="EcoWaste System <noreply@ecowaste.com>"
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      // Test email function
                      const form = new FormData()
                      form.append("intent", "test-email")
                      fetch("", { method: "POST", body: form })
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Test Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Notifikasi</CardTitle>
                  <CardDescription>
                    Atur jenis notifikasi yang akan dikirim
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Kirim notifikasi melalui email
                        </div>
                      </div>
                      <Switch 
                        name="emailNotifications"
                        defaultChecked={settings.emailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifikasi Pengguna Baru</Label>
                        <div className="text-sm text-muted-foreground">
                          Notifikasi saat ada pengguna baru mendaftar
                        </div>
                      </div>
                      <Switch 
                        name="notifyNewUser"
                        defaultChecked={settings.notifyNewUser}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Alert Sistem</Label>
                        <div className="text-sm text-muted-foreground">
                          Notifikasi untuk masalah sistem dan error
                        </div>
                      </div>
                      <Switch 
                        name="notifySystemAlert"
                        defaultChecked={settings.notifySystemAlert}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Simpan Pengaturan
                </Button>
              </div>
            </div>
          </Form>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>
                  Kelola backup data dan pemulihan sistem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm font-medium">Database</div>
                    <div className="text-xs text-muted-foreground">245 MB</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm font-medium">Files</div>
                    <div className="text-xs text-muted-foreground">1.2 GB</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Settings className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm font-medium">Settings</div>
                    <div className="text-xs text-muted-foreground">2 KB</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Backup Otomatis</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Frekuensi Backup</Label>
                      <Select name="backupFrequency" defaultValue={settings.backupFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Harian</SelectItem>
                          <SelectItem value="weekly">Mingguan</SelectItem>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-3">
                  <Form method="post" style={{ display: 'inline' }}>
                    <input type="hidden" name="intent" value="backup" />
                    <Button type="submit" className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Backup Sekarang
                    </Button>
                  </Form>
                  
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Riwayat Backup</CardTitle>
                <CardDescription>
                  Daftar backup yang tersedia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "2024-01-15 14:30", size: "1.4 GB", status: "success" },
                    { date: "2024-01-14 14:30", size: "1.3 GB", status: "success" },
                    { date: "2024-01-13 14:30", size: "1.3 GB", status: "success" },
                    { date: "2024-01-12 14:30", size: "1.2 GB", status: "failed" },
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${backup.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="text-sm font-medium">{backup.date}</div>
                          <div className="text-xs text-muted-foreground">{backup.size}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}