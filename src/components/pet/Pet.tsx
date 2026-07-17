"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Pet() {
  const [x, setX] = useState(100);

  useEffect(() => {
    const movePet = () => {
      const maxX = window.innerWidth - 100;
      const nextX = Math.random() * maxX;
      setX(nextX);
    };

    movePet();

    const interval = setInterval(movePet, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ x }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
      className="fixed bottom-4 left-0 z-[9999] text-5xl select-none pointer-events-none"
    >
      🦊
    </motion.div>
  );
}
