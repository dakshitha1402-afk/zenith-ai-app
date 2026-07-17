"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PET_SIZE = 70;

export default function Pet() {
  const [position, setPosition] = useState({
    x: 100,
    y: 200,
  });

  const [target, setTarget] = useState(position);
  const [message, setMessage] = useState("");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [dragging, setDragging] = useState(false);

  // Mouse follow
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (dragging) return;

      setTarget({
        x: e.clientX - PET_SIZE / 2,
        y: e.clientY - PET_SIZE / 2,
      });
    };

    const touchMove = (e: TouchEvent) => {
      if (dragging || e.touches.length === 0) return;

      setTarget({
        x: e.touches[0].clientX - PET_SIZE / 2,
        y: e.touches[0].clientY - PET_SIZE / 2,
      });
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("touchmove", touchMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("touchmove", touchMove);
    };
  }, [dragging]);

  // Smooth walking
  useEffect(() => {
    const interval = setInterval(() => {
      if (dragging) return;

      setPosition((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Stop when close enough
        if (distance < 20) {
          return prev;
        }

        const newX = prev.x + dx * 0.05;
        const newY = prev.y + dy * 0.05;

        setDirection(dx > 0 ? "right" : "left");

        return {
          x: Math.max(
            0,
            Math.min(window.innerWidth - PET_SIZE, newX)
          ),
          y: Math.max(
            0,
            Math.min(window.innerHeight - PET_SIZE, newY)
          ),
        };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [target, dragging]);

  // Random wandering
  useEffect(() => {
    const wander = setInterval(() => {
      if (dragging) return;

      setTarget({
        x: Math.random() * (window.innerWidth - PET_SIZE),
        y: Math.random() * (window.innerHeight - PET_SIZE),
      });
    }, 15000);

    return () => clearInterval(wander);
  }, [dragging]);

  const handleTap = () => {
    const msgs = [
      "Hello! 👋",
      "I'm Zenith Fox 🦊",
      "Thanks for the pet ❤️",
      "Let's build something!",
      "Following you 👀",
      "This app is awesome 🚀",
    ];

    setMessage(
      msgs[Math.floor(Math.random() * msgs.length)]
    );

    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <>
      {message && (
        <div
          style={{
            position: "fixed",
            left: position.x + 20,
            top: position.y - 50,
            background: "white",
            color: "black",
            padding: "8px 12px",
            borderRadius: "12px",
            zIndex: 10000,
            pointerEvents: "none",
          }}
        >
          {message}
        </div>
      )}

      <motion.div
        drag
        dragMomentum={false}
        onDragStart={() => setDragging(true)}
        onDragEnd={(event, info) => {
          setDragging(false);

          const x = Math.max(
            0,
            Math.min(window.innerWidth - PET_SIZE, info.point.x)
          );

          const y = Math.max(
            0,
            Math.min(window.innerHeight - PET_SIZE, info.point.y)
          );

          setPosition({ x, y });
          setTarget({ x, y });
        }}
        onTap={handleTap}
        animate={{
          x: position.x,
          y: position.y,
          scale: dragging ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
        }}
        style={{
          position: "fixed",
          zIndex: 9999,
          fontSize: "60px",
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          transform:
            direction === "left"
              ? "scaleX(-1)"
              : "scaleX(1)",
        }}
      >
        🦊
      </motion.div>
    </>
  );
}
