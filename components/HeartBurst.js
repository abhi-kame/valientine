'use client';

import { useState, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FloatingHeart = ({ x, y, onComplete }) => {
    // Randomize the movement direction slightly
    // Mainly upwards (-y) but with some horizontal spread (x)
    const distinctId = Math.random();
    
    return (
        <motion.div
            initial={{ x, y, scale: 0, opacity: 1 }}
            animate={{ 
                x: x + (Math.random() - 0.5) * 150, 
                y: y - Math.random() * 200 - 50,
                opacity: 0,
                scale: Math.random() * 0.5 + 0.8,
                rotate: Math.random() * 90 - 45
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={onComplete}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999
            }}
        >
            <Heart fill="#ff4d79" color="#ff4d79" size={Math.random() * 10 + 15} />
        </motion.div>
    );
};

const HeartBurst = forwardRef((props, ref) => {
    const [hearts, setHearts] = useState([]);

    useImperativeHandle(ref, () => ({
        burst: (x, y) => {
            const count = 12; // Number of hearts per click
            const newHearts = Array.from({ length: count }).map(() => ({
                id: Math.random().toString(36).substr(2, 9) + Date.now(),
                x,
                y
            }));
            setHearts(prev => [...prev, ...newHearts]);
        }
    }));

    const removeHeart = (id) => {
        setHearts(prev => prev.filter(h => h.id !== id));
    };

    return (
        <>
            {hearts.map(heart => (
                <FloatingHeart 
                    key={heart.id} 
                    x={heart.x} 
                    y={heart.y} 
                    onComplete={() => removeHeart(heart.id)} 
                />
            ))}
        </>
    );
});

export default HeartBurst;
