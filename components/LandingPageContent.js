'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Send, ShieldCheck, ArrowRight, Star, Coffee, Camera, Music } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import HeroImage from './HeroImage';
import FloatingHearts from './FloatingHearts';
import HeartBurst from './HeartBurst';
import '../app/landing.css';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPageContent() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const burstRef = useRef(null);

  if (!mounted) return null;

  const triggerBurst = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (burstRef.current) {
          burstRef.current.burst(x, y);
      }
  };

  return (
    <main className="landing-container">
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <FloatingHearts count={20} />
      <HeartBurst ref={burstRef} />
      
      <motion.nav 
        className="navbar" 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="logo" onClick={triggerBurst} style={{ cursor: 'pointer' }}>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={32} fill="#ff4d79" stroke="none" />
          </motion.div>
          <span>ValenTiny</span>
        </div>
        <motion.a 
            href="/builder"
            className="nav-btn"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerBurst}
        >
            Get Started
        </motion.a>
      </motion.nav>

      <header className="hero">
        <motion.div 
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={fadeIn}>
            <Sparkles size={16} />
            <span>Most Loved Valentine's Builder 2025</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn}>
            Your Perfect <span className="gradient-text">Valentine's</span> Surprise in Seconds
          </motion.h1>
          
          <motion.p variants={fadeIn}>
            Create an interactive, personalized proposal page that will make them fall in love all over again. Get notified instantly when the magic happens! ❤️
          </motion.p>
          
          <motion.div className="hero-cta" variants={fadeIn}>
            <motion.a 
              href="/builder"
              className="primary-btn"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={triggerBurst}
            >
              Create Your Proposal — ₹49
              <ArrowRight size={24} />
            </motion.a>
            <p className="subtext">✨ No coding required • Join 5,000+ happy couples</p>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          style={{ y: y1 }}
        >
          <div className="blobs">
            <motion.div 
              className="blob blob-1"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="blob blob-2"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Decorative Icons */}
          <motion.div style={{ position: 'absolute', top: -20, left: -40, opacity }} animate={{ y: [0, 15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Star color="#ff4d79" size={32} />
          </motion.div>
          <motion.div style={{ position: 'absolute', bottom: 40, right: -20, opacity }} animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            <Music color="#0ea5e9" size={28} />
          </motion.div>

          <motion.div
            className="hero-visual-container"
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 1, delay: 0.5, ease: "backOut" }}
          >
            <HeroImage />
          </motion.div>
        </motion.div>
      </header>

      <section className="features">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
           <h2>Features to Melt Their Heart</h2>
           <p>Everything you need to create a professional proposal page.</p>
        </motion.div>
        
        <div className="features-grid">
          {[
            { Icon: Send, title: "Emails on YES", text: "Receive an instant notification the second they click 'Yes', so you can celebrate together immediately." },
            { Icon: Sparkles, title: "Interactive Magic", text: "Stunning confetti effects, bouncier buttons, and smooth animations that create a premium feel." },
            { Icon: ShieldCheck, title: "One-Time Payment", text: "No subscriptions. Pay ₹49 once and your proposal page is live forever for your special someone." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              className="feature-card" 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={triggerBurst}
              style={{ cursor: 'pointer' }}
            >
              <feature.Icon className="f-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="how-it-works">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div className="section-header">
                <h2>Three Simple Steps</h2>
                <p>From zero to "YES!" in less than 2 minutes.</p>
            </div>
            <div className="steps-container">
            {[
                { num: "01", title: "Build", text: "Fill in names, upload your favorite photo, and craft the perfect question." },
                { num: "02", title: "Review", text: "Preview your creation across devices and pay a small fee to publish." },
                { num: "03", title: "Surprise", text: "Share the link and wait for the best notification of your life!" }
            ].map((step, idx) => (
                <div key={idx} className="step-card">
                    <div className="step-number">{step.num}</div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                </div>
            ))}
            </div>
        </motion.div>
      </section>

      <section className="testimonials">
         <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
         >
            <h2>Real Success Stories</h2>
            <p>Join thousands of couples who found their "Yes" with ValenTiny.</p>
         </motion.div>
         <div className="testimonials-grid">
            {[
                { text: "\"I wanted something different from a basic WhatsApp text. This was so much better. The animations are top-notch!\"", author: "Varun K." },
                { text: "\"The build process took me less than 2 minutes. She was so surprised when she opened the link!\"", author: "Ishani P." }
            ].map((t, idx) => (
                <motion.div 
                    key={idx} 
                    className="testimonial-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <p>{t.text}</p>
                    <div className="author">{t.author}</div>
                </motion.div>
            ))}
         </div>
      </section>

      <footer className="footer">
        <div className="logo" style={{ justifyContent: 'center' }}>
          <Heart size={32} fill="#ff4d79" stroke="none" />
          <span>ValenTiny</span>
        </div>
        <p>&copy; {new Date().getFullYear()} ValenTiny. Crafted with ❤️ for lovers everywhere.</p>
        <div className="legal-links">
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/affiliate">Become a Partner</Link>
        </div>
      </footer>
    </main>

  );
}
