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
          background: #fff0f3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Quicksand', sans-serif;
        }
        .form-card {
          background: white;
          padding: 40px;
          border-radius: 32px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
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
        h2 { font-size: 1.8rem; font-weight: 800; text-align: center; margin-bottom: 8px; }
        p { text-align: center; color: #64748b; margin-bottom: 30px; }
        
        form { display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
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
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .footer-text { margin-top: 24px; font-size: 0.9rem; }
        a { color: #ff4d79; font-weight: 700; text-decoration: none; }
      `}</style>
    </div>
  );
}
