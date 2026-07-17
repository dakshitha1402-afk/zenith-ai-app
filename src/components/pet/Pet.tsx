"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Pet() {
  const [position, setPosition] = useState({
    x: 100,
    y: 100,
  });

  const [message, setMessage] = useState("");
  const [facingRight, setFacingRight] = useState(true);
  const [dragging, setDragging] = useState(false);

  const petMessages = [
    "Hello!",
    "I'm Zenith Fox!",
    "Pet me!",
    "Let's build something!",
    "You're awesome!",
    "Tap somewhere and I'll go there!",
    "Drag me around!",
  ];

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const handleClick = () => {
    const random =
      petMessages[Math.floor(Math.random() * petMessages.length)];

    showMessage(random);
  };

  // Move to tapped location
  useEffect(() => {
    const handleScreenTap = (e) => {
      // Ignore taps on the fox itself
      if (e.target.closest(".fox-pet")) return;

      const x = e.clientX - 40;
      const y = e.clientY - 40;

      setFacingRight(x > position.x);
      setPosition({
        x: Math.max(0, Math.min(x, window.innerWidth - 80)),
        y: Math.max(0, Math.min(y, window.innerHeight - 80)),
      });
    };

    window.addEventListener("click", handleScreenTap);

    return () => {
      window.removeEventListener("click", handleScreenTap);
    };
  }, [position.x]);

  // Random wandering while idle
  useEffect(() => {
    const interval = setInterval(() => {
      if (dragging) return;

      const x = Math.random() * (window.innerWidth - 80);
      const y = Math.random() * (window.innerHeight - 120);

      setFacingRight(x > position.x);
      setPosition({ x, y });
    }, 8000);

    return () => clearInterval(interval);
  }, [dragging, position.x]);

  return (
    <>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y - 55,
            zIndex: 9999,
            background: "white",
            padding: "8px 12px",
            borderRadius: "12px",
            color: "black",
            pointerEvents: "none",
          }}
        >
          {message}
        </motion.div>
      )}

      <motion.div
        className="fox-pet"
        drag
        dragMomentum={false}
        onDragStart={() => setDragging(true)}
        onDragEnd={(event, info) => {
          setDragging(false);

          setFacingRight(info.point.x > position.x);

          setPosition({
            x: info.point.x - 40,
            y: info.point.y - 40,
          });
        }}
        onClick={handleClick}
        animate={{
          x: position.x,
          y: position.y,
          scale: dragging ? 1.15 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 15,
        }}
        style={{
          position: "fixed",
          width: 80,
          height: 80,
          zIndex: 9999,
          fontSize: "60px",
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: facingRight ? "scaleX(1)" : "scaleX(-1)",
        }}
        whileTap={{
          scale: 1.25,
          rotate: [-10, 10, -10, 0],
        }}
      >
        🦊
      </motion.div>
    </>
  );
}
