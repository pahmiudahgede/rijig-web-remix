import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  const lightModeColors = [
    "rgb(59 130 246)",
    "rgb(236 72 153)",
    "rgb(16 185 129)",
    "rgb(245 158 11)",
    "rgb(239 68 68)",
    "rgb(139 92 246)",
    "rgb(99 102 241)",
    "rgb(168 85 247)",
    "rgb(6 182 212)"
  ];

  const darkModeColors = [
    "rgb(30 58 138)",
    "rgb(190 24 93)",
    "rgb(22 101 52)",
    "rgb(146 64 14)",
    "rgb(153 27 27)",
    "rgb(124 58 237)",
    "rgb(55 48 163)",
    "rgb(107 33 168)",
    "rgb(22 78 99)"
  ];

  const getRandomColor = () => {
    const colors = isDarkMode ? darkModeColors : lightModeColors;
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Theme-aware styles
  const getThemeStyles = () => {
    if (isDarkMode) {
      return {
        borderColor: "rgba(71, 85, 105, 0.3)",
        strokeColor: "rgba(71, 85, 105, 0.4)",
        backgroundColor: "rgba(15, 23, 42, 0.1)"
      };
    } else {
      return {
        borderColor: "rgba(148, 163, 184, 0.2)",
        strokeColor: "rgba(100, 116, 139, 0.3)",
        backgroundColor: "rgba(248, 250, 252, 0.1)"
      };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
        backgroundColor: themeStyles.backgroundColor
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4 transition-colors duration-300",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-8 w-16"
          style={{
            borderLeft: `1px solid ${themeStyles.borderColor}`,
            transition: "border-color 0.3s ease"
          }}
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `${getRandomColor()}`,
                transition: { duration: 0 }
              }}
              animate={{
                transition: { duration: 2 }
              }}
              key={`col` + j}
              className="relative h-8 w-16"
              style={{
                borderTop: `1px solid ${themeStyles.borderColor}`,
                borderRight: `1px solid ${themeStyles.borderColor}`,
                transition: "border-color 0.3s ease"
              }}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke={themeStyles.strokeColor}
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] transition-colors duration-300"
                  style={{
                    stroke: themeStyles.strokeColor,
                    transition: "stroke 0.3s ease"
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
