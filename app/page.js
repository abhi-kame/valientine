import Link from 'next/link';
import { Heart, Sparkles, Send, ShieldCheck } from 'lucide-react';
import HeroImage from '../components/HeroImage';
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
        <div className="hero-content">
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
        </div>
        <div className="hero-visual">
          <div className="blobs">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>
          <HeroImage />
        </div>
      </header>

      <section className="features" id="features">
        <div className="section-header">
           <h2>Why 5,000+ Couples Love Us</h2>
           <p>We've helped thousands of people get that special "YES!"</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
              <Send className="f-icon" aria-hidden="true" />
              <h3>Dynamic Personalization</h3>
              <p>Customize names, special messages, images, and videos tailored perfectly for your partner.</p>
          </div>
          <div className="feature-card">
              <ShieldCheck className="f-icon" aria-hidden="true" />
              <h3>Instant Confirmation</h3>
              <p>Receive an automated email notification the absolute moment they say "Yes" to your proposal.</p>
          </div>
          <div className="feature-card">
              <Sparkles className="f-icon" aria-hidden="true" />
              <h3>State-of-the-Art Design</h3>
              <p>Wow them with premium animations, confetti effects, and a responsive interface that works on every device.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Customize</h3>
            <p>Enter your partner's name, upload a cute photo, and set your special question.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Preview & Pay</h3>
            <p>See exactly how it looks on mobile. Pay a small one-time fee of ₹49.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Share & Get a YES!</h3>
            <p>Send the unique link. Get an email alert instantly when they accept!</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
         <h2>Love Notes</h2>
         <div className="testimonials-grid">
            <div className="testimonial-card">
               <p>"I was so nervous, but this page made it so cute and funny. She laughed and said YES immediately!"</p>
               <div className="author">- Aakash & Priya</div>
            </div>
            <div className="testimonial-card">
               <p>"The email notification feature is genius. I knew exactly when she opened it. Best ₹49 I ever spent."</p>
               <div className="author">- Rahul S.</div>
            </div>
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
