"use client";
import Image from "next/image";

const LogoIcon = () => (
  <h1
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
  >
    <Image src="/logo.png" alt="Vizualy Logo" height={28} width={28} />
  </h1>
);

export default LogoIcon;
