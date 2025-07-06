import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Users,
  Target,
  TrendingUp,
  Calendar,
  RefreshCw,
  Phone,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Navigation,
  Package,
  Timer,
  Zap
} from "lucide-react";

// Interfaces
interface CollectionArea {
  id: string;
  name: string;
  zone: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed" | "overdue" | "cancelled";
  scheduledTime: string;
  estimatedDuration: number; // minutes
  actualStartTime?: string;
  completedTime?: string;
  assignedTruck: string;
  assignedDriver: string;
  driverContact: string;
  estimatedVolume: number; // kg
  actualVolume?: number; // kg
  households: number;
  lastCollection: string;
  notes?: string;
  coordinates: { lat: number; lng: number };
  urgentIssues?: string[];
}

interface DailyStats {
  totalAreas: number;
  completedAreas: number;
  inProgressAreas: number;
  overdueAreas: number;
  totalTargetVolume: number;
  collectedVolume: number;
  activeTrucks: number;
  availableTrucks: number;
  estimatedCompletion: string;
}

interface TruckStatus {
  id: string;
  driver: string;
  contact: string;
  status: "active" | "available" | "maintenance" | "break";
  currentLocation?: string;
  currentCapacity: number; // percentage
  assignedAreas: string[];
  lastUpdate: string;
}

interface CollectionData {
  date: string;
  stats: DailyStats;
  areas: CollectionArea[];
  trucks: TruckStatus[];
  emergencyContacts: {
    supervisor: string;
    dispatcher: string;
    maintenance: string;
  };
}

export const loader = async (): Promise<Response> => {
  // Mock data - dalam implementasi nyata, ambil dari database
  const today = new Date().toISOString().split("T")[0];

  const collectionData: CollectionData = {
    date: today,
    stats: {
      totalAreas: 18,
      completedAreas: 12,
      inProgressAreas: 4,
      overdueAreas: 2,
      totalTargetVolume: 4500,
      collectedVolume: 3200,
      activeTrucks: 6,
      availableTrucks: 2,
      estimatedCompletion: "16:30"
    },
    areas: [
      {
        id: "area-001",
        name: "Kelurahan Merdeka Blok A",
        zone: "Zona Utara",
        priority: "high",
        status: "overdue",
        scheduledTime: "07:00",
        estimatedDuration: 90,
        assignedTruck: "B-001",
        assignedDriver: "Budi Santoso",
        driverContact: "081234567890",
        estimatedVolume: 280,
        actualVolume: 245,
        households: 120,
        lastCollection: "2025-07-05",
        coordinates: { lat: -6.2088, lng: 106.8456 },
        urgentIssues: ["Jalan rusak", "Akses terbatas"],
        actualStartTime: "07:15",
        completedTime: "09:00"
      },
      {
        id: "area-002",
        name: "Komplek Permata Indah",
        zone: "Zona Selatan",
        priority: "medium",
        status: "in-progress",
        scheduledTime: "08:30",
        estimatedDuration: 60,
        assignedTruck: "B-003",
        assignedDriver: "Sari Dewi",
        driverContact: "081234567891",
        estimatedVolume: 180,
        households: 85,
        lastCollection: "2025-07-05",
        coordinates: { lat: -6.22, lng: 106.83 },
        actualStartTime: "08:45"
      },
      {
        id: "area-003",
        name: "Jl. Sudirman Raya",
        zone: "Zona Tengah",
        priority: "high",
        status: "overdue",
        scheduledTime: "09:00",
        estimatedDuration: 120,
        assignedTruck: "B-004",
        assignedDriver: "Dedi Kurniawan",
        driverContact: "081234567892",
        estimatedVolume: 350,
        households: 200,
        lastCollection: "2025-07-04",
        coordinates: { lat: -6.215, lng: 106.84 },
        urgentIssues: ["Volume sangat tinggi", "Kemacetan akses"],
        notes: "Perlu 2 trip untuk mengangkut semua"
      },
      {
        id: "area-004",
        name: "Perumahan Indah Permai",
        zone: "Zona Timur",
        priority: "medium",
        status: "completed",
        scheduledTime: "10:00",
        estimatedDuration: 75,
        assignedTruck: "B-002",
        assignedDriver: "Andi Wijaya",
        driverContact: "081234567893",
        estimatedVolume: 200,
        actualVolume: 195,
        households: 95,
        lastCollection: "2025-07-05",
        coordinates: { lat: -6.195, lng: 106.86 },
        actualStartTime: "10:15",
        completedTime: "11:30"
      },
      {
        id: "area-005",
        name: "Pasar Tradisional Sentral",
        zone: "Zona Tengah",
        priority: "high",
        status: "in-progress",
        scheduledTime: "11:30",
        estimatedDuration: 45,
        assignedTruck: "B-005",
        assignedDriver: "Rini Astuti",
        driverContact: "081234567894",
        estimatedVolume: 420,
        households: 50,
        lastCollection: "2025-07-05",
        coordinates: { lat: -6.21, lng: 106.835 },
        actualStartTime: "11:45",
        notes: "Sampah organik tinggi dari pasar"
      },
      {
        id: "area-006",
        name: "Cluster Villa Harmoni",
        zone: "Zona Barat",
        priority: "low",
        status: "pending",
        scheduledTime: "13:00",
        estimatedDuration: 60,
        assignedTruck: "B-006",
        assignedDriver: "Toni Setiawan",
        driverContact: "081234567895",
        estimatedVolume: 150,
        households: 75,
        lastCollection: "2025-07-05",
        coordinates: { lat: -6.205, lng: 106.82 }
      }
    ],
    trucks: [
      {
        id: "B-001",
        driver: "Budi Santoso",
        contact: "081234567890",
        status: "active",
        currentLocation: "Kelurahan Merdeka",
        currentCapacity: 85,
        assignedAreas: ["area-001"],
        lastUpdate: "10 menit yang lalu"
      },
      {
        id: "B-002",
        driver: "Andi Wijaya",
        contact: "081234567893",
        status: "available",
        currentLocation: "Pool Kendaraan",
        currentCapacity: 0,
        assignedAreas: ["area-004"],
        lastUpdate: "5 menit yang lalu"
      },
      {
        id: "B-003",
        driver: "Sari Dewi",
        contact: "081234567891",
        status: "active",
        currentLocation: "Komplek Permata",
        currentCapacity: 60,
        assignedAreas: ["area-002"],
        lastUpdate: "2 menit yang lalu"
      },
      {
        id: "B-004",
        driver: "Dedi Kurniawan",
        contact: "081234567892",
        status: "active",
        currentLocation: "Dalam perjalanan",
        currentCapacity: 0,
        assignedAreas: ["area-003"],
        lastUpdate: "15 menit yang lalu"
      },
      {
        id: "B-005",
        driver: "Rini Astuti",
        contact: "081234567894",
        status: "active",
        currentLocation: "Pasar Sentral",
        currentCapacity: 40,
        assignedAreas: ["area-005"],
        lastUpdate: "1 menit yang lalu"
      },
      {
        id: "B-006",
        driver: "Toni Setiawan",
        contact: "081234567895",
        status: "available",
        currentLocation: "Pool Kendaraan",
        currentCapacity: 0,
        assignedAreas: ["area-006"],
        lastUpdate: "30 menit yang lalu"
      }
    ],
    emergencyContacts: {
      supervisor: "081234560001",
      dispatcher: "081234560002",
      maintenance: "081234560003"
    }
  };

  return json(collectionData);
};

export default function PengumpulanHarian() {
  const data = useLoaderData<CollectionData>();
  const [selectedArea, setSelectedArea] = useState<CollectionArea | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Filter areas
  const filteredAreas = data.areas.filter((area) => {
    const statusMatch = filterStatus === "all" || area.status === filterStatus;
    const priorityMatch =
      filterPriority === "all" || area.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // Calculate progress percentage
  const progressPercentage = Math.round(
    (data.stats.completedAreas / data.stats.totalAreas) * 100
  );
  const volumePercentage = Math.round(
    (data.stats.collectedVolume / data.stats.totalTargetVolume) * 100
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Selesai
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Berlangsung
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "overdue":
        return <Badge variant="destructive">Terlambat</Badge>;
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600">
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Tinggi</Badge>;
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Sedang
          </Badge>
        );
      case "low":
        return <Badge variant="secondary">Rendah</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-gray-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTruckStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Aktif
          </Badge>
        );
      case "available":
        return <Badge variant="secondary">Tersedia</Badge>;
      case "maintenance":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Maintenance
          </Badge>
        );
      case "break":
        return <Badge variant="outline">Istirahat</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Pengumpulan Harian
            <Badge variant="destructive" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              URGENT
            </Badge>
          </h2>
          <p className="text-muted-foreground">
            Monitoring dan koordinasi pengumpulan sampah -{" "}
            {new Date(data.date).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Emergency
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emergency Response</AlertDialogTitle>
                <AlertDialogDescription>
                  Hubungi kontak darurat untuk situasi mendesak
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Supervisor</p>
                    <p className="text-sm text-gray-500">
                      {data.emergencyContacts.supervisor}
                    </p>
                  </div>
                  <Button size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Dispatcher</p>
                    <p className="text-sm text-gray-500">
                      {data.emergencyContacts.dispatcher}
                    </p>
                  </div>
                  <Button size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Maintenance</p>
                    <p className="text-sm text-gray-500">
                      {data.emergencyContacts.maintenance}
                    </p>
                  </div>
                  <Button size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Tutup</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Area
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progress Harian
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.completedAreas}/{data.stats.totalAreas}
            </div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressPercentage}% area selesai • Est. selesai{" "}
              {data.stats.estimatedCompletion}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Volume Terkumpul
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.collectedVolume.toLocaleString()} kg
            </div>
            <Progress value={volumePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {volumePercentage}% dari target (
              {data.stats.totalTargetVolume.toLocaleString()} kg)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Truk</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.activeTrucks}/
              {data.stats.activeTrucks + data.stats.availableTrucks}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">{data.stats.activeTrucks} Aktif</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs">
                  {data.stats.availableTrucks} Tersedia
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Area Terlambat
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.stats.overdueAreas}
            </div>
            <div className="text-xs text-red-600 mt-2 font-medium">
              Perlu penanganan segera
            </div>
            <div className="text-xs text-muted-foreground">
              {data.stats.inProgressAreas} area sedang dikerjakan
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="status-filter">Status:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="in-progress">Berlangsung</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="priority-filter">Prioritas:</Label>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            Map
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="areas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="areas">Area Pengumpulan</TabsTrigger>
          <TabsTrigger value="trucks">Status Truk</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Hari Ini</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="space-y-4">
          <div className="grid gap-4">
            {filteredAreas.map((area) => (
              <Card
                key={area.id}
                className={`${
                  area.status === "overdue" ? "border-red-200 bg-red-50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(area.status)}
                      <div>
                        <CardTitle className="text-lg">{area.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>{area.zone}</span>
                          <span>•</span>
                          <span>{area.households} rumah</span>
                          <span>•</span>
                          <span>Truk {area.assignedTruck}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(area.priority)}
                      {getStatusBadge(area.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Jadwal & Progress
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>Target: {area.scheduledTime}</span>
                        </div>
                        {area.actualStartTime && (
                          <div className="flex items-center space-x-2">
                            <Timer className="h-3 w-3" />
                            <span>Mulai: {area.actualStartTime}</span>
                          </div>
                        )}
                        {area.completedTime && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>Selesai: {area.completedTime}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Package className="h-3 w-3" />
                          <span>
                            {area.actualVolume
                              ? `${area.actualVolume} kg`
                              : `Est. ${area.estimatedVolume} kg`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">
                        Driver & Kontak
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-3 w-3" />
                          <span>{area.assignedDriver}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span>{area.driverContact}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="h-3 w-3" />
                          <span>Truk {area.assignedTruck}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Actions</div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Navigation className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Update Status - {area.name}
                              </DialogTitle>
                              <DialogDescription>
                                Update status pengumpulan dan informasi terkait
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="status">Status</Label>
                                <Select defaultValue={area.status}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      Menunggu
                                    </SelectItem>
                                    <SelectItem value="in-progress">
                                      Berlangsung
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      Selesai
                                    </SelectItem>
                                    <SelectItem value="overdue">
                                      Terlambat
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      Dibatalkan
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="volume">
                                  Volume Aktual (kg)
                                </Label>
                                <Input
                                  id="volume"
                                  type="number"
                                  defaultValue={
                                    area.actualVolume || area.estimatedVolume
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="notes">Catatan</Label>
                                <Input
                                  id="notes"
                                  defaultValue={area.notes || ""}
                                  placeholder="Tambahkan catatan..."
                                />
                              </div>
                              <Button className="w-full">Update Status</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  {area.urgentIssues && area.urgentIssues.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          Isu Mendesak:
                        </span>
                      </div>
                      <ul className="text-sm text-red-700 space-y-1">
                        {area.urgentIssues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {area.notes && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="text-sm text-blue-800">
                        <strong>Catatan:</strong> {area.notes}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trucks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {data.trucks.map((truck) => (
              <Card key={truck.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-6 w-6" />
                      <div>
                        <CardTitle>Truk {truck.id}</CardTitle>
                        <CardDescription>{truck.driver}</CardDescription>
                      </div>
                    </div>
                    {getTruckStatusBadge(truck.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Kapasitas:</span>
                      <span className="text-sm font-medium">
                        {truck.currentCapacity}%
                      </span>
                    </div>
                    <Progress value={truck.currentCapacity} />

                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{truck.currentLocation}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        Update: {truck.lastUpdate}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Navigation className="h-3 w-3 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline Pengumpulan Hari Ini</CardTitle>
              <CardDescription>
                Jadwal dan progress pengumpulan sampah realtime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {data.areas
                    .sort((a, b) =>
                      a.scheduledTime.localeCompare(b.scheduledTime)
                    )
                    .map((area, index) => (
                      <div
                        key={area.id}
                        className="flex items-start space-x-4 pb-4 border-b last:border-b-0"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(area.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{area.name}</h4>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(area.priority)}
                              {getStatusBadge(area.status)}
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {area.scheduledTime} • {area.assignedDriver} • Truk{" "}
                            {area.assignedTruck}
                          </div>
                          {area.actualStartTime && (
                            <div className="mt-1 text-xs text-blue-600">
                              Dimulai: {area.actualStartTime}
                            </div>
                          )}
                          {area.completedTime && (
                            <div className="mt-1 text-xs text-green-600">
                              Selesai: {area.completedTime} • Volume:{" "}
                              {area.actualVolume} kg
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
