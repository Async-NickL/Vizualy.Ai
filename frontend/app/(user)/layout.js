"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { cn } from "@/lib/utils";
import { History, MessageCirclePlusIcon } from "lucide-react";
import Logo from "./_components/logo";
import LogoIcon from "./_components/logo-icon";
import UserNavbar from "./_components/user-navbar";
import { useSyncUser } from "@/hooks/useSyncUser";
import ChatHistory from "./_components/history";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const UserLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { syncing } = useSyncUser();

  useEffect(() => {
    if (syncing) {
      toast.loading("Syncing user data...");
    } else {
      toast.dismiss();
    }
  }, [syncing]);

  if (syncing) {
    return (
      <div className="w-full h-screen flex flex-col bg-[var(--background)]">
        {/* Mobile: Full screen skeleton */}
        <div className="md:hidden w-full h-screen flex flex-col">
          {/* Top bar skeleton */}
          <div className="h-16 flex items-center justify-between px-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>

          {/* Content area skeleton */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full space-y-4">
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-16 w-5/6" />
                <Skeleton className="h-20 w-4/5" />
              </div>
            </div>
          </div>

          {/* Bottom input skeleton */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Skeleton className="h-11 w-11" />
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 w-20" />
            </div>
          </div>
        </div>

        {/* Desktop: Sidebar + content layout */}
        <div className="hidden md:flex w-full h-screen">
          {/* Sidebar Skeleton */}
          <div className="w-64 h-screen bg-[var(--card)] border-r border-border p-4">
            <div className="flex flex-col gap-6">
              {/* Logo Skeleton */}
              <Skeleton className="h-8 w-32" />

              {/* Navigation Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Chat History Skeleton */}
              <div className="space-y-2 mt-8">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 h-screen flex flex-col">
            {/* Navbar Skeleton */}
            <div className="h-16 border-b border-border flex items-center justify-between px-6">
              <Skeleton className="h-6 w-24" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-4xl space-y-6">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-24 w-5/6" />
                  <Skeleton className="h-28 w-4/5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full h-screen bg-[var(--background)]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-[var(--card)]">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              <SidebarLink
                link={{
                  label: "New Chat",
                  href: "/chat/new",
                  icon: (
                    <MessageCirclePlusIcon className="h-6 w-6 shrink-0 text-primary" />
                  ),
                }}
                className={"font-medium"}
              />
              <SidebarLink
                link={{
                  label: "Recents",
                  href: "/chat/new",
                  icon: <History className="h-6 w-6 shrink-0 text-primary" />,
                }}
                className={
                  "pointer-events-none select-none font-medium opacity-70"
                }
              />
            </div>
            <div className="flex flex-1 flex-col overflow-x-hidden mt-2 ml-2 overflow-y-auto">
              {open ? <ChatHistory /> : null}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="h-screen flex justify-center w-full items-center overflow-y-auto">
        <UserNavbar />
        <div className="w-full flex justify-center items-center">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
