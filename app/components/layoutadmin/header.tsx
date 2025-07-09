import { useState } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { ModeToggle } from "~/components/ui/dark-mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "~/components/ui/alert-dialog";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeft,
  Loader2,
  Shield
} from "lucide-react";
import { SessionData } from "~/sessions.server";

interface AdminHeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  user: SessionData;
}

export function AdminHeader({
  onMenuClick,
  sidebarCollapsed,
  isMobile,
  user
}: AdminHeaderProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigation = useNavigation();
  const isLoggingOut = navigation.formAction === "/action/logout";

  const getUserInitials = (email: string) => {
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "AD";
  };

  return (
    <>
      <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-40 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
          {/* Mobile header */}
          <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark: sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
            {/* Hamburger menu button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onMenuClick}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
            >
              {isMobile ? (
                <Menu className="h-5 w-5" />
              ) : sidebarCollapsed ? (
                <PanelLeft className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile logo */}
            <div className="lg:hidden">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  Admin Panel
                </div>
              </div>
            </div>

            {/* Mobile more menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-6 space-y-4">
                  <Button className="w-full" variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    <Badge variant="destructive" className="ml-auto">
                      5
                    </Badge>
                  </Button>
                  <ModeToggle />

                  {/* Mobile Logout */}
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop header actions */}
          <div className="hidden items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0">
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <ModeToggle />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                  >
                    <Bell className="h-4 w-4" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
                    >
                      5
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center justify-between text-gray-900 dark:text-gray-100">
                      Admin Notifications
                      <Badge variant="secondary" className="text-xs">
                        5 new
                      </Badge>
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 dark:text-gray-200 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-red-500">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          New user verification required
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                          2 minutes ago
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-200 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-blue-500">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          New pengelola registration
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                          15 minutes ago
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-200 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-green-500">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          System backup completed
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3 text-xs">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="Admin" />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials(user.email || "Admin")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Administrator
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">
                          {user.email || "admin@example.com"}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                >
                  <div className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200">
                    <div className="font-medium">Administrator</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      {user.email || "admin@example.com"}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Admin Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari admin panel? Anda perlu login
              kembali untuk mengakses sistem administrasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Batal</AlertDialogCancel>
            <Form method="post" action="/action/logout">
              <AlertDialogAction
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Ya, Logout"
                )}
              </AlertDialogAction>
            </Form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
