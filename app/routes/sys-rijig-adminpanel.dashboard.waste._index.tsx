import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

// Interface untuk data waste
interface WasteData {
  id: string;
  trash_name: string;
  trash_icon: string;
  estimated_price: number;
  variety: string;
  created_at: string;
  updated_at: string;
}
import {
  Recycle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Package,
  FileText,
  Coffee,
  Cpu,
  Archive,
  Glasses,
  X,
  Save
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

// Icon mapping untuk setiap jenis sampah
const getWasteIcon = (trashName: string) => {
  const name = trashName.toLowerCase();
  if (name.includes("plastik")) return Package;
  if (name.includes("kertas")) return FileText;
  if (name.includes("kaleng")) return Coffee;
  if (name.includes("besi") || name.includes("tembaga")) return Cpu;
  if (name.includes("kardus")) return Archive;
  if (name.includes("kaca") || name.includes("beling")) return Glasses;
  return Recycle; // default icon
};

export const loader = async () => {
  // Simulasi data API sesuai format yang diminta
  const wasteData = {
    meta: {
      status: 200,
      message: "Trash categories retrieved successfully"
    },
    data: [
      {
        id: "9520dfd4-3bc8-4173-ac3d-4b17d466bc90",
        trash_name: "Plastik",
        trash_icon:
          "/uploads/icontrash/a4e99d8c-8380-470f-87f1-01dc62fbe114_icontrash.png",
        estimated_price: 1500,
        variety:
          "Jerigen plastik, tempat makanan thin wall, ember, galon air mineral, botol sabun, botol, sampo dan plastik keras sejenisnya",
        created_at: "2025-06-12T05:08:43+07:00",
        updated_at: "2025-06-12T05:08:43+07:00"
      },
      {
        id: "8636ceee-6c13-41ab-abc6-5b0c603ba360",
        trash_name: "Kertas",
        trash_icon:
          "/uploads/icontrash/a6414ed3-0675-4b38-a2c7-c6d3d24810cf_icontrash.png",
        estimated_price: 1250,
        variety:
          "Kertas HVS, koran, majalah, buku, kertas, karton dan sejenisnya",
        created_at: "2025-06-12T05:10:21+07:00",
        updated_at: "2025-06-12T05:10:21+07:00"
      },
      {
        id: "bec932a7-da0a-4e7b-b33c-a5e225e56cef",
        trash_name: "Kaleng",
        trash_icon:
          "/uploads/icontrash/49b2ca06-cbfe-4650-bfb9-7d14aff2e09b_icontrash.png",
        estimated_price: 1000,
        variety: "Kaleng sarden, kaleng aerosol, kaleng makanan, dll",
        created_at: "2025-06-12T05:14:38+07:00",
        updated_at: "2025-06-12T05:14:38+07:00"
      },
      {
        id: "9af0a2f2-4c9c-49b0-8f0b-ea8c38d9edd3",
        trash_name: "Besi/Tembaga",
        trash_icon:
          "/uploads/icontrash/2a80005a-3038-4192-b70c-b22a54f11ae6_icontrash.png",
        estimated_price: 3500,
        variety: "Besi, tembaga, aluminium",
        created_at: "2025-06-12T05:16:44+07:00",
        updated_at: "2025-06-12T05:16:44+07:00"
      },
      {
        id: "c5319782-b658-4639-83aa-8b88feb1b2a8",
        trash_name: "Kardus",
        trash_icon:
          "/uploads/icontrash/1d900090-4b24-4d42-9c0e-e486839b9f63_icontrash.png",
        estimated_price: 1500,
        variety: "Kardus paket, kardus kemasan produk, dll",
        created_at: "2025-06-12T05:19:15+07:00",
        updated_at: "2025-06-12T05:19:15+07:00"
      },
      {
        id: "131c7ca9-6f2d-4e98-a016-916c23ec45e9",
        trash_name: "Kaca/Beling",
        trash_icon:
          "/uploads/icontrash/3be4f3ab-99a2-4b3c-930b-b2e0055cd705_icontrash.png",
        estimated_price: 500,
        variety:
          "Botol kaca minuman, botol kaca kosmetik, botol sirup, botol saus, botol kecap, gelas kaca, piring kaca dan sejenisnya",
        created_at: "2025-06-12T05:21:55+07:00",
        updated_at: "2025-06-12T05:21:55+07:00"
      }
    ]
  };

  // Hitung summary dari data
  const summary = {
    totalTypes: wasteData.data.length,
    totalVolume: 0, // Tidak ada data volume di API baru
    avgPrice: Math.round(
      wasteData.data.reduce((sum, item) => sum + item.estimated_price, 0) /
        wasteData.data.length
    ),
    trending: "up"
  };

  return json({
    wasteData: wasteData.data,
    summary
  });
};

export default function WasteManagement() {
  const { wasteData, summary } = useLoaderData<typeof loader>();

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState<WasteData | null>(null);

  // State untuk form
  const [formData, setFormData] = useState({
    trash_name: "",
    estimated_price: "",
    variety: ""
  });

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle add
  const handleAdd = () => {
    setFormData({
      trash_name: "",
      estimated_price: "",
      variety: ""
    });
    setShowAddModal(true);
  };

  // Handle edit
  const handleEdit = (waste: WasteData) => {
    setSelectedWaste(waste);
    setFormData({
      trash_name: waste.trash_name,
      estimated_price: waste.estimated_price.toString(),
      variety: waste.variety
    });
    setShowEditModal(true);
  };

  // Handle delete
  const handleDelete = (waste: WasteData) => {
    setSelectedWaste(waste);
    setShowDeleteModal(true);
  };

  // Handle save (add/edit)
  const handleSave = () => {
    // Di sini Anda bisa menambahkan logika untuk menyimpan data
    console.log("Saving data:", formData);
    setShowAddModal(false);
    setShowEditModal(false);
    // Reset form
    setFormData({
      trash_name: "",
      estimated_price: "",
      variety: ""
    });
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    // Di sini Anda bisa menambahkan logika untuk menghapus data
    if (selectedWaste) {
      console.log("Deleting:", selectedWaste);
    }
    setShowDeleteModal(false);
    setSelectedWaste(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manajemen Data Sampah
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola jenis sampah, harga, dan variety transaksi
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="gap-2 bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Jenis Sampah
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jenis</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTypes}</div>
            <p className="text-xs text-muted-foreground">
              jenis sampah terdaftar
            </p>
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
              Rp {summary.avgPrice.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">per kilogram</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trend Harga</CardTitle>
            {summary.trending === "up" ? (
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
              <Button
                onClick={handleAdd}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Tambah
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Nama Sampah</TableHead>
                <TableHead>Harga Estimasi</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteData.map((waste) => {
                const IconComponent = getWasteIcon(waste.trash_name);
                return (
                  <TableRow key={waste.id}>
                    <TableCell>
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {waste.trash_name}
                    </TableCell>
                    <TableCell className="font-mono">
                      Rp {waste.estimated_price.toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={waste.variety}>
                        {waste.variety}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => handleEdit(waste)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-red-600"
                            onClick={() => handleDelete(waste)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Tambah Jenis Sampah
            </DialogTitle>
            <DialogDescription>
              Tambahkan jenis sampah baru dengan detail lengkap
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Nama Sampah</Label>
              <Input
                id="add-name"
                value={formData.trash_name}
                onChange={(e) => handleFormChange("trash_name", e.target.value)}
                placeholder="Masukkan nama sampah"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-price">Harga Estimasi (Rp)</Label>
              <Input
                id="add-price"
                type="number"
                value={formData.estimated_price}
                onChange={(e) =>
                  handleFormChange("estimated_price", e.target.value)
                }
                placeholder="Masukkan harga per kg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-variety">Variety</Label>
              <Textarea
                id="add-variety"
                value={formData.variety}
                onChange={(e) => handleFormChange("variety", e.target.value)}
                placeholder="Deskripsi jenis sampah yang termasuk dalam kategori ini"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Jenis Sampah
            </DialogTitle>
            <DialogDescription>
              Perbarui informasi jenis sampah
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Sampah</Label>
              <Input
                id="edit-name"
                value={formData.trash_name}
                onChange={(e) => handleFormChange("trash_name", e.target.value)}
                placeholder="Masukkan nama sampah"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Harga Estimasi (Rp)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.estimated_price}
                onChange={(e) =>
                  handleFormChange("estimated_price", e.target.value)
                }
                placeholder="Masukkan harga per kg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-variety">Variety</Label>
              <Textarea
                id="edit-variety"
                value={formData.variety}
                onChange={(e) => handleFormChange("variety", e.target.value)}
                placeholder="Deskripsi jenis sampah yang termasuk dalam kategori ini"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Hapus Jenis Sampah
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jenis sampah ini? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {selectedWaste && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = getWasteIcon(
                      selectedWaste.trash_name
                    );
                    return (
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-red-600" />
                      </div>
                    );
                  })()}
                  <div>
                    <h4 className="font-medium">{selectedWaste.trash_name}</h4>
                    <p className="text-sm text-gray-600">
                      Rp {selectedWaste.estimated_price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Batal
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
