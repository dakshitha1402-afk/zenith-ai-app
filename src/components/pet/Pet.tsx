"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PET_SIZE = 70;

export default function Pet() {
  const [position, setPosition] = useState({
    x: 100,
    y: 200,
  });

  const [target, setTarget] = useState({
    x: 100,
    y: 200,
  });

  const [message, setMessage] = useState("");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [dragging, setDragging] = useState(false);

  // Follow mouse and finger
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) return;

      setTarget({
        x: e.clientX - PET_SIZE / 2,
        y: e.clientY - PET_SIZE / 2,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragging || e.touches.length === 0) return;

      setTarget({
        x: e.touches[0].clientX - PET_SIZE / 2,
        y: e.touches[0].clientY - PET_SIZE / 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [dragging]);

  // Smooth movement
  useEffect(() => {
    const interval = setInterval(() => {
      if (dragging) return;

      setPosition((prev) => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Stop when close enough
        if (distance < 150) {
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

  // Random wandering every 15 seconds
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
    const messages = [
      "Hello! 👋",
      "I'm Zenith Fox 🦊",
      "Thanks for the pet ❤️",
      "Let's build something!",
      "Following you 👀",
      "Zenith AI is awesome 🚀",
    ];

    setMessage(
      messages[Math.floor(Math.random() * messages.length)]
    );

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
            left: position.x + 20,
            top: position.y - 50,
            background: "white",
            color: "black",
            padding: "8px 12px",
            borderRadius: "12px",
            zIndex: 10000,
            pointerEvents: "none",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
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

          const newX = Math.max(
            0,
            Math.min(
              window.innerWidth - PET_SIZE,
              position.x + info.offset.x
            )
          );

          const newY = Math.max(
            0,
            Math.min(
              window.innerHeight - PET_SIZE,
              position.y + info.offset.y
            )
          );

          setPosition({
            x: newX,
            y: newY,
          });

          setTarget({
            x: newX,
            y: newY,
          });
        }}
        onTap={handleTap}
        animate={{
          x: position.x,
          y: position.y,
          scale: dragging ? 1.1 : 1,
          scaleX: direction === "left" ? -1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
        }}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 9999,
          fontSize: "60px",
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        🦊
      </motion.div>
    </>
  );
}
