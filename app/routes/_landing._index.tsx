import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Play,
  Download,
  Apple,
  Check,
  ChevronDown,
  Star,
  Users,
  Calendar,
  MapPin,
  Truck,
  BarChart3,
  Recycle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import { MacbookScroll } from "~/components/ui/macbook-scroll";

interface Feature {
  icon: React.ReactNode | string;
  title: string;
  description: string;
}

interface StakeholderFeature {
  title: string;
  icon: string;
  features: string[];
}

interface WorkStep {
  icon: React.ReactNode | string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}

interface Blog {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Data constants
const features: Feature[] = [
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Cari Pengepul Terdekat",
    description:
      "Temukan pengepul sampah terdekat dari lokasi Anda dengan mudah dan cepat menggunakan fitur pencarian berbasis GPS."
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Request Penjemputan",
    description:
      "Minta penjemputan sampah langsung dari rumah Anda dengan sistem booking yang mudah dan terpercaya."
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Tracking Progress",
    description:
      "Pantau status penjemputan sampah Anda secara real-time dari permintaan hingga transaksi selesai."
  },
  {
    icon: "📊",
    title: "Pencatatan Penjualan",
    description:
      "Catat semua transaksi penjualan sampah dan monitor pendapatan yang diperoleh dari aktivitas daur ulang."
  },
  {
    icon: "💰",
    title: "Manajemen Keuangan",
    description:
      "Kelola dan pantau uang yang didapat dari penjualan sampah dengan sistem pencatatan yang rapi dan akurat."
  },
  {
    icon: <Recycle className="h-8 w-8" />,
    title: "Visualisasi Data",
    description:
      "Lihat data penjualan, tren harga, dan dampak lingkungan melalui dashboard yang informatif dan mudah dipahami."
  }
];

const stakeholderFeatures: StakeholderFeature[] = [
  {
    title: "Fitur untuk Masyarakat",
    icon: "🏠",
    features: [
      "Temukan pengepul terdekat dengan GPS",
      "Request penjemputan sampah dari rumah",
      "Tracking real-time status pickup",
      "Pencatatan lengkap penjualan sampah",
      "Monitor pendapatan dari sampah",
      "Visualisasi data dan statistik personal"
    ]
  },
  {
    title: "Fitur untuk Pengepul",
    icon: "🚛",
    features: [
      "Terima dan kelola request pickup",
      "Pencatatan transaksi dengan masyarakat",
      "Manajemen stok sampah yang terkumpul",
      "Dashboard analisis bisnis lengkap",
      "Sistem notifikasi otomatis",
      "Laporan keuangan dan operasional"
    ]
  },
  {
    title: "Fitur untuk Pengelola",
    icon: "🏭",
    features: [
      "Monitor pengepul dan stok tersedia",
      "Identifikasi supplier potensial",
      "Pencatatan supply chain management",
      "Quality control system terintegrasi",
      "Production planning tools",
      "Environmental impact reports"
    ]
  }
];

const workSteps: WorkStep[] = [
  {
    icon: <Download className="h-10 w-10" />,
    title: "Download Aplikasi Rijig",
    description:
      "Unduh aplikasi Rijig dari Play Store atau App Store dan daftar sesuai dengan peran Anda sebagai masyarakat, pengepul, atau pengelola."
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Lengkapi Profil Anda",
    description:
      "Isi data diri lengkap dan verifikasi akun untuk keamanan transaksi dan membangun kepercayaan antar pengguna dalam ekosistem."
  },
  {
    icon: "🌱",
    title: "Mulai Kelola Sampah",
    description:
      "Mulai jual sampah, kelola bisnis pengepulan, atau operasikan fasilitas daur ulang dengan sistem yang terintegrasi dan mudah digunakan."
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Budi Santoso",
    role: "Pengepul Sampah - Jakarta Timur",
    avatar: "👨‍💼",
    rating: 5,
    comment:
      "Dengan Rijig, bisnis pengepulan saya jadi lebih terorganisir. Bisa tracking semua transaksi dan jaringan supplier dari masyarakat makin luas. Revenue meningkat 40% sejak pakai aplikasi ini."
  },
  {
    name: "Sari Wijaya",
    role: "Ibu Rumah Tangga - Bekasi",
    avatar: "👩‍🦰",
    rating: 5,
    comment:
      "Sangat memudahkan untuk jual sampah rumah tangga. Harga transparan, pengepul bisa dijemput ke rumah, dan prosesnya cepat. Sekarang sampah rumah tangga bisa jadi tambahan penghasilan yang lumayan!"
  },
  {
    name: "PT. Green Recycle Indonesia",
    role: "Pengelola Fasilitas Daur Ulang",
    avatar: "🏭",
    rating: 5,
    comment:
      "Supply chain management jadi jauh lebih efisien dengan Rijig. Bisa monitor kualitas bahan baku dari berbagai pengepul dan planning produksi berdasarkan data yang akurat dan real-time."
  },
  {
    name: "Ahmad Rahman",
    role: "Ketua RT 05 - Depok",
    avatar: "👨‍🔬",
    rating: 5,
    comment:
      "Lingkungan RT kami jadi lebih bersih sejak menggunakan Rijig. Warga antusias karena sampah bisa jadi uang, dan sistem pickup memudahkan mereka yang sibuk bekerja!"
  }
];

const blogs: Blog[] = [
  {
    title: "5 Jenis Sampah yang Paling Menguntungkan untuk Dijual",
    excerpt:
      "Pelajari jenis-jenis sampah yang memiliki nilai ekonomi tinggi dan cara memilahnya dengan benar untuk mendapatkan harga terbaik dari pengepul.",
    author: "Tim Rijig",
    date: "15 Juni 2025",
    image: "♻️"
  },
  {
    title: "Tips Memulai Bisnis Pengepul Sampah untuk Pemula",
    excerpt:
      "Panduan lengkap untuk memulai bisnis pengepulan sampah, mulai dari modal awal hingga strategi pemasaran yang efektif menggunakan platform digital.",
    author: "Tim Rijig",
    date: "10 Juni 2025",
    image: "💼"
  },
  {
    title: "Dampak Positif Daur Ulang Terhadap Lingkungan Indonesia",
    excerpt:
      "Mengenal lebih dalam bagaimana industri daur ulang berkontribusi dalam mengurangi pencemaran lingkungan dan ekonomi sirkular di Indonesia.",
    author: "Tim Rijig",
    date: "5 Juni 2025",
    image: "🌱"
  }
];

const faqs: FAQ[] = [
  {
    question: "Apakah aplikasi Rijig gratis untuk digunakan?",
    answer:
      "Ya, aplikasi Rijig gratis untuk diunduh dan digunakan oleh masyarakat umum. Untuk pengepul dan pengelola, tersedia fitur premium dengan biaya berlangganan yang terjangkau sesuai kebutuhan bisnis."
  },
  {
    question: "Bagaimana cara kerja sistem penjemputan sampah?",
    answer:
      "Masyarakat dapat membuat request pickup melalui aplikasi, memilih pengepul terdekat, menentukan jadwal penjemputan. Pengepul akan mendapat notifikasi dan dapat menerima atau menolak request berdasarkan kapasitas dan lokasi."
  },
  {
    question: "Bagaimana Rijig memastikan harga sampah yang fair?",
    answer:
      "Kami menggunakan sistem harga transparan berdasarkan harga pasar real-time, jenis dan kualitas sampah, serta volume. Sistem rating dan review membantu menjaga kualitas transaksi untuk semua pihak."
  },
  {
    question: "Apakah data dan transaksi di Rijig aman?",
    answer:
      "Sangat aman. Kami menggunakan enkripsi data tingkat bank, sistem pembayaran terintegrasi yang aman, dan verifikasi identitas pengguna untuk memastikan keamanan dan kepercayaan dalam ekosistem."
  }
];

// Component definitions
const FeatureCard = ({
  feature,
  index
}: {
  feature: Feature;
  index: number;
}) => (
  <div className="text-center group hover:scale-105 transition-transform duration-200">
    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
      {typeof feature.icon === "string" ? (
        <span className="text-3xl">{feature.icon}</span>
      ) : (
        feature.icon
      )}
    </div>
    <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
      {feature.title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
  </div>
);

const StakeholderCard = ({
  stakeholder,
  index
}: {
  stakeholder: StakeholderFeature;
  index: number;
}) => (
  <CardContainer key={index} className="inter-var">
    <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-green-500/[0.1] dark:bg-gray-800 dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border shadow-sm">
      <div className="text-center pb-6">
        <CardItem
          translateZ="50"
          className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center text-3xl"
        >
          {stakeholder.icon}
        </CardItem>
        <CardItem
          translateZ="60"
          className="text-xl font-bold text-black dark:text-white"
        >
          {stakeholder.title}
        </CardItem>
      </div>

      <CardItem translateZ="80" className="space-y-3">
        {stakeholder.features.map((feature, fIndex) => (
          <div key={fIndex} className="flex items-start space-x-3">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {feature}
            </span>
          </div>
        ))}
      </CardItem>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <CardItem
          translateZ={20}
          as="button"
          className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors duration-200"
        >
          Pelajari Lebih Lanjut
        </CardItem>
      </div>
    </CardBody>
  </CardContainer>
);

const WorkStepCard = ({ step, index }: { step: WorkStep; index: number }) => (
  <div className="text-center group">
    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
      {typeof step.icon === "string" ? (
        <span className="text-3xl">{step.icon}</span>
      ) : (
        step.icon
      )}
    </div>
    <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
      {step.title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
  </div>
);

const TestimonialCard = ({
  testimonial,
  index
}: {
  testimonial: Testimonial;
  index: number;
}) => (
  <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
      <p className="text-gray-600 dark:text-gray-300">
        "{testimonial.comment}"
      </p>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          {testimonial.avatar}
        </div>
        <div>
          <h5 className="font-medium text-black dark:text-white">
            {testimonial.name}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {testimonial.role}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {testimonial.rating}
        </span>
        <div className="flex space-x-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  </Card>
);

const BlogCard = ({ blog, index }: { blog: Blog; index: number }) => (
  <Card className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <div className="relative">
      <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
        <span className="text-4xl md:text-6xl text-white">{blog.image}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
        <div className="flex flex-wrap items-center gap-4 text-white text-sm">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{blog.date}</span>
          </div>
        </div>
      </div>
    </div>

    <CardContent className="p-6">
      <h3 className="text-xl font-semibold mb-3 text-black dark:text-white line-clamp-2">
        {blog.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
        {blog.excerpt}
      </p>
      <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg">
        Baca Selengkapnya
      </Button>
    </CardContent>
  </Card>
);

const FAQItem = ({ faq, index }: { faq: FAQ; index: number }) => (
  <details className="group">
    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <span className="font-medium text-black dark:text-white">
        {faq.question}
      </span>
      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
    </summary>
    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
      <p className="text-gray-600 dark:text-gray-300 pt-4">{faq.answer}</p>
    </div>
  </details>
);

const DashboardFeatureCard = ({
  icon,
  title,
  description,
  features,
  iconBg
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  iconBg: string;
}) => (
  <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-colors bg-white dark:bg-gray-800">
    <div
      className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-4`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex items-center text-sm text-gray-600 dark:text-gray-300"
        >
          <Check className="h-4 w-4 text-green-500 mr-2" />
          {feature}
        </li>
      ))}
    </ul>
  </Card>
);

export default function LandingIndex() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section
        id="home"
        className="min-h-screen flex items-center relative bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />

        <div className="container mx-auto max-w-[1400px] px-4 pt-20 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 bg-white/90 text-green-700"
              >
                Solusi Digital untuk Ekonomi Sirkular
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                Rijig - Platform{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Pengelolaan Sampah
                </span>{" "}
                Terpadu Indonesia
              </h1>

              <p className="text-lg text-white/90 max-w-[475px] drop-shadow-md">
                Menghubungkan masyarakat, pengepul, dan pengelola daur ulang
                dalam satu ekosistem digital yang memudahkan pengelolaan sampah
                dan menciptakan nilai ekonomi berkelanjutan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 shadow-lg"
                >
                  <span className="mr-4 border-r border-green-300 pr-4">
                    Download Rijig
                  </span>
                  <Apple className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="group bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-current">
                    <Play className="h-4 w-4 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm">Lihat Demo</div>
                    <div className="text-xs opacity-70">
                      Cara kerja aplikasi
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-[530px]">
                <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full aspect-square border border-white/20">
                  <div className="absolute inset-8 bg-white/95 dark:bg-gray-800/95 rounded-3xl shadow-2xl flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="text-6xl md:text-8xl mb-4">♻️</div>
                      <h3 className="text-xl font-semibold mb-2 text-green-600">
                        Rijig
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Kelola sampah dengan bijak
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-30 pointer-events-none">
          <div className="flex flex-col items-center text-white animate-bounce">
            <div className="text-sm mb-2 opacity-80 text-center">
              Scroll untuk melihat lebih
            </div>
            <div className="w-6 h-10 border-2 border-white rounded-full relative mx-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-3 bg-white rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-[1390px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Fitur Lengkap untuk Semua Pengguna
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Rijig menyediakan solusi terintegrasi yang menghubungkan
              masyarakat, pengepul, dan pengelola daur ulang dalam satu platform
              yang mudah digunakan dan efisien.
            </p>
          </div>

          <Card className="p-6 md:p-12 lg:p-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Stakeholder Features Section */}
      <section
        id="stakeholder-features"
        className="py-20 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto max-w-[1390px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Fitur Khusus untuk Setiap Stakeholder
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Rijig dirancang khusus untuk memenuhi kebutuhan berbeda dari
              setiap pemangku kepentingan dalam ekosistem pengelolaan sampah.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {stakeholderFeatures.map((stakeholder, index) => (
              <StakeholderCard
                key={index}
                stakeholder={stakeholder}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-[1120px] px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative">
              <div className="relative bg-gradient-to-br from-green-400 to-blue-600 rounded-3xl h-80 md:h-96 flex items-center justify-center">
                <div className="text-white text-6xl md:text-8xl">📊</div>
                <div className="absolute top-5 right-5 text-3xl">📈</div>
                <div className="absolute bottom-10 left-0 text-2xl">♻️</div>
              </div>
            </div>

            <div className="space-y-6">
              <Badge
                variant="outline"
                className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
              >
                Pantau Aktivitas Sampah Real-time
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                Tracking Lengkap dari Pickup hingga Daur Ulang
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor seluruh proses pengelolaan sampah mulai dari permintaan
                penjemputan, transaksi, hingga proses daur ulang dengan
                dashboard yang informatif dan update real-time.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 font-semibold">
                    01
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      Status Pickup Real-time
                    </h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Pantau status penjemputan sampah dari request hingga
                      selesai dengan notifikasi langsung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 font-semibold">
                    02
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      Pencatatan & Analisis Otomatis
                    </h5>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Sistem pencatatan otomatis dan analisis data untuk
                      membantu optimalisasi pengelolaan sampah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 lg:order-2">
              <Badge
                variant="outline"
                className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
              >
                Dampak Lingkungan Terukur
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
                Visualisasi Kontribusi Anda untuk Lingkungan
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Lihat secara visual dampak positif yang Anda berikan terhadap
                lingkungan melalui aktivitas pengelolaan sampah dan daur ulang
                dalam dashboard yang mudah dipahami.
              </p>
              <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg">
                Pelajari Lebih Lanjut
              </Button>
            </div>

            <div className="relative lg:order-1">
              <div className="relative bg-gradient-to-br from-orange-400 to-green-600 rounded-3xl h-80 md:h-96 flex items-center justify-center">
                <div className="text-white text-6xl md:text-8xl">🌍</div>
                <div className="absolute top-5 right-5 text-3xl">🌱</div>
                <div className="absolute bottom-10 left-0 text-2xl">💚</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Process Section */}
      <section id="work-process" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[1390px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Bergabung dengan ekosistem pengelolaan sampah yang berkelanjutan
              hanya dalam 3 langkah mudah dan mulai berkontribusi untuk
              lingkungan yang lebih bersih.
            </p>
          </div>

          <Card className="p-6 md:p-12 lg:p-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-3 gap-8">
              {workSteps.map((step, index) => (
                <WorkStepCard key={index} step={step} index={index} />
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screens" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-[1000px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Screenshot Aplikasi
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Lihat tampilan antarmuka aplikasi Rijig yang user-friendly dan
              mudah digunakan untuk semua kalangan pengguna.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "🏠", title: "Dashboard Masyarakat" },
                { icon: "📊", title: "Panel Pengepul" },
                { icon: "🏭", title: "Sistem Daur Ulang" }
              ].map((screen, index) => (
                <div key={index} className="mx-auto max-w-[265px]">
                  <div className="relative bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl aspect-[9/19] flex items-center justify-center overflow-hidden">
                    <div className="text-center p-4">
                      <div className="text-4xl md:text-6xl mb-4">
                        {screen.icon}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {screen.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* MacbookScroll Section */}
      <section
        id="app-showcase"
        className="relative bg-white dark:bg-black z-10"
      >
        <MacbookScroll
          src="/assets/dashboard_example.png"
          title={
            <span>
              Aplikasi Rijig dibangun dengan teknologi modern. <br />
              <span className="text-green-600 dark:text-green-400">
                Pengalaman pengguna yang luar biasa.
              </span>
            </span>
          }
          landingTargetId="product-showcase"
          landingOffset={-150}
          showGradient={true}
          badge={
            <div className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              Live Demo
            </div>
          }
        />
      </section>

      {/* Product Showcase Section */}
      <section className="relative py-20 bg-gray-50 dark:bg-gray-900 -mt-10 lg:-mt-20 pt-20 lg:pt-40">
        <div className="container mx-auto max-w-[1390px] px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 mb-4"
            >
              Dashboard Analytics
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Dashboard Powerful untuk Monitoring Real-time
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pantau seluruh aktivitas pengelolaan sampah dengan dashboard yang
              informatif, real-time, dan mudah dipahami untuk semua stakeholder.
            </p>
          </div>

          <div className="mb-16" id="product-showcase">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 md:p-8 shadow-2xl relative">
                <div className="aspect-video rounded-xl bg-white dark:bg-gray-900 border-2 border-dashed border-green-400 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                      Dashboard Preview
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <DashboardFeatureCard
              icon={<BarChart3 className="h-7 w-7 text-green-600" />}
              title="Analytics & Insights"
              description="Visualisasi data penjualan, tren harga sampah, dan analisis performa bisnis dalam bentuk grafik yang mudah dipahami."
              features={[
                "Grafik pendapatan harian/bulanan",
                "Analisis jenis sampah terlaris",
                "Perbandingan harga pasar"
              ]}
              iconBg="bg-green-100 dark:bg-green-900"
            />

            <DashboardFeatureCard
              icon={<MapPin className="h-7 w-7 text-blue-600" />}
              title="Live Tracking Map"
              description="Peta interaktif untuk monitoring lokasi pengepul, status pickup, dan optimasi rute penjemputan secara real-time."
              features={[
                "Lokasi pengepul terdekat",
                "Status pickup real-time",
                "Estimasi waktu kedatangan"
              ]}
              iconBg="bg-blue-100 dark:bg-blue-900"
            />

            <DashboardFeatureCard
              icon={<Users className="h-7 w-7 text-purple-600" />}
              title="Network Management"
              description="Kelola jaringan masyarakat, pengepul, dan pengelola dalam satu dashboard terintegrasi dengan fitur komunikasi."
              features={[
                "Database supplier & customer",
                "Rating & review system",
                "In-app messaging"
              ]}
              iconBg="bg-purple-100 dark:bg-purple-900"
            />
          </div>

          <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  2.5 Ton
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Sampah Terkumpul Hari Ini
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  Rp 3.2 Juta
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Transaksi
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  127
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Pickup Selesai
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  98%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Kepuasan Pengguna
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Download CTA Section */}
      <section
        id="download-cta"
        className="py-20 bg-gradient-to-br from-green-500 to-green-700"
      >
        <div className="container mx-auto max-w-[1390px] px-4">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Download Rijig Sekarang & Mulai Kelola Sampah dengan Bijak
              </h2>
              <p className="text-white/90 max-w-3xl mx-auto">
                Bergabunglah dengan ekosistem pengelolaan sampah yang
                berkelanjutan. Dapatkan pendapatan dari sampah, kelola bisnis
                pengepulan, atau optimalisasi supply chain fasilitas daur ulang
                Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button className="bg-black text-white hover:bg-gray-900 text-lg px-8 py-4 shadow-lg rounded-lg">
                  <span className="mr-3 text-2xl">📱</span>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download di</div>
                    <div className="text-sm font-medium">Google Play</div>
                  </div>
                </Button>
                <Button className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 shadow-lg rounded-lg">
                  <Apple className="mr-3 h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download dari</div>
                    <div className="text-sm font-medium">App Store</div>
                  </div>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">50K+</div>
                  <div className="text-white/80 text-sm">Pengguna Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    1000+
                  </div>
                  <div className="text-white/80 text-sm">
                    Pengepul Terdaftar
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">250+</div>
                  <div className="text-white/80 text-sm">Kota di Indonesia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[1160px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Apa Kata Pengguna Rijig
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Testimoni dari berbagai stakeholder yang telah merasakan manfaat
              nyata dari penggunaan platform Rijig dalam pengelolaan sampah
              sehari-hari.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-[785px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Temukan jawaban atas pertanyaan umum tentang Rijig dan cara kerja
              platform pengelolaan sampah terintegrasi kami.
            </p>
          </div>

          <Card className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Artikel & Tips Pengelolaan Sampah
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Pelajari lebih lanjut tentang pengelolaan sampah, tips bisnis
              pengepulan, dan informasi terkini seputar industri daur ulang di
              Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-[925px] px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Mari Terhubung dengan Tim Rijig
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Punya pertanyaan atau ingin bermitra dengan Rijig? Hubungi tim
              kami dan mari bersama-sama membangun ekosistem pengelolaan sampah
              yang berkelanjutan di Indonesia.
            </p>
          </div>

          <Card className="p-6 md:p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="Masukkan nama Anda"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg"
                />
                <Input
                  placeholder="Nama perusahaan/organisasi (opsional)"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg"
                />
                <Input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg"
                />
                <Input
                  placeholder="Nomor telepon"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg"
                />
              </div>
              <Textarea
                rows={6}
                placeholder="Ceritakan tentang Anda dan bagaimana kami bisa membantu dalam pengelolaan sampah"
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg"
              />
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dengan mengklik tombol hubungi kami, Anda menyetujui syarat
                  dan ketentuan yang berlaku
                </p>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg"
                >
                  Hubungi Tim Rijig
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
