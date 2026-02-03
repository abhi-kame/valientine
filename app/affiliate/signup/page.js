'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2, CheckCircle2 } from 'lucide-react';

export default function AffiliateSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    upiId: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/affiliate/dashboard'), 2000);
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="status-container">
        <CheckCircle2 size={64} color="#22c55e" />
        <h1>Registration Successful!</h1>
        <p>Your affiliate account has been created. Redirecting to dashboard...</p>
        <style jsx>{`
          .status-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 20px;
            font-family: 'Quicksand', sans-serif;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="form-card">
        <div className="logo">
          <Heart fill="#ff4d79" color="#ff4d79" />
          <span>Partner Program</span>
        </div>
        
        <h2>Join as a Partner</h2>
        <p>Start promoting and earning today.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              required
              type="text"
              placeholder="Sakshi Sharma"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              required
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>UPI ID (to receive payments)</label>
            <input 
              required
              type="text"
              placeholder="name@upi"
              value={formData.upiId}
              onChange={(e) => setFormData({...formData, upiId: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : 'Create Account'}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <a href="/affiliate/login">Log In</a>
        </p>
      </div>

      <style jsx>{`
        .signup-page {
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
        .form-card {
          background: white;
          padding: 48px;
          border-radius: 32px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1.2rem;
          font-weight: 800;
          color: #ff4d79;
          margin-bottom: 30px;
        }
        h2 { font-size: 2rem; font-weight: 800; text-align: center; margin-bottom: 8px; color: #0f172a; }
        p { text-align: center; color: #64748b; margin-bottom: 30px; font-weight: 500; }
        
        form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.9rem; font-weight: 700; color: #334155; }
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
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 10px 20px rgba(255, 77, 121, 0.2);
        }
        button:hover { background: #ff2a6d; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(255, 77, 121, 0.3); }
        button:disabled { background: #cbd5e1; cursor: not-allowed; box-shadow: none; transform: none; }
        
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .footer-text { margin-top: 24px; font-size: 0.95rem; border-top: 1px solid #f1f5f9; padding-top: 24px; }
        a { color: #ff4d79; font-weight: 700; text-decoration: none; margin-left: 4px; transition: color 0.2s; }
        a:hover { color: #ff2a6d; }
      `}</style>
    </div>
  );
}
