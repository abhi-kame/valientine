'use client';

import Link from 'next/link';
import { Heart, DollarSign, BarChart3, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AffiliateLanding() {
  return (
    <div className="affiliate-page">
      <nav className="navbar">
        <div className="logo">
          <Heart fill="#ff4d79" color="#ff4d79" />
          <span>ValenTiny Partners</span>
        </div>
        <Link href="/affiliate/login" className="login-btn">Log In</Link>
      </nav>

      <header className="hero">
        <div className="badge">💸 High Commission Program</div>
        <h1>Turn Love into <span className="gradient-text">Revenue</span></h1>
        <p>Promote the world's most creative Valentine's proposal platform and earn 30% commission for every sale you generate.</p>
        
        <div className="cta-group">
          <Link href="/affiliate/signup" className="primary-btn">
            Join the Program <ArrowRight size={20} />
          </Link>
          <p className="subtext">Free to join • Instant tracking • Monthly payouts</p>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <DollarSign className="icon" />
          <h3>High Commission</h3>
          <p>Earn ₹14.7 on every ₹49 sale. That's a flat 30% commission rate!</p>
        </div>
        <div className="feature-card">
          <Zap className="icon" />
          <h3>Instant Tracking</h3>
          <p>30-day cookie window ensures you get credit for every click you drive.</p>
        </div>
        <div className="feature-card">
          <BarChart3 className="icon" />
          <h3>Partner Dashboard</h3>
          <p>Real-time analytics to track clicks, sales, and your earnings.</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Sign Up</h4>
            <p>Complete our quick application and get approved instantly.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Share Your Link</h4>
            <p>Post your unique link on TikTok, IG, or send it to friends.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Get Paid</h4>
            <p>Receive payouts directly to your UPI ID once you hit ₹500.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .affiliate-page {
          min-height: 100vh;
          background: #fff;
          font-family: 'Outfit', 'Quicksand', sans-serif;
          color: #0f172a;
        }
        .navbar {
          padding: 24px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          z-index: 100;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.4rem;
          font-weight: 800;
          color: #ff4d79;
        }
        .login-btn {
          padding: 10px 24px;
          border: 2px solid #e2e8f0;
          border-radius: 50px;
          text-decoration: none;
          color: #64748b;
          font-weight: 700;
          transition: all 0.2s;
        }
        .login-btn:hover { border-color: #ff4d79; color: #ff4d79; }

        .hero {
          text-align: center;
          padding: 100px 5%;
          max-width: 1000px;
          margin: 0 auto;
        }
        .badge {
          display: inline-block;
          padding: 8px 16px;
          background: #fff0f3;
          color: #ff4d79;
          border-radius: 50px;
          font-weight: 700;
          margin-bottom: 32px;
          border: 1px solid #ffe4e8;
          font-size: 0.9rem;
        }
        h1 { font-size: 4.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: #0f172a; letter-spacing: -1.5px; }
        .gradient-text {
          background: linear-gradient(135deg, #ff4d79, #ff8fa3);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p { font-size: 1.25rem; color: #64748b; line-height: 1.6; margin-bottom: 40px; }
        
        .primary-btn {
          background: #ff4d79;
          color: white;
          padding: 18px 48px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.2rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          box-shadow: 0 20px 40px rgba(255, 77, 121, 0.2);
        }
        .primary-btn:hover { transform: translateY(-4px); background: #ff2a6d; box-shadow: 0 25px 50px rgba(255, 77, 121, 0.3); }
        .subtext { font-size: 0.9rem; margin-top: 16px; font-weight: 500; color: #94a3b8; }
        
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          padding: 100px 5%;
          background: white;
          max-width: 1200px;
          margin: 0 auto;
        }
        .feature-card {
          background: #f8fafc;
          padding: 40px;
          border-radius: 32px;
          border: 1px solid white;
          transition: all 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          background: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          border-color: #f1f5f9;
        }
        .icon { 
          color: #ff4d79; 
          width: 48px; 
          height: 48px; 
          margin-bottom: 24px; 
          background: #fff1f2;
          padding: 10px;
          border-radius: 16px;
        }
        h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 12px; }
        .feature-card p { font-size: 1rem; margin-bottom: 0; }
        
        .how-it-works { padding: 100px 5%; text-align: center; background: #0f172a; color: white; }
        .how-it-works p { color: #94a3b8; }
        .how-it-works h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 60px; color: white; }
        .steps-grid {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .step-card {
          flex: 1;
          min-width: 250px;
          max-width: 350px;
          background: rgba(255,255,255,0.05);
          padding: 40px;
          border-radius: 24px;
          text-align: left;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .step-number {
          font-size: 3rem;
          font-weight: 900;
          color: #ff4d79;
          opacity: 0.5;
          margin-bottom: 10px;
        }
        h4 { font-size: 1.5rem; font-weight: 700; margin-bottom: 12px; }

        @media (max-width: 768px) {
          h1 { font-size: 3rem; }
          .navbar { padding: 20px 5%; }
          .primary-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
