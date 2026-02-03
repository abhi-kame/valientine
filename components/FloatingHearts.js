'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingHearts({ count = 15 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
      const colors = ['#ff4d79', '#ff8fa3', '#ffc1cc', '#ffffff', '#e11d48'];
      const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setHearts(newHearts);
  }, [count]);

  return (
    <div className="floating-hearts-container">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="floating-heart-bg"
          initial={{ bottom: '-10vh', left: `${heart.x}vw`, opacity: 0, scale: 0 }}
          animate={{
            bottom: '110vh',
            opacity: [0, 0.8, 0],
            scale: heart.scale,
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <Heart fill={heart.color} color={heart.color} size={30} />
        </motion.div>
      ))}
      <style jsx>{`
        .floating-hearts-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
