import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
import {
  Truck,
  Users,
  MapPin,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Recycle,
  Package
} from "lucide-react";

// Interface untuk activity
interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  status: string;
  driver?: string;
  volume?: string;
  estimatedComplete?: string;
  estimatedVolume?: string;
  reason?: string;
}

interface Truck {
  id: string;
  driver: string;
  status: string;
  location: string;
  capacity: string;
  lastUpdate: string;
}

interface WeeklyProgress {
  day: string;
  target: number;
  actual: number;
}

interface DashboardData {
  stats: {
    totalSampahHariIni: number;
    targetHarian: number;
    trukAktif: number;
    totalTruk: number;
    pegawaiAktif: number;
    totalPegawai: number;
    wilayahTerlayani: number;
    totalWilayah: number;
  };
  recentActivities: Activity[];
  trucks: Truck[];
  weeklyProgress: WeeklyProgress[];
}

// Loader untuk mengambil data dashboard
export const loader = async (): Promise<Response> => {
  // Mock data - dalam implementasi nyata, ambil dari database
  const dashboardData: DashboardData = {
    stats: {
      totalSampahHariIni: 2450, // kg
      targetHarian: 3000, // kg
      trukAktif: 8,
      totalTruk: 12,
      pegawaiAktif: 24,
      totalPegawai: 30,
      wilayahTerlayani: 15,
      totalWilayah: 18
    },
    recentActivities: [
      {
        id: 1,
        type: "pickup",
        title: "Pengangkutan selesai di Kelurahan Merdeka",
        time: "10 menit yang lalu",
        status: "completed",
        driver: "Budi Santoso",
        volume: "245 kg"
      },
      {
        id: 2,
        type: "maintenance",
        title: "Truk B-002 menjalani maintenance rutin",
        time: "1 jam yang lalu",
        status: "in-progress",
        estimatedComplete: "14:00"
      },
      {
        id: 3,
        type: "pickup",
        title: "Pengangkutan dimulai di Komplek Permata",
        time: "2 jam yang lalu",
        status: "in-progress",
        driver: "Andi Wijaya",
        estimatedVolume: "180 kg"
      },
      {
        id: 4,
        type: "alert",
        title: "Jadwal pengangkutan tertunda di Jl. Sudirman",
        time: "3 jam yang lalu",
        status: "warning",
        reason: "Kemacetan lalu lintas"
      }
    ],
    trucks: [
      {
        id: "B-001",
        driver: "Budi Santoso",
        status: "active",
        location: "Kelurahan Merdeka",
        capacity: "85%",
        lastUpdate: "5 menit yang lalu"
      },
      {
        id: "B-002",
        driver: "Andi Wijaya",
        status: "maintenance",
        location: "Workshop",
        capacity: "0%",
        lastUpdate: "1 jam yang lalu"
      },
      {
        id: "B-003",
        driver: "Sari Dewi",
        status: "active",
        location: "Komplek Permata",
        capacity: "60%",
        lastUpdate: "15 menit yang lalu"
      },
      {
        id: "B-004",
        driver: "Dedi Kurniawan",
        status: "idle",
        location: "Pool Kendaraan",
        capacity: "0%",
        lastUpdate: "2 jam yang lalu"
      }
    ],
    weeklyProgress: [
      { day: "Sen", target: 3000, actual: 2800 },
      { day: "Sel", target: 3000, actual: 3200 },
      { day: "Rab", target: 3000, actual: 2950 },
      { day: "Kam", target: 3000, actual: 3100 },
      { day: "Jum", target: 3000, actual: 2750 },
      { day: "Sab", target: 2500, actual: 2450 },
      { day: "Min", target: 2000, actual: 0 } // hari ini
    ]
  };

  return json(dashboardData);
};

export default function PengelolaDashboard() {
  const data = useLoaderData<DashboardData>();

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
      case "warning":
        return <Badge variant="destructive">Peringatan</Badge>;
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Aktif
          </Badge>
        );
      case "maintenance":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Maintenance
          </Badge>
        );
      case "idle":
        return <Badge variant="secondary">Standby</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "pickup":
        return <Truck className="h-4 w-4" />;
      case "maintenance":
        return <AlertTriangle className="h-4 w-4" />;
      case "alert":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const progressPercentage = Math.round(
    (data.stats.totalSampahHariIni / data.stats.targetHarian) * 100
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Header Dashboard */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Pengelola
        </h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Jadwal Hari Ini
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Laporan
          </Button>
        </div>
      </div>

      {/* Cards Statistik Utama */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sampah Terkumpul Hari Ini
            </CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.totalSampahHariIni.toLocaleString()} kg
            </div>
            <Progress value={progressPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressPercentage}% dari target (
              {data.stats.targetHarian.toLocaleString()} kg)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Truk Operasional
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.trukAktif}/{data.stats.totalTruk}
            </div>
            <Progress
              value={(data.stats.trukAktif / data.stats.totalTruk) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((data.stats.trukAktif / data.stats.totalTruk) * 100)}%
              truk sedang beroperasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pegawai Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.pegawaiAktif}/{data.stats.totalPegawai}
            </div>
            <Progress
              value={(data.stats.pegawaiAktif / data.stats.totalPegawai) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(
                (data.stats.pegawaiAktif / data.stats.totalPegawai) * 100
              )}
              % pegawai sedang bertugas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wilayah Terlayani
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.stats.wilayahTerlayani}/{data.stats.totalWilayah}
            </div>
            <Progress
              value={
                (data.stats.wilayahTerlayani / data.stats.totalWilayah) * 100
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(
                (data.stats.wilayahTerlayani / data.stats.totalWilayah) * 100
              )}
              % wilayah tercover hari ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs untuk konten detail */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Aktivitas Terbaru</TabsTrigger>
          <TabsTrigger value="trucks">Status Truk</TabsTrigger>
          <TabsTrigger value="performance">Performa Mingguan</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Pantau semua aktivitas operasional secara real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        {activity.driver && (
                          <span className="text-xs text-gray-500">
                            • Driver: {activity.driver}
                          </span>
                        )}
                        {activity.volume && (
                          <span className="text-xs text-gray-500">
                            • {activity.volume}
                          </span>
                        )}
                        {activity.estimatedVolume && (
                          <span className="text-xs text-gray-500">
                            • Est: {activity.estimatedVolume}
                          </span>
                        )}
                        {activity.estimatedComplete && (
                          <span className="text-xs text-gray-500">
                            • Selesai: {activity.estimatedComplete}
                          </span>
                        )}
                        {activity.reason && (
                          <span className="text-xs text-gray-500">
                            • {activity.reason}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trucks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Truk Real-time</CardTitle>
              <CardDescription>
                Monitor kondisi dan lokasi semua armada truk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trucks.map((truck) => (
                  <div
                    key={truck.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Truck className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{truck.id}</h4>
                        <p className="text-sm text-gray-500">
                          Driver: {truck.driver}
                        </p>
                        <p className="text-xs text-gray-400">
                          Update: {truck.lastUpdate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusBadge(truck.status)}
                      </div>
                      <p className="text-sm text-gray-600">{truck.location}</p>
                      <p className="text-xs text-gray-500">
                        Kapasitas: {truck.capacity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performa Mingguan</CardTitle>
              <CardDescription>
                Pencapaian target pengumpulan sampah minggu ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.weeklyProgress.map((day, index) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium w-8">{day.day}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            Target: {day.target.toLocaleString()} kg
                          </span>
                          <span className="text-sm">
                            Actual: {day.actual.toLocaleString()} kg
                          </span>
                        </div>
                        <Progress
                          value={
                            day.actual > 0 ? (day.actual / day.target) * 100 : 0
                          }
                          className="mt-1 h-2"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {day.actual >= day.target ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : day.actual > 0 ? (
                        <TrendingDown className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">
                        {day.actual > 0
                          ? `${Math.round((day.actual / day.target) * 100)}%`
                          : "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
