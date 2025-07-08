import { useState, useEffect } from "react";
import { PengelolaSidebar } from "./sidebar";
import { PengelolaHeader } from "./header";
import { SessionData } from "~/sessions.server"; // Import SessionData type

interface PengelolaLayoutWrapperProps {
  children: React.ReactNode;
  user: SessionData; // Add user prop
}

export function PengelolaLayoutWrapper({
  children,
  user
}: PengelolaLayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const sidebarWidth = sidebarCollapsed && !isHovered ? "80px" : "290px";
  const contentMargin = isMobile ? "0" : sidebarWidth;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <PengelolaSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        isHovered={isHovered}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // user={user}
      />

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isMobile ? "0" : contentMargin
        }}
      >
        <PengelolaHeader
          onMenuClick={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          user={user}
        />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
