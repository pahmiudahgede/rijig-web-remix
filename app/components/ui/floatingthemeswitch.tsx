import { Theme, useTheme } from "remix-themes";
import { FloatingDock } from "./floatingdocks";
import { Sun, Moon } from "lucide-react";

interface ThemeFloatingDockProps {
  className?: string;
}

export function ThemeFloatingDock({ className }: ThemeFloatingDockProps) {
  const [theme, setTheme] = useTheme();

  const items = [
    {
      title: "Light Mode",
      icon: (
        <Sun
          className={`h-full w-full ${
            theme === Theme.LIGHT
              ? "text-yellow-500 scale-110"
              : "text-neutral-500 dark:text-neutral-400 scale-90"
          }`}
        />
      ),
      href: "#",
      isActive: theme === Theme.LIGHT,
      onClick: () => setTheme(Theme.LIGHT)
    },
    {
      title: "Dark Mode",
      icon: (
        <Moon
          className={`h-full w-full ${
            theme === Theme.DARK
              ? "text-blue-400 scale-110"
              : "text-neutral-500 dark:text-neutral-400 scale-90"
          }`}
        />
      ),
      href: "#",
      isActive: theme === Theme.DARK,
      onClick: () => setTheme(Theme.DARK)
    }
  ];

  return (
    <FloatingDock
      items={items}
      desktopClassName={className}
      mobileClassName={className}
    />
  );
}
