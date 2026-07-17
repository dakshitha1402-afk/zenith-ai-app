"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Pet() {
  const PET_SIZE = 70;

  const [position, setPosition] = useState({
    x: 100,
    y: 200,
  });

  const [message, setMessage] = useState("");

  // Follow mouse on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition((prev) => ({
        x: prev.x + (e.clientX - prev.x - PET_SIZE / 2) * 0.05,
        y: prev.y + (e.clientY - prev.y - PET_SIZE / 2) * 0.05,
      }));
    };

    // Follow finger on mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;

      const touch = e.touches[0];

      setPosition((prev) => ({
        x: prev.x + (touch.clientX - prev.x - PET_SIZE / 2) * 0.05,
        y: prev.y + (touch.clientY - prev.y - PET_SIZE / 2) * 0.05,
      }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const handleTap = () => {
    const msgs = [
      "Hello! 👋",
      "I'm Zenith Fox 🦊",
      "You tapped me ❤️",
      "Let's build something!",
      "I'm following you 👀",
    ];

    const random =
      msgs[Math.floor(Math.random() * msgs.length)];

    setMessage(random);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <>
      {message && (
        <div
          style={{
            position: "fixed",
            left: position.x,
            top: position.y - 45,
            background: "white",
            color: "black",
            padding: "8px 12px",
            borderRadius: "12px",
            zIndex: 9999,
          }}
        >
          {message}
        </div>
      )}

      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{
          left: 0,
          top: 0,
          right: window.innerWidth - PET_SIZE,
          bottom: window.innerHeight - PET_SIZE,
        }}
        onTap={handleTap}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          fontSize: "60px",
          zIndex: 9999,
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        🦊
      </motion.div>
    </>
  );
}
