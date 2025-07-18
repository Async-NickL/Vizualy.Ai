"use client";
import Image from "next/image";
import ShinyText from "@/components/ui/shinyText";

const Logo = () => (
  <a
    href="/"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
  >
    <Image src="/logo.png" alt="Vizualy Logo" height={28} width={28} />
    <ShinyText
      text={"Vizualy.Ai"}
      className="font-medium text-xl whitespace-pre text-[var(--foreground)]"
    />
  </a>
);

export default Logo;
