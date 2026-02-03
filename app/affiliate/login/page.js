'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Heart, Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AffiliateLogin() {
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
        router.push('/affiliate/dashboard');
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
          <span>Partner Login</span>
        </div>
        
        <h2>Welcome Back</h2>
        <p>Log in to your affiliate dashboard to track your earnings.</p>

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
            {loading ? <Loader2 className="spinner" size={20} /> : 'Sign In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="footer-links">
          <p>New to the program? <Link href="/affiliate/signup">Create Account</Link></p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: white;
          background-image: radial-gradient(#fff0f3 1px, transparent 1px);
          background-size: 20px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Outfit', 'Quicksand', sans-serif;
          color: #0f172a;
        }
        .login-card {
          background: white;
          padding: 48px;
          border-radius: 32px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 1.2rem;
          font-weight: 800;
          color: #ff4d79;
          margin-bottom: 30px;
        }
        h2 { font-size: 2rem; font-weight: 800; text-align: center; margin-bottom: 8px; color: #0f172a; }
        p { text-align: center; color: #64748b; margin-bottom: 40px; font-weight: 500; }
        
        form { display: flex; flex-direction: column; gap: 24px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.9rem; font-weight: 700; color: #334155; display: flex; align-items: center; gap: 8px; }
        input {
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-family: inherit;
          font-size: 1rem;
          background: #f8fafc;
          transition: all 0.2s;
        }
        input:focus { outline: none; border-color: #ff4d79; background: white; box-shadow: 0 0 0 4px #fff0f3; }
        
        button {
          padding: 18px;
          background: #ff4d79;
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          box-shadow: 0 10px 20px rgba(255, 77, 121, 0.2);
        }
        button:hover { background: #ff2a6d; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(255, 77, 121, 0.3); }
        button:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; transform: none; }
        
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .footer-links { margin-top: 32px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 24px; }
        .footer-links p { font-size: 0.95rem; }
        a { color: #ff4d79; font-weight: 700; text-decoration: none; margin-left: 4px; transition: color 0.2s; }
        a:hover { color: #ff2a6d; }
      `}</style>
    </div>
  );
}
