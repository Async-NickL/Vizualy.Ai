"use client";

import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { key: "light", icon: Sun, label: "Light" },
    { key: "dark", icon: Moon, label: "Dark" },
    { key: "system", icon: Monitor, label: "System" },
  ];

  if (!mounted) {
    return (
      <div className="relative inline-flex bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-1 h-8 w-24" />
    );
  }

  return (
    <div className="relative inline-flex bg-[var(--card)] dark:bg-[var(--card)] rounded-lg p-1">
      {themes.map(({ key, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className="relative z-10 flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-200"
        >
          {theme === key && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-primary/50 dark:bg-primary/50 rounded-md shadow-sm"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          )}
          <Icon
            size={16}
            className={`relative z-10 ${
              theme === key
                ? "text-[var(--foreground)]"
                : "text-[var(--muted-foreground)]"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
