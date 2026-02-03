'use client';
import { motion } from 'framer-motion';

export default function HeroImage() {
  return (
    <div className="hero-img-wrapper" style={{ position: 'relative', width: '100%', borderRadius: '2rem' }}>
      <img 
        src="/images/hero-mockup.png" 
        alt="ValenTiny Preview" 
        className="hero-img" 
        style={{ 
          width: '100%', 
          height: 'auto', 
          display: 'block',
          borderRadius: '2rem',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
        }} 
      />
      <div 
        className="hero-img-fallback" 
        style={{ 
          display: 'none',
          width: '100%',
          aspectRatio: '9/16',
          background: 'linear-gradient(135deg, #ff4d79 0%, #ff8fa3 100%)',
          borderRadius: '2rem',
          boxShadow: '0 20px 50px rgba(255, 77, 121, 0.3)',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '900',
          fontSize: '1.5rem',
          textAlign: 'center',
          padding: '40px',
          border: '4px solid white',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <span style={{ fontSize: '3rem' }}>❤️</span>
        <span>Your Personalized <br/> Proposal Page</span>
      </div>
      
      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-5%', right: '-5%', padding: '10px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
      >
        💌 Sent!
      </motion.div>
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', bottom: '10%', left: '-8%', padding: '10px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
      >
        💍 She said Yes!
      </motion.div>
    </div>
  );
}
