import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
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
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Layers,
  Route,
  Target,
  Truck,
  Recycle,
  Building,
  Users,
  Navigation,
  Download,
  Info
} from "lucide-react";
import { LeafletMap } from "~/components/map/leaflet-map";

// Mock data untuk lokasi
const mockLocations = [
  {
    id: "1",
    name: "TPS Kelurahan Menteng",
    type: "tps",
    address: "Jl. Menteng Raya No. 45, Jakarta Pusat",
    coordinates: [-6.1944, 106.8229] as [number, number],
    status: "active",
    capacity: 500,
    currentLoad: 320,
    lastPickup: "2024-01-15 08:30",
    coverage: "Menteng, Gondangdia",
    population: 15000,
    schedule: "Senin, Rabu, Jumat"
  },
  {
    id: "2",
    name: "TPS Kelurahan Cikini",
    type: "tps",
    address: "Jl. Cikini Raya No. 12, Jakarta Pusat",
    coordinates: [-6.1889, 106.8317] as [number, number],
    status: "active",
    capacity: 300,
    currentLoad: 180,
    lastPickup: "2024-01-15 09:15",
    coverage: "Cikini, Pegangsaan",
    population: 12000,
    schedule: "Selasa, Kamis, Sabtu"
  },
  {
    id: "3",
    name: "Rumah Kompos Kemayoran",
    type: "composting",
    address: "Jl. Kemayoran No. 88, Jakarta Pusat",
    coordinates: [-6.1725, 106.8584] as [number, number],
    status: "maintenance",
    capacity: 1000,
    currentLoad: 450,
    lastPickup: "2024-01-14 16:00",
    coverage: "Kemayoran, Senen",
    population: 25000,
    schedule: "Harian"
  },
  {
    id: "4",
    name: "Bank Sampah Tanah Abang",
    type: "waste_bank",
    address: "Jl. Tanah Abang II No. 67, Jakarta Pusat",
    coordinates: [-6.1822, 106.8142] as [number, number],
    status: "active",
    capacity: 200,
    currentLoad: 95,
    lastPickup: "2024-01-15 14:20",
    coverage: "Tanah Abang",
    population: 8000,
    schedule: "Senin, Kamis"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock statistics
  const stats = {
    totalLocations: mockLocations.length,
    activeLocations: mockLocations.filter((l) => l.status === "active").length,
    totalPopulation: mockLocations.reduce((sum, l) => sum + l.population, 0),
    averageLoad: Math.round(
      mockLocations.reduce(
        (sum, l) => sum + (l.currentLoad / l.capacity) * 100,
        0
      ) / mockLocations.length
    ),
    coverageArea: "45.2 km²"
  };

  return json({ locations: mockLocations, stats });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    switch (intent) {
      case "add-location":
        console.log("Adding new location...");
        break;
      case "edit-location":
        console.log("Editing location...");
        break;
      case "delete-location":
        console.log("Deleting location...");
        break;
    }

    return json({ success: true, message: "Operasi berhasil!" });
  } catch (error) {
    return json(
      { success: false, message: "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}

export default function AreaCoverage() {
  const { locations, stats } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof mockLocations)[0] | null
  >(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredLocations = locations.filter((location) => {
    const matchesFilter =
      filter === "all" ||
      location.type === filter ||
      location.status === filter;
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tps":
        return <Building className="h-4 w-4" />;
      case "composting":
        return <Recycle className="h-4 w-4" />;
      case "waste_bank":
        return <Target className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "tps":
        return "TPS";
      case "composting":
        return "Kompos";
      case "waste_bank":
        return "Bank Sampah";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Area Coverage</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau area cakupan layanan pengelolaan sampah
        </p>
      </div>

      {actionData && (
        <Alert
          className={actionData.success ? "border-green-500" : "border-red-500"}
        >
          <Info className="h-4 w-4" />
          <AlertDescription>{actionData.message}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lokasi</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLocations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lokasi Aktif</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeLocations}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Penduduk
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPopulation.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Load
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageLoad}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Area Cakupan</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coverageArea}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Lokasi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Lokasi Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan lokasi pengelolaan sampah baru
                </DialogDescription>
              </DialogHeader>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="add-location" />

                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lokasi</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="TPS Kelurahan..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Lokasi</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tps">
                        TPS (Tempat Pembuangan Sementara)
                      </SelectItem>
                      <SelectItem value="composting">Rumah Kompos</SelectItem>
                      <SelectItem value="waste_bank">Bank Sampah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Alamat lengkap..."
                    required
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder="-6.1944"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder="106.8229"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasitas (kg)</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      placeholder="500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="population">Populasi Dilayani</Label>
                    <Input
                      id="population"
                      name="population"
                      type="number"
                      placeholder="15000"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit">Tambah Lokasi</Button>
                </div>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="map" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Peta Area Coverage</CardTitle>
                      <CardDescription>
                        Sebaran lokasi pengelolaan sampah di area Jakarta Pusat
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Layers className="h-4 w-4 mr-2" />
                        Layers
                      </Button>
                      <Button variant="outline" size="sm">
                        <Route className="h-4 w-4 mr-2" />
                        Routes
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <LeafletMap
                    locations={filteredLocations}
                    onLocationSelect={setSelectedLocation}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Location Details Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Detail Lokasi</CardTitle>
                  <CardDescription>
                    {selectedLocation
                      ? "Informasi lokasi terpilih"
                      : "Pilih lokasi di peta untuk melihat detail"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedLocation ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(selectedLocation.type)}
                          <h3 className="font-semibold">
                            {selectedLocation.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedLocation.address}
                        </p>
                      </div>

                      <Separator />

                      <div className="grid gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Status</span>
                          <Badge
                            variant={
                              selectedLocation.status === "active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {selectedLocation.status}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tipe</span>
                          <span className="text-sm">
                            {getTypeLabel(selectedLocation.type)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Kapasitas</span>
                          <span className="text-sm">
                            {selectedLocation.capacity} kg
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Load Saat Ini
                          </span>
                          <span className="text-sm">
                            {Math.round(
                              (selectedLocation.currentLoad /
                                selectedLocation.capacity) *
                                100
                            )}
                            %
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                (selectedLocation.currentLoad /
                                  selectedLocation.capacity) *
                                100
                              }%`
                            }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Populasi Dilayani
                          </span>
                          <span className="text-sm">
                            {selectedLocation.population.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Pickup Terakhir
                          </span>
                          <span className="text-sm">
                            {selectedLocation.lastPickup}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Jadwal</span>
                          <span className="text-sm">
                            {selectedLocation.schedule}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Navigation className="h-3 w-3 mr-1" />
                          Navigate
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Klik pada marker di peta untuk melihat detail lokasi
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari lokasi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Lokasi</SelectItem>
                    <SelectItem value="tps">TPS</SelectItem>
                    <SelectItem value="composting">Rumah Kompos</SelectItem>
                    <SelectItem value="waste_bank">Bank Sampah</SelectItem>
                    <SelectItem value="active">Status: Aktif</SelectItem>
                    <SelectItem value="maintenance">
                      Status: Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location) => (
              <Card
                key={location.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(location.type)}
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        location.status === "active" ? "default" : "destructive"
                      }
                    >
                      {location.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {location.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Tipe:</span>
                      <span>{getTypeLabel(location.type)}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Load:</span>
                        <span>
                          {Math.round(
                            (location.currentLoad / location.capacity) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              (location.currentLoad / location.capacity) * 100
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Populasi:</span>
                      <span>{location.population.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Pickup Terakhir:</span>
                      <span>{location.lastPickup}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Detail
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
