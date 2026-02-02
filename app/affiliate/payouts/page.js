'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  IndianRupee, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  LayoutDashboard,
  Settings as SettingsIcon,
  AlertCircle,
  TrendingUp,
  History
} from 'lucide-react';
import Link from 'next/link';

export default function PayoutsPage() {
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState([]);
  const [affiliate, setAffiliate] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    totalPaid: 0
  });

  const fetchRef = useRef(false);

  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: affData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (affData) {
        setAffiliate(affData);
        const { data: commsData } = await supabase
          .from('commissions')
          .select('*')
          .eq('affiliate_id', affData.id)
          .order('created_at', { ascending: false });

        if (commsData) {
          setCommissions(commsData);
          const pending = commsData
            .filter(c => c.status === 'unpaid')
            .reduce((sum, c) => sum + Number(c.amount), 0);
          const paid = commsData
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + Number(c.amount), 0);
          setStats({ pending, totalPaid: paid });
        }
      }
      setLoading(false);
    }
    getData();
  }, []);

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
          <Link href="/affiliate/payouts" className="nav-item active">
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
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div className="title-area">
            <h1>Payouts</h1>
            <p>Your earnings are automatically processed once you hit ₹500.</p>
          </div>
        </header>

        <section className="payout-hero">
          <div className="payout-balance">
            <label>Current Balance</label>
            <div className="amount-row">
              <h2>₹{stats.pending}</h2>
              <div className="progress-pill">
                {stats.pending >= 500 ? 'Ready for Payout' : `${((stats.pending/500)*100).toFixed(0)}% to Threshold`}
              </div>
            </div>
            <div className="threshold-bar">
              <div className="fill" style={{ width: `${Math.min((stats.pending / 500) * 100, 100)}%` }}></div>
            </div>
            <p className="threshold-text">Next payout at <span>₹500.00</span></p>
          </div>

          <div className="payout-stats">
            <div className="mini-card">
              <CheckCircle2 size={18} color="#22c55e" />
              <div>
                <label>Total Paid Out</label>
                <strong>₹{stats.totalPaid}</strong>
              </div>
            </div>
            <div className="mini-card">
              <Clock size={18} color="#f59e0b" />
              <div>
                <label>Payout Status</label>
                <strong>{stats.pending >= 500 ? 'Eligible' : 'Pending'}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="section-header">
            <History size={20} />
            <h3>Payout History</h3>
          </div>
          
          <div className="empty-payouts">
            <AlertCircle size={40} />
            <h4>No payouts processed yet</h4>
            <p>Once your balance hits ₹500, we will transfer it to your registered UPI ID.</p>
          </div>
        </section>
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

        .main-content { padding: 40px; max-width: 1100px; }
        h1 { font-size: 2.2rem; font-weight: 800; color: #010409; margin-bottom: 8px; }
        .page-header p { color: #64748b; font-size: 1.1rem; }
        
        .payout-hero { display: grid; grid-template-columns: 1fr 340px; gap: 24px; margin: 40px 0; }
        .payout-balance { background: #0f172a; color: white; padding: 40px; border-radius: 28px; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1); }
        .amount-row { display: flex; justify-content: space-between; align-items: center; margin: 24px 0; }
        .amount-row h2 { font-size: 3.5rem; font-weight: 800; color: white; }
        .progress-pill { background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; font-weight: 700; color: #94a3b8; border: 1px solid rgba(255,255,255,0.05); }
        .threshold-bar { height: 10px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-bottom: 16px; overflow: hidden; }
        .threshold-bar .fill { height: 100%; background: linear-gradient(90deg, #ff4d79, #ff7b9f); border-radius: 10px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .threshold-text { color: #94a3b8; font-size: 0.95rem; font-weight: 500; }
        .threshold-text span { color: white; font-weight: 800; }
        
        .payout-stats { display: flex; flex-direction: column; gap: 16px; }
        .mini-card { background: white; padding: 24px; border-radius: 24px; display: flex; align-items: center; gap: 20px; border: 1px solid #f1f5f9; transition: all 0.2s; }
        .mini-card:hover { border-color: #ff4d79; transform: translateY(-2px); }
        .mini-card label { display: block; font-size: 0.9rem; color: #64748b; font-weight: 600; margin-bottom: 4px; }
        .mini-card strong { font-size: 1.4rem; font-weight: 800; color: #010409; }
        
        .history-section { background: white; border-radius: 28px; padding: 40px; border: 1px solid #f1f5f9; }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
        .section-header h3 { font-size: 1.25rem; font-weight: 800; }
        .empty-payouts { text-align: center; padding: 80px 0; color: #94a3b8; }
        .empty-payouts h4 { color: #010409; font-size: 1.2rem; font-weight: 700; margin-top: 20px; margin-bottom: 8px; }
        .empty-payouts p { font-size: 1rem; max-width: 400px; margin: 0 auto; line-height: 1.6; }

        .loader-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
        .loader { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top: 4px solid #ff4d79; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .dashboard-container { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .payout-hero { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
