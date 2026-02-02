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
        <p>Promote the world's most creative Valentine's proposal platform and earn ₹60 for every sale you generate.</p>
        
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
          <h3>High Commision</h3>
          <p>Earn ₹60 on every ₹199 sale. That's a 30% commission rate!</p>
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
          <div className="step">
            <div className="number">1</div>
            <h4>Sign Up</h4>
            <p>Complete our quick application and get approved instantly.</p>
          </div>
          <div className="step">
            <div className="number">2</div>
            <h4>Share Your Link</h4>
            <p>Post your unique link on TikTok, IG, or send it to friends.</p>
          </div>
          <div className="step">
            <div className="number">3</div>
            <h4>Get Paid</h4>
            <p>Receive payouts directly to your UPI ID once you hit ₹500.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .affiliate-page {
          min-height: 100vh;
          background: #fff;
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
          font-size: 1.4rem;
          font-weight: 800;
          color: #ff4d79;
        }
        .hero {
          text-align: center;
          padding: 80px 10%;
          max-width: 900px;
          margin: 0 auto;
        }
        .badge {
          display: inline-block;
          padding: 8px 20px;
          background: #fff0f3;
          color: #ff4d79;
          border-radius: 50px;
          font-weight: 700;
          margin-bottom: 24px;
        }
        h1 { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
        .gradient-text {
          background: linear-gradient(45deg, #ff4d79, #ff2a6d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p { font-size: 1.25rem; color: #64748b; line-height: 1.6; margin-bottom: 40px; }
        
        .primary-btn {
          background: #ff4d79;
          color: white;
          padding: 18px 40px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.2rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          box-shadow: 0 10px 25px rgba(255, 77, 121, 0.3);
        }
        .primary-btn:hover { transform: translateY(-3px); background: #ff2a6d; }
        
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          padding: 100px 10%;
          background: #fafafa;
        }
        .feature-card {
          background: white;
          padding: 40px;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
        }
        .icon { color: #ff4d79; width: 32px; height: 32px; margin-bottom: 20px; }
        h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 12px; }
        
        .how-it-works { padding: 100px 10%; text-align: center; }
        .how-it-works h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 60px; }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }
        .number {
          width: 50px;
          height: 50px;
          background: #ff4d79;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0 auto 24px;
        }
        h4 { font-size: 1.2rem; font-weight: 800; margin-bottom: 12px; }

        @media (max-width: 768px) {
          h1 { font-size: 2.5rem; }
          .navbar { padding: 20px 5%; }
        }
      `}</style>
    </div>
  );
}
