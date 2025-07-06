import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
  Search,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  Truck,
  Package,
  Clock,
  Filter,
  Grid,
  List,
  Eye,
  Users,
  Calendar,
  Weight,
  Recycle,
  Leaf,
  Zap,
  ChevronRight,
  ImageOff
} from "lucide-react";

// Component untuk Image dengan fallback
const WasteImage = ({
  src,
  alt,
  className = "",
  fallbackType = "waste"
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: "waste" | "detail";
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback component
  const ImageFallback = () => (
    <div
      className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}
    >
      <div className="text-center">
        <ImageOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-xs text-gray-500">No Image</p>
      </div>
    </div>
  );

  // Loading skeleton
  const ImageSkeleton = () => (
    <div
      className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
    >
      <Package className="h-8 w-8 text-gray-400" />
    </div>
  );

  if (imageError) {
    return <ImageFallback />;
  }

  return (
    <div className="relative">
      {imageLoading && <ImageSkeleton />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          imageLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ aspectRatio: "3/2", objectFit: "cover" }}
      />
    </div>
  );
};

// Interfaces
interface WasteItem {
  id: string;
  title: string;
  category:
    | "organic"
    | "plastic"
    | "paper"
    | "metal"
    | "glass"
    | "electronic"
    | "mixed";
  description: string;
  quantity: number; // in kg
  unit: "kg" | "ton" | "pieces";
  pricePerUnit: number; // per kg
  condition: "fresh" | "sorted" | "processed" | "mixed";
  availableUntil: string;
  images: string[];
  supplier: {
    id: string;
    name: string;
    type: "individual" | "company" | "cooperative";
    location: string;
    district: string;
    rating: number;
    reviewCount: number;
    avatar?: string;
    phone: string;
    verified: boolean;
    responseTime: string; // "< 1 jam", "2-4 jam", etc
  };
  pickupAvailable: boolean;
  minimumOrder: number; // kg
  tags: string[];
  postedAt: string;
  viewCount: number;
}

interface ExploreData {
  items: WasteItem[];
  categories: Array<{
    id: string;
    name: string;
    count: number;
    icon: string;
  }>;
  locations: string[];
  stats: {
    totalSuppliers: number;
    totalVolume: number; // total kg available
    averagePrice: number;
    activeListings: number;
  };
}

export const loader = async (): Promise<Response> => {
  // Mock data - dalam implementasi nyata, ambil dari database
  const exploreData: ExploreData = {
    stats: {
      totalSuppliers: 45,
      totalVolume: 15420, // kg
      averagePrice: 850, // per kg
      activeListings: 128
    },
    categories: [
      { id: "plastic", name: "Plastik", count: 32, icon: "♻️" },
      { id: "paper", name: "Kertas", count: 28, icon: "📄" },
      { id: "organic", name: "Organik", count: 24, icon: "🌱" },
      { id: "metal", name: "Logam", count: 18, icon: "🔩" },
      { id: "glass", name: "Kaca", count: 12, icon: "🍶" },
      { id: "electronic", name: "Elektronik", count: 8, icon: "📱" },
      { id: "mixed", name: "Campuran", count: 6, icon: "📦" }
    ],
    locations: [
      "Jakarta Utara",
      "Jakarta Selatan",
      "Jakarta Timur",
      "Jakarta Barat",
      "Jakarta Pusat",
      "Depok",
      "Tangerang",
      "Bekasi"
    ],
    items: [
      {
        id: "item-001",
        title: "Plastik Botol PET Bersih",
        category: "plastic",
        description:
          "Botol plastik PET bekas air mineral yang sudah dicuci bersih dan dipisahkan berdasarkan warna. Kondisi sangat baik untuk daur ulang.",
        quantity: 250,
        unit: "kg",
        pricePerUnit: 2800,
        condition: "sorted",
        availableUntil: "2025-07-15",
        images: ["https://picsum.photos/300/200?random=1"],
        supplier: {
          id: "sup-001",
          name: "Koperasi Sukamaju",
          type: "cooperative",
          location: "Kelurahan Merdeka",
          district: "Jakarta Utara",
          rating: 4.8,
          reviewCount: 23,
          phone: "081234567890",
          verified: true,
          responseTime: "< 1 jam"
        },
        pickupAvailable: true,
        minimumOrder: 50,
        tags: ["Bersih", "Tersortir", "Siap Proses"],
        postedAt: "2025-07-05",
        viewCount: 45
      },
      {
        id: "item-002",
        title: "Kertas Kardus Bekas Kemasan",
        category: "paper",
        description:
          "Kardus bekas kemasan elektronik dan makanan. Kondisi kering dan tidak basah. Sudah diratakan dan dibundle rapi.",
        quantity: 180,
        unit: "kg",
        pricePerUnit: 1200,
        condition: "sorted",
        availableUntil: "2025-07-12",
        images: ["https://picsum.photos/300/200?random=2"],
        supplier: {
          id: "sup-002",
          name: "Ahmad Wijaya",
          type: "individual",
          location: "Komplek Permata",
          district: "Jakarta Selatan",
          rating: 4.5,
          reviewCount: 12,
          phone: "081234567891",
          verified: true,
          responseTime: "2-4 jam"
        },
        pickupAvailable: true,
        minimumOrder: 30,
        tags: ["Kering", "Bundle", "Kemasan"],
        postedAt: "2025-07-04",
        viewCount: 28
      },
      {
        id: "item-003",
        title: "Sampah Organik Pasar Segar",
        category: "organic",
        description:
          "Limbah organik dari pasar tradisional meliputi sisa sayuran, buah-buahan, dan daun. Cocok untuk kompos atau biogas.",
        quantity: 500,
        unit: "kg",
        pricePerUnit: 400,
        condition: "fresh",
        availableUntil: "2025-07-07",
        images: ["https://picsum.photos/300/200?random=3"],
        supplier: {
          id: "sup-003",
          name: "Pasar Tradisional Sentral",
          type: "company",
          location: "Pasar Sentral",
          district: "Jakarta Tengah",
          rating: 4.9,
          reviewCount: 67,
          phone: "081234567892",
          verified: true,
          responseTime: "< 30 menit"
        },
        pickupAvailable: true,
        minimumOrder: 100,
        tags: ["Segar", "Organik", "Kompos"],
        postedAt: "2025-07-06",
        viewCount: 89
      },
      {
        id: "item-004",
        title: "Kaleng Aluminium Bekas Minuman",
        category: "metal",
        description:
          "Kaleng aluminium bekas minuman ringan dan bir. Sudah dibersihkan dan dipress untuk efisiensi transport.",
        quantity: 85,
        unit: "kg",
        pricePerUnit: 8500,
        condition: "processed",
        availableUntil: "2025-07-20",
        images: ["https://picsum.photos/300/200?random=4"],
        supplier: {
          id: "sup-004",
          name: "Sari Recycling",
          type: "company",
          location: "Industrial Park",
          district: "Jakarta Timur",
          rating: 4.7,
          reviewCount: 34,
          phone: "081234567893",
          verified: true,
          responseTime: "1-2 jam"
        },
        pickupAvailable: false,
        minimumOrder: 20,
        tags: ["Aluminium", "Dipress", "Bersih"],
        postedAt: "2025-07-03",
        viewCount: 52
      },
      {
        id: "item-005",
        title: "Botol Kaca Bekas Wine & Bir",
        category: "glass",
        description:
          "Botol kaca bekas wine, bir, dan minuman lainnya. Berbagai ukuran dan warna. Kondisi utuh tanpa keretakan.",
        quantity: 120,
        unit: "kg",
        pricePerUnit: 650,
        condition: "sorted",
        availableUntil: "2025-07-18",
        images: ["https://picsum.photos/300/200?random=5"],
        supplier: {
          id: "sup-005",
          name: "Dedi Kurniawan",
          type: "individual",
          location: "Cluster Villa",
          district: "Jakarta Barat",
          rating: 4.3,
          reviewCount: 8,
          phone: "081234567894",
          verified: false,
          responseTime: "4-6 jam"
        },
        pickupAvailable: true,
        minimumOrder: 25,
        tags: ["Utuh", "Beragam", "Bersih"],
        postedAt: "2025-07-02",
        viewCount: 19
      },
      {
        id: "item-006",
        title: "Komponen Elektronik Bekas",
        category: "electronic",
        description:
          "Komponen elektronik bekas dari perangkat komputer, TV, dan handphone. Mengandung logam mulia yang bisa diekstrak.",
        quantity: 45,
        unit: "kg",
        pricePerUnit: 12000,
        condition: "mixed",
        availableUntil: "2025-07-25",
        images: ["https://picsum.photos/300/200?random=6"],
        supplier: {
          id: "sup-006",
          name: "TechWaste Solutions",
          type: "company",
          location: "Industrial Zone",
          district: "Jakarta Timur",
          rating: 4.6,
          reviewCount: 15,
          phone: "081234567895",
          verified: true,
          responseTime: "< 2 jam"
        },
        pickupAvailable: false,
        minimumOrder: 10,
        tags: ["E-waste", "Logam Mulia", "Komponen"],
        postedAt: "2025-07-01",
        viewCount: 73
      }
    ]
  };

  return json(exploreData);
};

export default function ExploreWaste() {
  const data = useLoaderData<ExploreData>();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  // Filter items
  const filteredItems = data.items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "all" || item.supplier.district === selectedLocation;

    let matchesPrice = true;
    if (priceRange === "low") matchesPrice = item.pricePerUnit < 1000;
    else if (priceRange === "medium")
      matchesPrice = item.pricePerUnit >= 1000 && item.pricePerUnit < 5000;
    else if (priceRange === "high") matchesPrice = item.pricePerUnit >= 5000;

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "plastic":
        return <Recycle className="h-4 w-4" />;
      case "organic":
        return <Leaf className="h-4 w-4" />;
      case "electronic":
        return <Zap className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getConditionBadge = (condition: string) => {
    const variants = {
      fresh: "default",
      sorted: "secondary",
      processed: "outline",
      mixed: "destructive"
    } as const;

    const labels = {
      fresh: "Segar",
      sorted: "Tersortir",
      processed: "Diproses",
      mixed: "Campuran"
    };

    return (
      <Badge
        variant={variants[condition as keyof typeof variants] || "outline"}
      >
        {labels[condition as keyof typeof labels] || condition}
      </Badge>
    );
  };

  const getSupplierTypeBadge = (type: string) => {
    const labels = {
      individual: "Individu",
      company: "Perusahaan",
      cooperative: "Koperasi"
    };

    return (
      <Badge variant="outline" className="text-xs">
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Explore Waste Marketplace
          </h2>
          <p className="text-muted-foreground">
            Temukan dan hubungi supplier sampah untuk kebutuhan operasional Anda
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Supplier
                </p>
                <p className="text-2xl font-bold">
                  {data.stats.totalSuppliers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Weight className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Volume Tersedia
                </p>
                <p className="text-2xl font-bold">
                  {data.stats.totalVolume.toLocaleString()} kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Listing Aktif
                </p>
                <p className="text-2xl font-bold">
                  {data.stats.activeListings}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💰</span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Harga Rata-rata
                </p>
                <p className="text-2xl font-bold">
                  Rp {data.stats.averagePrice}/kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-5">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search">Cari Sampah</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Cari berdasarkan jenis, supplier, atau tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {data.categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Lokasi</SelectItem>
                  {data.locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter */}
            <div>
              <Label htmlFor="price">Harga</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Harga</SelectItem>
                  <SelectItem value="low"> Rp 1.000</SelectItem>
                  <SelectItem value="medium">Rp 1.000 - 5.000</SelectItem>
                  <SelectItem value="high"> Rp 5.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <Badge variant="outline">
              {filteredItems.length} item ditemukan
            </Badge>
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedLocation !== "all" ||
              priceRange !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLocation("all");
                  setPriceRange("all");
                }}
              >
                Reset Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <WasteImage
                src={item.images[0]}
                alt={item.title}
                className="w-full h-48"
              />
              <div className="absolute top-2 right-2 space-y-1">
                {item.supplier.verified && (
                  <Badge className="bg-blue-600">Verified</Badge>
                )}
                {item.pickupAvailable && (
                  <Badge variant="secondary">Pickup Available</Badge>
                )}
              </div>
              <div className="absolute bottom-2 left-2">
                {getCategoryIcon(item.category)}
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Title & Condition */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg leading-tight">
                    {item.title}
                  </h3>
                  {getConditionBadge(item.condition)}
                </div>

                {/* Price & Quantity */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      Rp {item.pricePerUnit.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      per {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {item.quantity.toLocaleString()} {item.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">tersedia</p>
                  </div>
                </div>

                {/* Supplier Info */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.supplier.avatar} />
                    <AvatarFallback>
                      {item.supplier.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium truncate">
                        {item.supplier.name}
                      </p>
                      {getSupplierTypeBadge(item.supplier.type)}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{item.supplier.district}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.supplier.rating}</span>
                        <span>({item.supplier.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Available until{" "}
                      {new Date(item.availableUntil).toLocaleDateString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{item.viewCount} views</span>
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Detail
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{item.title}</DialogTitle>
                        <DialogDescription>
                          Detail lengkap stok sampah dari {item.supplier.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <WasteImage
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-60 rounded-lg"
                          fallbackType="detail"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">
                              Informasi Produk
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Kategori:</strong> {item.category}
                              </p>
                              <p>
                                <strong>Kondisi:</strong> {item.condition}
                              </p>
                              <p>
                                <strong>Quantity:</strong> {item.quantity}{" "}
                                {item.unit}
                              </p>
                              <p>
                                <strong>Minimum Order:</strong>{" "}
                                {item.minimumOrder} {item.unit}
                              </p>
                              <p>
                                <strong>Harga:</strong> Rp{" "}
                                {item.pricePerUnit.toLocaleString()} per{" "}
                                {item.unit}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Informasi Supplier
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Nama:</strong> {item.supplier.name}
                              </p>
                              <p>
                                <strong>Lokasi:</strong>{" "}
                                {item.supplier.location},{" "}
                                {item.supplier.district}
                              </p>
                              <p>
                                <strong>Rating:</strong> {item.supplier.rating}
                                /5 ({item.supplier.reviewCount} reviews)
                              </p>
                              <p>
                                <strong>Response Time:</strong>{" "}
                                {item.supplier.responseTime}
                              </p>
                              <p>
                                <strong>Pickup:</strong>{" "}
                                {item.pickupAvailable
                                  ? "Available"
                                  : "Self-pickup only"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Deskripsi</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button className="flex-1">
                            <Phone className="h-4 w-4 mr-2" />
                            Hubungi: {item.supplier.phone}
                          </Button>
                          <Button variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Kontak
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada item ditemukan
            </h3>
            <p className="text-gray-500 mb-4">
              Coba ubah filter pencarian atau kata kunci untuk menemukan stok
              sampah yang sesuai.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLocation("all");
                setPriceRange("all");
              }}
            >
              Reset Filter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
