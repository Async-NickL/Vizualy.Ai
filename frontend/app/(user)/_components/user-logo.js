"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";

const UserLogo = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <img
      src={user.imageUrl}
      alt={user.emailAddresses[0]?.emailAddress || "User"}
      className="w-10 h-10 rounded-full object-cover max-sm:ml-0"
    />
  );
};

export default UserLogo;
