'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Settings as SettingsIcon,
  User,
  CreditCard,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  LayoutDashboard,
  IndianRupee,
  Wallet,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    upi_id: '',
    ref_code: ''
  });

  const fetchRef = useRef(false);

  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setAffiliate(data);
        setFormData({
          name: data.name,
          upi_id: data.upi_id,
          ref_code: data.ref_code
        });
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('affiliates')
        .update({
          name: formData.name,
          upi_id: formData.upi_id
        })
        .eq('id', affiliate.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon">❤️</div>
          <div className="logo-text">ValenTiny <span>Partners</span></div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/affiliate/dashboard" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/affiliate/commissions" className="nav-item">
            <IndianRupee size={20} />
            <span>Commissions</span>
          </Link>
          <Link href="/affiliate/payouts" className="nav-item">
            <Wallet size={20} />
            <span>Payouts</span>
          </Link>
          <Link href="/affiliate/settings" className="nav-item active">
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">
              {affiliate?.name?.charAt(0) || 'P'}
            </div>
            <div className="user-info">
              <span className="user-name">{affiliate?.name || 'Partner'}</span>
              <span className="user-status">Verified</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <h1>Account Settings</h1>
          <p>Manage your partner profile and payment details.</p>
        </header>

        <div className="settings-grid">
          <form className="settings-form" onSubmit={handleUpdate}>
            <div className="form-section">
              <div className="section-title">
                <User size={18} />
                <h3>Profile Information</h3>
              </div>
              <div className="input-group">
                <label>Partner Name</label>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your Name"
                />
              </div>
              <div className="input-group">
                <label>Referral Code (Fixed)</label>
                <div className="readonly-box">
                  <code>{formData.ref_code}</code>
                  <Lock size={14} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <CreditCard size={18} />
                <h3>Payout Details</h3>
              </div>
              <div className="input-group">
                <label>UPI ID (for payments)</label>
                <input 
                  value={formData.upi_id}
                  onChange={(e) => setFormData({...formData, upi_id: e.target.value})}
                  placeholder="name@upi"
                />
              </div>
              <div className="info-box">
                <AlertTriangle size={16} />
                <p>Ensure your UPI ID is correct. Our automated system will use this ID for all future payouts.</p>
              </div>
            </div>

            {message && (
              <div className={`alert-msg ${message.type}`}>
                {message.type === 'success' && <CheckCircle2 size={16} />}
                {message.text}
              </div>
            )}

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
              {saving ? 'Saving changes...' : 'Save Settings'}
            </button>
          </form>

          <aside className="settings-help">
            <div className="help-card">
              <h4>Need Support?</h4>
              <p>Having trouble with your account or referral code? Our partner support team is here to help.</p>
              <button className="contact-btn">Email Support</button>
            </div>
          </aside>
        </div>
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

        .dashboard-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Outfit', sans-serif;
        }

        .sidebar {
          background: #ffffff;
          border-right: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          padding: 32px 20px;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 48px;
          padding: 0 12px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: #fff1f2;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 1.2rem;
          color: #ff4d79;
        }

        .logo-text {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .logo-text span {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          margin-top: -2px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        :global(.nav-item) {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #64748b !important;
          text-decoration: none !important;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        :global(.nav-item:hover) {
          background: #f8fafc;
          color: #1e293b !important;
        }

        :global(.nav-item.active) {
          background: #fff1f2 !important;
          color: #ff4d79 !important;
        }

        .sidebar-footer {
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: #ff4d79;
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }

        .user-status {
          font-size: 0.7rem;
          color: #22c55e;
          font-weight: 600;
        }

        .main-content { padding: 40px; }
        h1 { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .page-header p { color: #64748b; font-size: 1.1rem; }
        
        .settings-grid { display: grid; grid-template-columns: 1fr 340px; gap: 40px; margin-top: 40px; }
        .settings-form { background: white; padding: 40px; border-radius: 28px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 32px; }
        .section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; color: #010409; }
        .section-title h3 { font-size: 1.25rem; font-weight: 800; }
        
        .input-group { display: flex; flex-direction: column; gap: 10px; }
        .input-group label { font-size: 0.95rem; font-weight: 700; color: #64748b; }
        .input-group input { padding: 14px 18px; border: 2px solid #f1f5f9; border-radius: 14px; font-family: inherit; font-size: 1rem; transition: all 0.2s; }
        .input-group input:focus { outline: none; border-color: #ff4d79; background: #fff1f2; }
        
        .readonly-box { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 14px 18px; border-radius: 14px; border: 2px solid #f1f5f9; color: #94a3b8; }
        .readonly-box code { font-family: monospace; font-weight: 800; color: #64748b; font-size: 1.1rem; }
        
        .info-box { display: flex; gap: 12px; background: #fffbeb; padding: 20px; border-radius: 16px; color: #92400e; border: 1px solid #fef3c7; }
        .info-box p { font-size: 0.85rem; line-height: 1.5; font-weight: 600; }
        
        .save-btn { background: #0f172a; color: white; border: none; padding: 16px; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; transition: all 0.2s; }
        .save-btn:hover { background: #010409; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .alert-msg { padding: 16px; border-radius: 14px; font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 12px; }
        .alert-msg.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .alert-msg.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        
        .help-card { background: #0f172a; color: white; padding: 32px; border-radius: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .help-card h4 { font-size: 1.25rem; margin-bottom: 16px; font-weight: 800; }
        .help-card p { font-size: 0.95rem; opacity: 0.8; line-height: 1.6; margin-bottom: 24px; }
        .contact-btn { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .contact-btn:hover { background: #ff4d79; border-color: #ff4d79; }

        .loader-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
        .loader { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top: 4px solid #ff4d79; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 1100px) {
          .dashboard-container { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
