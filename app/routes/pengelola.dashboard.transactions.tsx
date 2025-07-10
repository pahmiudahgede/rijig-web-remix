// app/routes/dashboard.pencatatan.tsx
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useFetcher } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Separator } from "~/components/ui/separator";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Receipt,
  Users,
  Scale,
  Calendar,
  MapPin
} from "lucide-react";
import { useState } from "react";

// Loader untuk mengambil data
export async function loader({ request }: LoaderFunctionArgs) {
  // Simulasi data - ganti dengan query database Anda
  const wasteRecords = [
    {
      id: "WR-001",
      date: "2024-07-10",
      collectorName: "Budi Santoso",
      collectorPhone: "+62 812 3456 7890",
      wasteType: "Plastik PET",
      weight: 150.5,
      pricePerKg: 3500,
      totalPrice: 526750,
      location: "Kelurahan Kebayoran",
      status: "completed",
      notes: "Kondisi baik, sudah dipilah"
    },
    {
      id: "WR-002", 
      date: "2024-07-09",
      collectorName: "Siti Rahayu",
      collectorPhone: "+62 813 9876 5432",
      wasteType: "Kardus",
      weight: 200.0,
      pricePerKg: 2800,
      totalPrice: 560000,
      location: "Kelurahan Menteng",
      status: "pending",
      notes: "Perlu pengecekan kualitas"
    },
    {
      id: "WR-003",
      date: "2024-07-08", 
      collectorName: "Ahmad Wijaya",
      collectorPhone: "+62 814 1122 3344",
      wasteType: "Kaleng Aluminium",
      weight: 75.2,
      pricePerKg: 8500,
      totalPrice: 639200,
      location: "Kelurahan Cempaka Putih",
      status: "completed",
      notes: "Kualitas premium"
    }
  ];

  const wasteTypes = [
    "Plastik PET",
    "Kardus", 
    "Kaleng Aluminium",
    "Kertas",
    "Plastik HDPE",
    "Besi/Logam",
    "Kaca"
  ];

  const collectors = [
    { name: "Budi Santoso", phone: "+62 812 3456 7890" },
    { name: "Siti Rahayu", phone: "+62 813 9876 5432" },
    { name: "Ahmad Wijaya", phone: "+62 814 1122 3344" }
  ];

  return json({ wasteRecords, wasteTypes, collectors });
}

// Action untuk handle form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "createRecord") {
    const recordData = {
      collectorName: formData.get("collectorName"),
      collectorPhone: formData.get("collectorPhone"),
      wasteType: formData.get("wasteType"),
      weight: parseFloat(formData.get("weight") as string),
      pricePerKg: parseFloat(formData.get("pricePerKg") as string),
      location: formData.get("location"),
      notes: formData.get("notes")
    };

    // Simulasi create - ganti dengan insert database Anda
    console.log("Creating waste record:", recordData);
    
    return json({ success: true, message: "Pencatatan sampah berhasil disimpan" });
  }

  return json({ success: false, message: "Invalid action" });
}

export default function WasteRecordingPage() {
  const { wasteRecords, wasteTypes, collectors } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const isSubmitting = navigation.state === "submitting";

  // Filter records
  const filteredRecords = wasteRecords.filter(record => {
    const matchesSearch = record.collectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || record.wasteType === selectedType;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-600">Selesai</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pencatatan Sampah</h1>
          <p className="text-muted-foreground mt-2">
            Catat pembelian sampah dari pengepul dan kelola transaksi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Form Input */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <CardTitle>Tambah Pencatatan</CardTitle>
              </div>
              <CardDescription>
                Input data pembelian sampah baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="createRecord" />
                
                <div className="space-y-2">
                  <Label htmlFor="collectorName">Nama Pengepul</Label>
                  <Select name="collectorName">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pengepul" />
                    </SelectTrigger>
                    <SelectContent>
                      {collectors.map((collector) => (
                        <SelectItem key={collector.name} value={collector.name}>
                          {collector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collectorPhone">No. Telepon</Label>
                  <Input
                    id="collectorPhone"
                    name="collectorPhone"
                    placeholder="+62 812 xxxx xxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteType">Jenis Sampah</Label>
                  <Select name="wasteType">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis sampah" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Berat (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerKg">Harga per Kg (Rp)</Label>
                  <Input
                    id="pricePerKg"
                    name="pricePerKg"
                    type="number"
                    placeholder="3500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Kelurahan/Daerah"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Catatan kondisi atau kualitas sampah..."
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  <Receipt className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Menyimpan..." : "Simpan Pencatatan"}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Transaksi</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Berat</span>
                <span className="font-semibold">425.7 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Nilai</span>
                <span className="font-semibold text-green-600">Rp 1.725.950</span>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Data per {new Date().toLocaleDateString('id-ID')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Records Table */}
        <div className="xl:col-span-3 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari berdasarkan pengepul, jenis sampah, atau ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Jenis Sampah" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      {wasteTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Riwayat Pencatatan</CardTitle>
                  <CardDescription>
                    Daftar transaksi pembelian sampah dari pengepul
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {filteredRecords.length} dari {wasteRecords.length} records
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pengepul</TableHead>
                      <TableHead>Jenis Sampah</TableHead>
                      <TableHead>Berat (kg)</TableHead>
                      <TableHead>Harga/kg</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                          Tidak ada data yang ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(record.date).toLocaleDateString('id-ID')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.collectorName}</div>
                              <div className="text-sm text-muted-foreground">{record.collectorPhone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{record.wasteType}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Scale className="h-4 w-4 text-muted-foreground" />
                              {record.weight}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(record.pricePerKg)}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(record.totalPrice)}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}