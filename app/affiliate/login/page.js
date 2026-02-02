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
          background: #fff0f3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Quicksand', sans-serif;
        }
        .login-card {
          background: white;
          padding: 40px;
          border-radius: 32px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
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
        h2 { font-size: 1.8rem; font-weight: 800; text-align: center; margin-bottom: 8px; }
        p { text-align: center; color: #64748b; margin-bottom: 40px; }
        
        form { display: flex; flex-direction: column; gap: 24px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.9rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
        input {
          padding: 14px;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
        }
        input:focus { outline: none; border-color: #ff4d79; }
        
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
        }
        button:hover { background: #ff2a6d; }
        
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .footer-links { margin-top: 32px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 24px; }
        .footer-links p { font-size: 0.95rem; }
        a { color: #ff4d79; font-weight: 700; text-decoration: none; margin-left: 4px; }
      `}</style>
    </div>
  );
}
