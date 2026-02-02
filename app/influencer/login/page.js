'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Heart, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InfluencerLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let identifier = formData.email;
      
      // If it looks like a UPI ID (contains @ and no .com/etc) or just a partner ID
      if (identifier.includes('@') && !identifier.endsWith('.com') && !identifier.endsWith('.net')) {
        identifier = `${identifier.replace(/[^a-zA-Z0-9]/g, '_')}@valentiny.partners`;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
      } else {
        router.push('/influencer/studio');
      }
    } catch (err) {
      alert('An expected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          <Heart fill="#ff4d79" color="#ff4d79" />
          <span>Creator Studio</span>
        </div>
        
        <h2>Welcome Back</h2>
        <p>Log in to access your influencer dashboard</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label><Mail size={16} /> UPI ID or Email</label>
            <input 
              required
              type="text"
              placeholder="name@upi"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Password</label>
            <input 
              required
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Enter Studio'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="footer-links">
          <p>Don't have a creator account? <Link href="/affiliate/signup">Apply Now</Link></p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Outfit', sans-serif;
        }
        .login-card {
          background: #1e293b;
          padding: 48px;
          border-radius: 32px;
          width: 100%;
          max-width: 440px;
          color: white;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 1.4rem;
          font-weight: 800;
          color: #ff4d79;
          margin-bottom: 32px;
        }
        h2 { font-size: 2rem; font-weight: 800; text-align: center; margin-bottom: 8px; }
        p { text-align: center; color: #94a3b8; margin-bottom: 40px; }
        
        form { display: flex; flex-direction: column; gap: 24px; }
        .input-group { display: flex; flex-direction: column; gap: 10px; }
        label { font-size: 0.9rem; font-weight: 600; color: #cbd5e1; display: flex; align-items: center; gap: 8px; }
        input {
          padding: 14px 16px;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          transition: all 0.2s;
        }
        input:focus { outline: none; border-color: #ff4d79; box-shadow: 0 0 0 4px rgba(255, 77, 121, 0.1); }
        
        button {
          padding: 16px;
          background: #ff4d79;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }
        button:hover { background: #ff2a6d; transform: translateY(-2px); }
        button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .footer-links { margin-top: 32px; text-align: center; border-top: 1px solid #334155; padding-top: 24px; }
        .footer-links p { font-size: 0.95rem; margin-bottom: 0; }
        a { color: #ff4d79; font-weight: 700; text-decoration: none; margin-left: 4px; }
        a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
