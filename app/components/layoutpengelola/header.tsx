import { useState } from "react";
import { Form } from "@remix-run/react";
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
  PanelLeft
} from "lucide-react";
import { SessionData } from "~/sessions.server"; // Import SessionData type

interface PengelolaHeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  user: SessionData; // Add user prop
}

export function PengelolaHeader({
  onMenuClick,
  sidebarCollapsed,
  isMobile,
  user // Add user prop
}: PengelolaHeaderProps) {
  // const [isDark, setIsDark] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
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
            <div className="w-24 h-6 bg-gray-800 dark:bg-white rounded flex items-center justify-center text-white dark:text-gray-900 text-xs font-bold">
              LOGO
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
                    3
                  </Badge>
                </Button>
                <ModeToggle />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop search - Commented out for now */}
          {/* <div className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Search or type command..."
                className="w-96 pl-10 pr-14 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <kbd className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div> */}
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
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center justify-between text-gray-900 dark:text-gray-100">
                    Notifications
                    <Badge variant="secondary" className="text-xs">
                      3 new
                    </Badge>
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-200 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-blue-500">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        New user registered
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                        2 minutes ago
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-200 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-green-500">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        System update available
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                        1 hour ago
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-200 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-orange-500">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        New message received
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                        3 hours ago
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
                      <AvatarImage
                        src={""}
                        alt={"User"}
                      />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getUserInitials("User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.sessionId || "User"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        {user.role || "Pengelola"}
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
                  <div className="font-medium">{user.phone || "User"}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    {user.email || "user@example.com"}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Form action="/logout" method="post" className="w-full">
                    <button
                      type="submit"
                      className="flex w-full items-center text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </Form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
