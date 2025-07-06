import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Menu,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Recycle,
  ArrowUp
} from "lucide-react";
import { ModeToggle } from "~/components/ui/dark-mode-toggle";

export const meta: MetaFunction = () => {
  return [
    { title: "Rijig - Platform Pengelolaan Sampah Terpadu" },
    {
      name: "description",
      content:
        "Platform pengelolaan sampah terpadu yang menghubungkan masyarakat, pengepul, dan pengelola untuk ekonomi sirkular berkelanjutan"
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const navigationItems = [
    { name: "Fitur", href: "#features" },
    { name: "Tentang", href: "#about" },
    { name: "Cara Kerja", href: "#work-process" },
    { name: "Testimoni", href: "#testimonials" },
    { name: "Kontak", href: "#support" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "facebook", href: "#" },
    { name: "Twitter", icon: "twitter", href: "#" },
    { name: "LinkedIn", icon: "linkedin", href: "#" },
    { name: "Instagram", icon: "instagram", href: "#" }
  ];

  const authData = {
    isAuthenticated: false,
    isRegistrationComplete: false,
    userRole: null as string | null
  };

  return json({
    navigationItems,
    socialLinks,
    authData
  });
}

export default function LandingLayout() {
  const { navigationItems, socialLinks, authData } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { isAuthenticated, isRegistrationComplete, userRole } = authData;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      setIsScrolled(scrollTop > 20);
      setShowBackToTop(scrollTop > 300);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const getRedirectPath = () => {
    if (userRole === "administrator") {
      return "/sys-rijig-adminpanel/dashboard";
    }
    return "/pengelola/dashboard";
  };

  const handleGetStarted = () => {
    if (isAuthenticated && isRegistrationComplete) {
      const dashboardPath =
        userRole === "administrator"
          ? "/sys-rijig-adminpanel/dashboard"
          : "/pengelola/dashboard";
      navigate(dashboardPath);
    } else if (isAuthenticated && !isRegistrationComplete) {
      const redirectPath = getRedirectPath();
      navigate(redirectPath);
    } else {
      navigate("/pengelola/register");
    }
  };

  const handleAdminLogin = () => {
    navigate("/sys-rijig-adminpanel/login");
  };

  const getButtonText = () => {
    if (isAuthenticated && isRegistrationComplete) {
      return "Go to Dashboard";
    }
    return "Get Started";
  };

  return (
    <div className="min-h-screen">
      {/* Header dengan glassmorphism effect */}
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/20"
            : "bg-transparent backdrop-blur-none border-transparent shadow-none"
        }`}
      >
        <div className="container mx-auto max-w-[1400px] px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-700 ${
                  isScrolled
                    ? "bg-green-600 shadow-lg"
                    : "bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30"
                }`}
              >
                <Recycle
                  className={`h-5 w-5 transition-all duration-700 ${
                    isScrolled
                      ? "text-white"
                      : "text-green-600 dark:text-green-400 drop-shadow-md"
                  }`}
                />
              </div>
              <div
                className={`text-2xl font-bold transition-all duration-700 ${
                  isScrolled
                    ? "text-black dark:text-white"
                    : "text-white dark:text-white drop-shadow-lg"
                }`}
              >
                Rijig
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden transition-all duration-700 ${
                isScrolled
                  ? "text-black dark:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                  : "text-white dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-sm"
              }`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-base font-medium transition-all duration-700 hover:scale-105 ${
                      isScrolled
                        ? "text-black dark:text-white hover:text-green-600 dark:hover:text-green-400"
                        : "text-white dark:text-white hover:text-green-200 dark:hover:text-green-300 drop-shadow-lg hover:drop-shadow-xl"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div
                className={`transition-all duration-700 ${
                  isScrolled
                    ? "text-black dark:text-white"
                    : "text-white dark:text-white"
                }`}
              >
                <ModeToggle />
              </div>
              <Button
                onClick={handleGetStarted}
                className={`transition-all duration-700 shadow-lg hover:scale-105 rounded-lg ${
                  isScrolled
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                    : "bg-green-600/90 hover:bg-green-700/90 text-white backdrop-blur-sm border border-green-500/30 shadow-green-600/30"
                }`}
              >
                {getButtonText()}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "max-h-96 opacity-100 pb-4"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div
              className={`rounded-xl mt-2 transition-all duration-700 ${
                isScrolled
                  ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl"
                  : "bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border border-white/20 dark:border-gray-700/20"
              }`}
            >
              <nav className="space-y-4 p-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`block w-full text-left text-base font-medium transition-all duration-700 hover:scale-105 ${
                      isScrolled
                        ? "text-black dark:text-white hover:text-green-600"
                        : "text-white dark:text-white hover:text-green-200"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}

                <Separator
                  className={`my-4 ${
                    isScrolled
                      ? "bg-gray-200/60 dark:bg-gray-700/60"
                      : "bg-white/40 dark:bg-gray-700/40"
                  }`}
                />

                {/* Mobile Actions */}
                <div className="flex items-center justify-between">
                  <div
                    className={`transition-all duration-700 ${
                      isScrolled
                        ? "text-black dark:text-white"
                        : "text-white dark:text-white"
                    }`}
                  >
                    <ModeToggle />
                  </div>
                  <Button
                    onClick={handleGetStarted}
                    size="sm"
                    className={`hover:scale-105 transition-all duration-700 rounded-lg ${
                      isScrolled
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600/90 hover:bg-green-700/90 text-white backdrop-blur-sm border border-green-500/30"
                    }`}
                  >
                    {getButtonText()}
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-300 hover:scale-110 ${
          showBackToTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      {/* Footer */}
      <footer className="bg-green-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-[1390px] px-4 py-8">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <Recycle className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-black dark:text-white">
                    Rijig
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-[320px]">
                  Platform pengelolaan sampah terpadu yang menghubungkan
                  masyarakat, pengepul, dan pengelola untuk ekonomi sirkular
                  berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-600 dark:bg-green-700 py-6">
          <div className="container mx-auto max-w-[1390px] px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white text-center md:text-left mb-4 md:mb-0">
                © 2025 Rijig - layout inspired by appline
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80 hover:bg-green-700 transition-all hover:scale-110 rounded-lg"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80 hover:bg-green-700 transition-all hover:scale-110 rounded-lg"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80 hover:bg-green-700 transition-all hover:scale-110 rounded-lg"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white/80 hover:bg-green-700 transition-all hover:scale-110 rounded-lg"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-6 text-white text-sm">
                  <button className="hover:text-white/80 transition-colors hover:scale-105">
                    Kebijakan Privasi
                  </button>
                  <button className="hover:text-white/80 transition-colors hover:scale-105">
                    Syarat & Ketentuan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
