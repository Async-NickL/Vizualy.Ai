"use client";
import { motion } from "motion/react";
import React from "react";

export const LoaderOne = () => {
  const transition = (x) => ({
    duration: 1,
    repeat: Infinity,
    repeatType: "loop",
    delay: x * 0.2,
    ease: "easeInOut",
  });
  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={transition(0)}
        className="h-4 w-4 rounded-full border border-primary bg-gradient-to-b from-primary/80 to-primary"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={transition(1)}
        className="h-4 w-4 rounded-full border border-primary bg-gradient-to-b from-primary/80 to-primary"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={transition(2)}
        className="h-4 w-4 rounded-full border border-primary bg-gradient-to-b from-primary/80 to-primary"
      />
    </div>
  );
};
