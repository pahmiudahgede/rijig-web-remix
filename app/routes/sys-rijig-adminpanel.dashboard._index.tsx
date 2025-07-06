import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  BarChart3,
  Users,
  Recycle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  MapPin,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export const loader = async () => {
  const dashboardData = {
    stats: {
      totalUsers: 1234,
      totalWaste: 5678,
      totalRevenue: 98765,
      activeCollectors: 45
    },
    recentTransactions: [
      {
        id: 1,
        user: "Ahmad Rizki",
        type: "Plastik",
        amount: 15000,
        time: "2 menit lalu"
      },
      {
        id: 2,
        user: "Siti Nurhaliza",
        type: "Kertas",
        amount: 8500,
        time: "5 menit lalu"
      },
      {
        id: 3,
        user: "Budi Santoso",
        type: "Logam",
        amount: 25000,
        time: "10 menit lalu"
      },
      {
        id: 4,
        user: "Diana Putri",
        type: "Plastik",
        amount: 12000,
        time: "15 menit lalu"
      }
    ],
    wasteStats: [
      { type: "Plastik", percentage: 45, color: "bg-blue-500" },
      { type: "Kertas", percentage: 30, color: "bg-green-500" },
      { type: "Logam", percentage: 15, color: "bg-yellow-500" },
      { type: "Organik", percentage: 10, color: "bg-red-500" }
    ],
    alerts: [
      {
        id: 1,
        message: "Kapasitas gudang Pengepul A mencapai 85%",
        type: "warning",
        time: "1 jam lalu"
      },
      {
        id: 2,
        message: "Harga plastik naik 15% hari ini",
        type: "info",
        time: "2 jam lalu"
      },
      {
        id: 3,
        message: "5 pengepul baru menunggu verifikasi",
        type: "urgent",
        time: "3 jam lalu"
      }
    ]
  };

  return json({ dashboardData });
};

export default function AdminDashboard() {
  const { dashboardData } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola ekosistem pengelolaan sampah secara terpadu
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <TrendingUp className="h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Pengguna
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {dashboardData.stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Sampah (kg)
            </CardTitle>
            <Recycle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {dashboardData.stats.totalWaste.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              Rp {dashboardData.stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +23% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Pengepul Aktif
            </CardTitle>
            <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {dashboardData.stats.activeCollectors}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" />
              -2% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Transaksi Terbaru
            </CardTitle>
            <CardDescription>
              Aktivitas transaksi sampah dalam 24 jam terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Recycle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.user}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      Rp {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {transaction.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Lihat Semua Transaksi
            </Button>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Waste Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribusi Jenis Sampah</CardTitle>
              <CardDescription>Persentase berdasarkan volume</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.wasteStats.map((waste, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{waste.type}</span>
                    <span className="text-gray-500">{waste.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${waste.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${waste.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Notifikasi Penting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-800 border-l-yellow-500"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {alert.message}
                    </p>
                    <Badge
                      variant={
                        alert.type === "urgent" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Aksi cepat untuk mengelola sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Users className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Kelola User</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Recycle className="h-6 w-6 text-green-600" />
              <span className="text-sm">Data Sampah</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Laporan</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <MapPin className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Peta Lokasi</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
