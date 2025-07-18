"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { cn } from "@/lib/utils";
import { History, MessageCirclePlusIcon } from "lucide-react";
import Logo from "./_components/logo";
import LogoIcon from "./_components/logo-icon";
import UserNavbar from "./_components/user-navbar";

const UserLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

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
            <div className="flex flex-1 flex-col overflow-x-hidden mt-2 ml-7 overflow-y-auto"></div>
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="h-screen w-full overflow-y-auto">
        <UserNavbar />
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
