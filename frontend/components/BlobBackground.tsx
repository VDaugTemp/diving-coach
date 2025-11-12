"use client";

import { motion } from "framer-motion";

/**
 * Animated blob background component using header gradient colors
 * Creates subtle moving blobs with the same colors as the header gradient
 */
export default function BlobBackground() {
  // Colors from header gradient: #3b82f6 (blue), #8b5cf6 (purple), #ec4899 (pink)
  const colors = [
    { color: "#3b82f6", opacity: 0.15 }, // blue
    { color: "#8b5cf6", opacity: 0.12 }, // purple
    { color: "#ec4899", opacity: 0.1 },  // pink
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {colors.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            backgroundColor: blob.color,
            opacity: blob.opacity,
            width: `${300 + index * 100}px`,
            height: `${300 + index * 100}px`,
          }}
          animate={{
            x: [
              `${50 + index * 20}%`,
              `${60 + index * 15}%`,
              `${50 + index * 20}%`,
            ],
            y: [
              `${30 + index * 10}%`,
              `${40 + index * 5}%`,
              `${30 + index * 10}%`,
            ],
            scale: [1, 1.1 + index * 0.05, 1],
          }}
          transition={{
            duration: 20 + index * 5, // Slow, subtle movement
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

