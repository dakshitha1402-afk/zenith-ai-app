"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Pet() {
  const [position, setPosition] = useState({
    x: 100,
    y: 100,
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const movePet = () => {
      const x = Math.random() * (window.innerWidth - 80);
      const y = Math.random() * (window.innerHeight - 120);

      setPosition({ x, y });
    };

    const interval = setInterval(movePet, 4000);

    return () => clearInterval(interval);
  }, []);

  const petMessages = [
    "Hello!",
    "I'm Zenith Fox!",
    "Pet me!",
    "Let's build something!",
    "You're awesome!",
  ];

  const handleClick = () => {
    const random =
      petMessages[Math.floor(Math.random() * petMessages.length)];

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
            top: position.y - 50,
            zIndex: 9999,
            background: "white",
            padding: "8px",
            borderRadius: "10px",
            color: "black",
          }}
        >
          {message}
        </div>
      )}

      <motion.div
        drag
        dragMomentum={false}
        onClick={handleClick}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          width: 80,
          height: 80,
          zIndex: 9999,
          fontSize: "60px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        🦊
      </motion.div>
    </>
  );
}
