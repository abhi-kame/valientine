'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Users, 
  MousePointer2, 
  IndianRupee, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  QrCode,
  LayoutDashboard,
  Wallet,
  Settings as SettingsIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function AffiliateDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

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
      setUser(user);

      const res = await fetch(`/api/affiliate/stats?userId=${user.id}`);
      const data = await res.json();
      
      if (data.affiliate) {
        setAffiliate(data.affiliate);
        setStats(data.stats);
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  const copyToClipboard = () => {
    const link = `${window.location.origin}?ref=${affiliate.ref_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  if (!affiliate) return (
    <div className="no-affiliate">
      <h2>Become an Affiliate</h2>
      <p>Start earning ₹60 per successful referral!</p>
      <a href="/affiliate/signup" className="btn-primary">Sign Up Now</a>
    </div>
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon">❤️</div>
          <div className="logo-text">ValenTiny <span>Partners</span></div>
        </div>

        <nav className="sidebar-nav">
          <Link href="/affiliate/dashboard" className="nav-item active">
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
          <Link href="/affiliate/settings" className="nav-item">
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
          <button className="logout-btn" onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header>
          <h1>Welcome back, {affiliate.name}!</h1>
          <div className="status-badge active">Status: {affiliate.status}</div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon clicks"><MousePointer2 size={24} /></div>
            <div className="stat-info">
              <label>Total Clicks</label>
              <div className="value">{stats.totalClicks}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon sales"><Users size={24} /></div>
            <div className="stat-info">
              <label>Total Sales</label>
              <div className="value">{stats.totalConversions}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon earnings"><IndianRupee size={24} /></div>
            <div className="stat-info">
              <label>Total Earnings</label>
              <div className="value">₹{stats.totalEarnings}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rate"><TrendingUp size={24} /></div>
            <div className="stat-info">
              <label>Conv. Rate</label>
              <div className="value">{stats.conversionRate}%</div>
            </div>
          </div>
        </section>

        <section className="link-section">
          <div className="section-header">
            <h2>Your Affiliate Link</h2>
            <p>Share this link to start earning.</p>
          </div>
          <div className="link-box">
            <input 
              readOnly 
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${affiliate.ref_code}`} 
            />
            <button onClick={copyToClipboard} className={copied ? 'copied' : ''}>
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </section>

        <section className="payout-section">
          <div className="payout-summary">
            <h3>Pending Payout</h3>
            <div className="payout-amount">₹{stats.pendingPayout}</div>
            <p>Threshold for payout: ₹500</p>
            <button className="withdraw-btn" disabled={stats.pendingPayout < 500}>
              Request Payout
            </button>
          </div>
          
          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <Clock size={16} />
                <span>New referral visit from Instagram</span>
                <span className="time">2 mins ago</span>
              </div>
              <div className="activity-item">
                <CheckCircle2 size={16} className="text-success" />
                <span>Conversion successful! You earned ₹60</span>
                <span className="time">1 hour ago</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Quicksand:wght@500;700&display=swap');

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

        .logout-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #64748b;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #dc2626;
        }
        .main-content { padding: 40px; }
        header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          margin-bottom: 40px;
        }
        h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; }
        .status-badge {
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .status-badge.active { background: #dcfce7; color: #166534; }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.clicks { background: #eff6ff; color: #3b82f6; }
        .stat-icon.sales { background: #f0fdf4; color: #22c55e; }
        .stat-icon.earnings { background: #fef2f2; color: #ef4444; }
        .stat-icon.rate { background: #faf5ff; color: #a855f7; }
        .stat-info label { color: #64748b; font-size: 0.9rem; font-weight: 600; }
        .stat-info .value { font-size: 1.5rem; font-weight: 800; color: #1e293b; }

        .link-section {
          background: white;
          padding: 30px;
          border-radius: 24px;
          margin-bottom: 40px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .link-box {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .link-box input {
          flex: 1;
          padding: 14px;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          font-family: monospace;
          background: #f8fafc;
        }
        .link-box button {
          padding: 0 24px;
          background: #ff4d79;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .link-box button.copied { background: #22c55e; }

        .payout-section {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 30px;
        }
        .payout-summary {
          background: #1e293b;
          color: white;
          padding: 30px;
          border-radius: 24px;
          text-align: center;
        }
        .payout-amount { font-size: 3rem; font-weight: 800; margin: 20px 0; }
        .withdraw-btn {
          width: 100%;
          padding: 14px;
          background: #ff4d79;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          margin-top: 20px;
          cursor: pointer;
        }
        .withdraw-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #475569; }

        .recent-activity {
          background: white;
          padding: 30px;
          border-radius: 24px;
        }
        .activity-list { margin-top: 20px; display: flex; flex-direction: column; gap: 16px; }
        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #64748b;
          font-size: 0.95rem;
        }
        .activity-item .time { margin-left: auto; font-size: 0.8rem; color: #94a3b8; }
        .text-success { color: #22c55e; }

        @media (max-width: 1024px) {
          .dashboard-container { grid-template-columns: 1fr; }
          .sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
