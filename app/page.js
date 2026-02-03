import Link from 'next/link';
import { Heart, Sparkles, Send, ShieldCheck } from 'lucide-react';
import './landing.css';

export const metadata = {
  title: 'ValenTiny | Create Your Personalized Valentine Proposal ❤️',
  description: 'The #1 platform for personalized, interactive Valentine proposals. Get notified instantly when they say YES! Start creating for only ₹49.',
  keywords: ['valentine proposal', 'personalized proposal', 'interactive valentine card', 'online proposal builder'],
};

export default function LandingPage() {
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
          <Link href="/builder" className="primary-btn">Start Building Now — ₹49</Link>
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

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ValenTiny. All rights reserved.</p>
        <div className="legal-links">
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/affiliate">Partners</Link>
        </div>
      </footer>
    </main>
  );
}
