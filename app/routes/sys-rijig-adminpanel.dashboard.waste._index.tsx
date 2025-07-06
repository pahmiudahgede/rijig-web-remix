import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Recycle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

export const loader = async () => {
  const wasteData = {
    summary: {
      totalTypes: 24,
      totalVolume: 5678,
      avgPrice: 2500,
      trending: "up"
    },
    wasteTypes: [
      {
        id: 1,
        name: "Plastik PET",
        category: "Plastik",
        currentPrice: 3000,
        priceChange: "+5%",
        volume: 1500,
        trend: "up",
        status: "active"
      },
      {
        id: 2,
        name: "Kertas HVS",
        category: "Kertas",
        currentPrice: 2000,
        priceChange: "-2%",
        volume: 2100,
        trend: "down",
        status: "active"
      },
      {
        id: 3,
        name: "Aluminium",
        category: "Logam",
        currentPrice: 8500,
        priceChange: "+12%",
        volume: 450,
        trend: "up",
        status: "active"
      },
      {
        id: 4,
        name: "Plastik HDPE",
        category: "Plastik",
        currentPrice: 2800,
        priceChange: "+3%",
        volume: 900,
        trend: "up",
        status: "active"
      },
      {
        id: 5,
        name: "Kertas Karton",
        category: "Kertas",
        currentPrice: 1500,
        priceChange: "0%",
        volume: 1200,
        trend: "stable",
        status: "active"
      }
    ]
  };

  return json({ wasteData });
};

export default function WasteManagement() {
  const { wasteData } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manajemen Data Sampah
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola jenis sampah, harga, dan volume transaksi
          </p>
        </div>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          Tambah Jenis Sampah
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jenis</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wasteData.summary.totalTypes}
            </div>
            <p className="text-xs text-muted-foreground">
              jenis sampah terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wasteData.summary.totalVolume.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">kg bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Harga
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {wasteData.summary.avgPrice.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">per kilogram</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trend Harga</CardTitle>
            {wasteData.summary.trending === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Naik</div>
            <p className="text-xs text-muted-foreground">
              dibanding bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar Jenis Sampah</CardTitle>
              <CardDescription>
                Kelola jenis sampah dan harga terkini
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Cari jenis sampah..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Sampah</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga Saat Ini</TableHead>
                <TableHead>Perubahan</TableHead>
                <TableHead>Volume (kg)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteData.wasteTypes.map((waste) => (
                <TableRow key={waste.id}>
                  <TableCell className="font-medium">{waste.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{waste.category}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    Rp {waste.currentPrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`flex items-center gap-1 ${
                        waste.trend === "up"
                          ? "text-green-600"
                          : waste.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {waste.trend === "up" && (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {waste.trend === "down" && (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-sm">{waste.priceChange}</span>
                    </div>
                  </TableCell>
                  <TableCell>{waste.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        waste.status === "active" ? "default" : "secondary"
                      }
                      className={
                        waste.status === "active"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {waste.status === "active" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
