"use client";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcher from "@/components/ui/theme-switcher";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

const UserNavbar = () => {
  const { resolvedTheme } = useTheme();
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="top-0 right-0 z-50 gap-3 absolute h-14 py-5 px-3 w-auto flex justify-end items-center max-md:right-auto max-md:left-0">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-md ml-2" />
      </div>
    );
  }

  return (
    <div className="top-0 right-0 z-50 gap-3 absolute h-14 py-5 px-3 w-auto flex justify-end items-center max-md:right-auto max-md:left-0">
      <UserButton
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />
      <ThemeSwitcher />
    </div>
  );
};

export default UserNavbar;
