'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { 
  Instagram, 
  Youtube, 
  Share2, 
  Zap, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Copy, 
  CheckCircle2,
  BarChart2,
  Link as LinkIcon,
  Video,
  Camera,
  Heart
} from 'lucide-react';

export default function InfluencerDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
    const link = `${window.location.origin}?ref=${affiliate.ref_code}&utm_source=influencer`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  if (!affiliate) return (
    <div className="no-access">
      <Heart size={64} color="#ff4d79" />
      <h2>Become a ValenTiny Creator</h2>
      <p>Your account is not yet registered as an approved influencer partner. Apply now to start earning 30% per sale.</p>
      <div className="action-buttons">
        <Link href="/affiliate/signup" className="btn-primary">Apply Now</Link>
        <Link href="/" className="btn-secondary">Back to Site</Link>
      </div>
      <style jsx>{`
        .no-access {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          color: white;
          text-align: center;
          padding: 20px;
          font-family: 'Outfit', sans-serif;
        }
        h2 { font-size: 2.5rem; font-weight: 800; margin-top: 24px; color: #ff4d79; }
        p { max-width: 500px; color: #94a3b8; margin: 16px 0 32px; font-size: 1.1rem; line-height: 1.6; }
        .action-buttons { display: flex; gap: 16px; }
        .btn-primary { 
          padding: 16px 32px; 
          background: #ff4d79; 
          color: white; 
          border-radius: 12px; 
          font-weight: 700; 
          text-decoration: none;
        }
        .btn-secondary { 
          padding: 16px 32px; 
          background: rgba(255,255,255,0.05); 
          color: white; 
          border-radius: 12px; 
          font-weight: 700; 
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );

  return (
    <div className="influencer-panel">
      <aside className="creators-sidebar">
        <div className="sidebar-brand">
          <div className="logo-sq"><Share2 size={20} /></div>
          <div className="brand-text">ValenTiny <span>Creator Studio</span></div>
        </div>

        <nav className="creators-nav">
          <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
            <Zap size={20} />
            <span>Overview</span>
          </button>
          <button className={activeTab === 'campaigns' ? 'active' : ''} onClick={() => setActiveTab('campaigns')}>
            <Video size={20} />
            <span>Content Kit</span>
          </button>
          <button className={activeTab === 'earnings' ? 'active' : ''} onClick={() => setActiveTab('earnings')}>
            <IndianRupee size={20} />
            <span>Earnings</span>
          </button>
          <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
            <BarChart2 size={20} />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="creator-profile">
            <img src={`https://ui-avatars.com/api/?name=${affiliate?.name}&background=ff4d79&color=fff`} className="avatar" alt="Avatar" />
            <div className="details">
              <span className="name">{affiliate?.name}</span>
              <span className="handle">Creator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="content-area">
        <header className="content-header">
          <div className="breadcrumb">Studio / {activeTab}</div>
          <div className="header-actions">
            <div className="status-pill">
              <div className="dot"></div>
              Live Creator Program
            </div>
          </div>
        </header>

        <section className="welcome-banner">
          <div className="banner-text">
            <h1>Welcome, {affiliate?.name?.split(' ')[0]}! 🚀</h1>
            <p>Your performance metrics are updated in real-time.</p>
          </div>
          <div className="referral-box">
            <label>Share & Earn ₹60/sale</label>
            <div className="input-group">
              <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${affiliate?.ref_code}`} />
              <button onClick={copyToClipboard} className={copied ? 'success' : ''}>
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </section>

        <div className="grid-3">
          <div className="card-glass">
            <div className="card-icon blue"><Users size={24} /></div>
            <div className="card-data">
              <label>Link Clicks</label>
              <h3>{stats?.totalClicks || 0}</h3>
            </div>
          </div>
          <div className="card-glass">
            <div className="card-icon green"><Zap size={24} /></div>
            <div className="card-data">
              <label>Conversions</label>
              <h3>{stats?.totalConversions || 0}</h3>
            </div>
          </div>
          <div className="card-glass">
            <div className="card-icon rose"><IndianRupee size={24} /></div>
            <div className="card-data">
              <label>Total Commissions</label>
              <h3>₹{stats?.totalEarnings || 0}</h3>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="performance-chart">
            <div className="section-title">
              <BarChart2 size={20} />
              <h3>Conversion Rank</h3>
            </div>
            <div className="chart-placeholder">
              <TrendingUp size={48} />
              <p>Top 5% of earners this week. Conversion: {stats?.conversionRate}%</p>
            </div>
          </div>

          <div className="content-kit">
            <div className="section-title">
              <Camera size={20} />
              <h3>Promo Resources</h3>
            </div>
            <div className="resource-list">
              <div className="resource-item">
                <span>Product Demo Reel (.mp4)</span>
                <button className="dl-btn">Download</button>
              </div>
              <div className="resource-item">
                <span>Story Hooks & Templates</span>
                <button className="dl-btn">View</button>
              </div>
              <div className="resource-item">
                <span>High-Res Logo Pack</span>
                <button className="dl-btn">Download</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .influencer-panel {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
          background: #020617;
          color: #f8fafc;
          font-family: 'Outfit', sans-serif;
        }

        .creators-sidebar {
          background: #0f172a;
          border-right: 1px solid rgba(255,255,255,0.05);
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
          padding-left: 12px;
        }

        .logo-sq {
          width: 36px;
          height: 36px;
          background: #ff4d79;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(255, 77, 121, 0.3);
        }

        .brand-text {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .brand-text span {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          margin-top: -2px;
        }

        .creators-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .creators-nav button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
          text-align: left;
          font-family: inherit;
          font-size: 0.95rem;
        }

        .creators-nav button:hover {
          background: rgba(255,255,255,0.03);
          color: #f8fafc;
        }

        .creators-nav button.active {
          background: rgba(255, 77, 121, 0.1);
          color: #ff4d79;
        }

        .sidebar-footer {
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .creator-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(255,77,121,0.3);
        }

        .details { display: flex; flex-direction: column; }
        .details .name { font-size: 0.85rem; font-weight: 700; color: #f8fafc; }
        .details .handle { font-size: 0.7rem; color: #64748b; font-weight: 600; }

        .logout-btn {
          width: 100%;
          padding: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #94a3b8;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fecaca;
        }

        .content-area { padding: 40px; overflow-y: auto; }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .breadcrumb {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          text-transform: capitalize;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .welcome-banner {
          background: linear-gradient(135deg, #ff4d79 0%, #ff2a6d 100%);
          padding: 40px;
          border-radius: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          box-shadow: 0 20px 40px rgba(255, 77, 121, 0.15);
        }
        
        .banner-text h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        .banner-text p { font-size: 1.1rem; opacity: 0.9; }
        
        .referral-box { background: rgba(0,0,0,0.2); padding: 24px; border-radius: 20px; width: 380px; }
        .referral-box label { font-size: 0.8rem; font-weight: 800; color: rgba(255,255,255,0.7); margin-bottom: 12px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
        .input-group { display: flex; gap: 8px; }
        .input-group input { 
          flex: 1; 
          background: rgba(0,0,0,0.3); 
          border: 1px solid rgba(255,255,255,0.1); 
          padding: 12px; 
          border-radius: 10px; 
          color: white; 
          font-size: 0.85rem;
          font-family: monospace;
          font-weight: 500;
        }
        .input-group button { 
          background: white; 
          color: #ff4d79; 
          border: none; 
          padding: 12px; 
          border-radius: 10px; 
          cursor: pointer;
          transition: all 0.2s;
        }
        .input-group button:hover { transform: scale(1.05); }
        .input-group button.success { background: #22c55e; color: white; }

        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .card-glass {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 30px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s;
        }
        .card-glass:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.1); background: #1e293b; }
        .card-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .card-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .card-icon.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .card-icon.rose { background: rgba(255, 77, 121, 0.1); color: #ff4d79; }
        .card-data label { font-size: 0.9rem; color: #94a3b8; font-weight: 600; }
        .card-data h3 { font-size: 1.8rem; font-weight: 800; margin-top: 4px; }

        .grid-2 { display: grid; grid-template-columns: 1fr 400px; gap: 24px; }
        .performance-chart, .content-kit { 
          background: #0f172a; 
          border: 1px solid rgba(255,255,255,0.05); 
          padding: 32px; 
          border-radius: 24px; 
        }
        .section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; }
        .section-title h3 { font-size: 1.1rem; font-weight: 700; color: #f8fafc; }
        
        .chart-placeholder { 
          height: 200px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          color: rgba(255,255,255,0.05); 
          gap: 16px; 
        }
        .chart-placeholder p { color: #64748b; font-size: 0.95rem; font-weight: 500; }

        .resource-list { display: flex; flex-direction: column; gap: 16px; }
        .resource-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .resource-item:hover { border-color: rgba(255,77,121,0.2); background: rgba(255,77,121,0.05); }
        .resource-item span { font-size: 0.9rem; font-weight: 600; }
        .dl-btn { 
          padding: 8px 16px; 
          background: rgba(255,255,255,0.05); 
          border: 1px solid rgba(255,255,255,0.1); 
          color: #f8fafc; 
          border-radius: 8px; 
          font-size: 0.8rem; 
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .dl-btn:hover { background: #ff4d79; border-color: #ff4d79; color: white; }

        .loader-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; }
        .loader { width: 40px; height: 40px; border: 3px solid rgba(255,77,121,0.1); border-top: 3px solid #ff4d79; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 1100px) {
          .influencer-panel { grid-template-columns: 1fr; }
          .creators-sidebar { display: none; }
          .grid-2 { grid-template-columns: 1fr; }
          .welcome-banner { flex-direction: column; gap: 32px; text-align: center; }
          .referral-box { width: 100%; }
        }
      `}</style>
    </div>
  );
}
