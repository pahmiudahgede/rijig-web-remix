// app/routes/sys-rijig-adminpanel.dashboard.waste._index.tsx
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher, useRevalidator } from "@remix-run/react";
import { useState } from "react";
import trashCategoryService from "~/services/trash/category.service";
import type { TrashCategory } from "~/types/trash.types";

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
  Save,
  Upload,
  AlertCircle
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
  DialogTitle
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // TODO: Add auth check here
    // await requireAuthToken(request);
    
    console.log("Loading waste categories...");
    const response = await trashCategoryService.getCategories();
    console.log("API Response:", response);
    
    const wasteData = response.data || [];

    // Hitung summary dari data
    const summary = {
      totalTypes: wasteData.length,
      totalVolume: 0, // Tidak ada data volume di API
      avgPrice: wasteData.length > 0 
        ? Math.round(
            wasteData.reduce((sum, item) => sum + item.estimated_price, 0) / wasteData.length
          )
        : 0,
      trending: "up"
    };

    return json({
      wasteData,
      summary,
      baseUrl: process.env.RIJIG_API_BASE_URL || "",
      error: null
    });
  } catch (error) {
    console.error("Detailed loader error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return json({
      wasteData: [] as TrashCategory[],
      summary: { totalTypes: 0, totalVolume: 0, avgPrice: 0, trending: "up" as const },
      baseUrl: process.env.RIJIG_API_BASE_URL || "",
      error: error instanceof Error ? error.message : "Failed to load data"
    });
  }
};

export default function WasteManagement() {
  const { wasteData, summary, baseUrl, error } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  // Debug logging
  console.log("Component rendered with data:", { wasteData, summary, baseUrl, error });

  // State untuk modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState<TrashCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  // State untuk form
  const [formData, setFormData] = useState({
    trash_name: "",
    estimated_price: "",
    variety: "",
    icon: null as File | null
  });

  // Debug state changes
  console.log("Current state:", { 
    showAddModal, 
    showEditModal, 
    showDeleteModal, 
    loading, 
    apiError 
  });

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, icon: file }));
    }
  };

  // Handle add
  const handleAdd = () => {
    try {
      console.log("Handle add clicked");
      setFormData({
        trash_name: "",
        estimated_price: "",
        variety: "",
        icon: null
      });
      setApiError("");
      setShowAddModal(true);
      console.log("Add modal should be open");
    } catch (error) {
      console.error("Error in handleAdd:", error);
    }
  };

  // Handle edit
  const handleEdit = (waste: TrashCategory) => {
    try {
      console.log("Handle edit clicked for:", waste.trash_name);
      setSelectedWaste(waste);
      setFormData({
        trash_name: waste.trash_name,
        estimated_price: waste.estimated_price.toString(),
        variety: waste.variety,
        icon: null
      });
      setApiError("");
      setShowEditModal(true);
      console.log("Edit modal should be open");
    } catch (error) {
      console.error("Error in handleEdit:", error);
    }
  };

  // Handle delete
  const handleDelete = (waste: TrashCategory) => {
    try {
      console.log("Handle delete clicked for:", waste.trash_name);
      setSelectedWaste(waste);
      setApiError("");
      setShowDeleteModal(true);
      console.log("Delete modal should be open");
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  // Handle save (add/edit)
  const handleSave = async () => {
    try {
      console.log("Handle save clicked, formData:", formData);
      
      if (!formData.trash_name || !formData.estimated_price || !formData.variety) {
        setApiError("Semua field harus diisi");
        return;
      }

      // Untuk add, icon wajib
      if (!selectedWaste && !formData.icon) {
        setApiError("Icon wajib diupload untuk kategori baru");
        return;
      }

      setLoading(true);
      setApiError("");

      if (selectedWaste) {
        console.log("Updating category:", selectedWaste.id);
        // Edit existing
        await trashCategoryService.updateCategory(selectedWaste.id, {
          name: formData.trash_name,
          variety: formData.variety,
          estimated_price: formData.estimated_price,
          icon: formData.icon || undefined
        });
        console.log("Update successful");
      } else {
        console.log("Creating new category");
        // Add new
        await trashCategoryService.createCategory({
          name: formData.trash_name,
          variety: formData.variety,
          estimated_price: formData.estimated_price,
          icon: formData.icon!
        });
        console.log("Create successful");
      }

      // Close modal and refresh data
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedWaste(null);
      setFormData({
        trash_name: "",
        estimated_price: "",
        variety: "",
        icon: null
      });
      
      console.log("Revalidating data...");
      // Refresh page data
      revalidator.revalidate();
    } catch (error: any) {
      console.error("Detailed save error:", error);
      console.error("Error response:", error.response);
      setApiError(error.response?.data?.meta?.message || error.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedWaste) return;

    try {
      console.log("Deleting category:", selectedWaste.id);
      setLoading(true);
      setApiError("");

      await trashCategoryService.deleteCategory(selectedWaste.id);
      console.log("Delete successful");
      
      setShowDeleteModal(false);
      setSelectedWaste(null);
      
      console.log("Revalidating data after delete...");
      // Refresh page data
      revalidator.revalidate();
    } catch (error: any) {
      console.error("Detailed delete error:", error);
      console.error("Error response:", error.response);
      setApiError(error.response?.data?.meta?.message || error.message || "Gagal menghapus data");
    } finally {
      setLoading(false);
    }
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

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
              {wasteData.map((waste: TrashCategory) => {
                const IconComponent = getWasteIcon(waste.trash_name);
                return (
                  <TableRow key={waste.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Real image from API */}
                        <img
                          src={`${baseUrl}${waste.trash_icon}`}
                          alt={waste.trash_name}
                          className="w-10 h-10 object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Fallback icon */}
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                          <IconComponent className="w-6 h-6 text-green-600" />
                        </div>
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
          
          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

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
            <div className="grid gap-2">
              <Label htmlFor="add-icon">Icon Kategori</Label>
              <Input
                id="add-icon"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground">
                Upload gambar icon untuk kategori sampah (wajib)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>
              )}
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

          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

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
            <div className="grid gap-2">
              <Label htmlFor="edit-icon">Icon Kategori (opsional)</Label>
              <Input
                id="edit-icon"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-sm text-muted-foreground">
                Kosongkan jika tidak ingin mengubah icon
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update
                </>
              )}
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

          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          {selectedWaste && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={`${baseUrl}${selectedWaste.trash_icon}`}
                    alt={selectedWaste.trash_name}
                    className="w-10 h-10 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {(() => {
                    const IconComponent = getWasteIcon(selectedWaste.trash_name);
                    return (
                      <div className="hidden items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
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
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}