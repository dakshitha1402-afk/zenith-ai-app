"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePet } from "@/context/PetContext";

const PET_SIZE = 70;

export default function Pet() {
  const { petMessage, showPetMessage } = usePet();

  const [position, setPosition] = useState({
    x: 100,
    y: 200,
  });

  const [target, setTarget] = useState({
    x: 100,
    y: 200,
  });

  const [direction, setDirection] = useState<"left" | "right">("right");
  const [dragging, setDragging] = useState(false);

  // Follow mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) return;

      setTarget({
        x: e.clientX - PET_SIZE / 2,
        y: e.clientY - PET_SIZE / 2,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragging) return;
      if (e.touches.length === 0) return;

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

        if (distance < 10) {
          return prev;
        }

        const newX = prev.x + dx * 0.08;
        const newY = prev.y + dy * 0.08;

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

  // Wander every 15 sec
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
      "Zenith AI is awesome 🚀",
    ];

    showPetMessage(
      msgs[Math.floor(Math.random() * msgs.length)]
    );
  };

  return (
    <>
      {petMessage && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            left: position.x + 20,
            top: position.y - 55,
            background: "white",
            color: "black",
            padding: "8px 14px",
            borderRadius: "14px",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            zIndex: 10000,
            pointerEvents: "none",
            maxWidth: "220px",
            textAlign: "center",
          }}
        >
          {petMessage}
        </motion.div>
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
