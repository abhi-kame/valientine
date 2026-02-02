'use client';

import Link from 'next/link';
import { Heart, Sparkles, Send, ShieldCheck } from 'lucide-react';

export default function LandingContent() {
  return (
    <main className="landing-container">
      <nav className="navbar" role="navigation" aria-label="Main Navigation">
        <div className="logo">
          <Heart className="heart-icon" fill="#ff4d79" />
          <span>ValenTiny</span>
        </div>
        <Link href="/builder" className="nav-btn">Create Yours</Link>
      </nav>

      <header className="hero">
        <div className="hero-badge">
          <Sparkles size={16} />
          <span>The World's #1 Valentine Proposal Site</span>
        </div>
        <h1>Make Your Valentine Proposal <span className="gradient-text">Unforgettable</span></h1>
        <p>Surprise your special someone with a personalized, interactive, and cute proposal page. Experience the magic of a "WOW" moment and get notified the second they click YES! ❤️</p>
        
        <div className="hero-cta">
          <Link href="/builder" className="primary-btn">Start Building Now — ₹199</Link>
          <p className="subtext">One-time payment • Lifetime access • Direct email alerts</p>
        </div>
      </header>

      <section className="features" id="features">
        <div className="feature-card">
            <Send className="f-icon" aria-hidden="true" />
            <h2>Dynamic Personalization</h2>
            <p>Customize names, special messages, images, and videos tailored perfectly for your partner.</p>
        </div>
        <div className="feature-card">
            <ShieldCheck className="f-icon" aria-hidden="true" />
            <h2>Instant Confirmation</h2>
            <p>Receive an automated email notification the absolute moment they say "Yes" to your proposal.</p>
        </div>
        <div className="feature-card">
            <Sparkles className="f-icon" aria-hidden="true" />
            <h2>State-of-the-Art Design</h2>
            <p>Wow them with premium animations, confetti effects, and a responsive interface that works on every device.</p>
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
          padding: 24px 10%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.6rem;
          font-weight: 800;
          color: #ff4d79;
        }
        .hero {
          text-align: center;
          padding: 100px 10%;
          max-width: 1000px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff0f3;
          color: #ff4d79;
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 700;
          margin-bottom: 24px;
          font-size: 0.9rem;
        }
        h1 {
          font-size: 4.5rem;
          line-height: 1.05;
          margin-bottom: 24px;
          font-weight: 900;
          letter-spacing: -1px;
        }
        .gradient-text {
          background: linear-gradient(135deg, #ff4d79, #ff2a6d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.3rem;
          color: #4b5563;
          margin-bottom: 48px;
          line-height: 1.6;
        }
        .primary-btn {
          background: #ff4d79;
          color: white;
          padding: 20px 42px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1.25rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-block;
          box-shadow: 0 12px 24px rgba(255, 77, 121, 0.25);
        }
        .primary-btn:hover {
          transform: translateY(-4px);
          background: #ff2a6d;
          box-shadow: 0 15px 30px rgba(255, 77, 121, 0.35);
        }
        .subtext {
          font-size: 0.95rem;
          color: #94a3b8;
          margin-top: 18px;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          padding: 100px 10%;
          background: #fafafa;
        }
        .feature-card {
          background: white;
          padding: 40px;
          border-radius: 28px;
          border: 1px solid #f1f5f9;
          transition: transform 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-8px);
        }
        .f-icon {
          color: #ff4d79;
          margin-bottom: 20px;
          width: 32px;
          height: 32px;
        }
        h2 { font-size: 1.5rem; margin-bottom: 12px; font-weight: 800; color: #1e293b; }
        .feature-card p { font-size: 1.05rem; margin-bottom: 0; }
        
        @media (max-width: 768px) {
          h1 { font-size: 2.8rem; }
          .hero { padding: 60px 5%; }
          .navbar { padding: 20px 5%; }
        }
      `}</style>
    </main>
  );
}
