'use client';

import Link from 'next/link';
import { Heart, Sparkles, Send, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">
          <Heart className="heart-icon" fill="#ff4d79" />
          <span>ValenTiny</span>
        </div>
        <Link href="/builder" className="nav-btn">Create Yours</Link>
      </nav>

      <header className="hero">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>The #1 Valentine Proposal Site</span>
        </div>
        <h1>Make Your Proposal <span className="gradient-text">Unforgettable</span></h1>
        <p>Create a personalized, interactive, and cute proposal page for your special someone. Get notified the second they say YES! ❤️</p>
        
        <div className="hero-cta">
          <Link href="/builder" className="primary-btn">Start Building — ₹199</Link>
          <p className="subtext">One-time payment • Lifetime access • Email alerts</p>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
            <Send className="f-icon" />
            <h3>Dynamic Content</h3>
            <p>Customize names, messages, images, and videos specifically for them.</p>
        </div>
        <div className="feature-card">
            <ShieldCheck className="f-icon" />
            <h3>Instant Alerts</h3>
            <p>Receive an email notification instantly when they click "Yes".</p>
        </div>
        <div className="feature-card">
            <Sparkles className="f-icon" />
            <h3>Premium Design</h3>
            <p>Includes confetti, animations, and high-quality visuals for a "WOW" effect.</p>
        </div>
      </section>

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          background: #fff;
          color: #333;
          font-family: 'Quicksand', sans-serif;
        }
        .navbar {
          padding: 20px 10%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: #ff4d79;
        }
        .hero {
          text-align: center;
          padding: 80px 10%;
          max-width: 900px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff0f3;
          color: #ff4d79;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 20px;
          font-weight: 800;
        }
        .gradient-text {
          background: linear-gradient(45deg, #ff4d79, #ff2a6d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .primary-btn {
          background: #ff4d79;
          color: white;
          padding: 18px 36px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.2rem;
          text-decoration: none;
          transition: transform 0.2s;
          display: inline-block;
          box-shadow: 0 10px 20px rgba(255, 77, 121, 0.2);
        }
        .primary-btn:hover {
          transform: translateY(-3px);
          background: #ff2a6d;
        }
        .subtext {
          font-size: 0.9rem;
          color: #999;
          margin-top: 15px;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          padding: 60px 10%;
          background: #fafafa;
        }
        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid #eee;
        }
        .f-icon {
          color: #ff4d79;
          margin-bottom: 15px;
        }
        h3 { margin-bottom: 10px; font-weight: 700; }
        
        @media (max-width: 768px) {
          h1 { font-size: 2.5rem; }
          .navbar { padding: 20px 5%; }
        }
      `}</style>
    </div>
  );
}
