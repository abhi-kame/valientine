'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  IndianRupee, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  LayoutDashboard,
  Wallet,
  Settings as SettingsIcon,
  ChevronRight,
  TrendingDown,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function CommissionsPage() {
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState([]);
  const [affiliate, setAffiliate] = useState(null);
  const [stats, setStats] = useState({
    paid: 0,
    unpaid: 0
  });

  const fetchRef = useRef(false);

  useEffect(() => {
    if (fetchRef.current) return;
    fetchRef.current = true;

    async function getCommissions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Get Affiliate Profile
      const { data: affData } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (affData) {
        setAffiliate(affData);
        
        // 2. Get Commissions
        const { data: commsData } = await supabase
          .from('commissions')
          .select('*')
          .eq('affiliate_id', affData.id)
          .order('created_at', { ascending: false });

        if (commsData) {
          setCommissions(commsData);
          
          // Calculate stats
          const paid = commsData
            .filter(c => c.status === 'paid')
            .reduce((sum, c) => sum + Number(c.amount), 0);
          const unpaid = commsData
            .filter(c => c.status === 'unpaid')
            .reduce((sum, c) => sum + Number(c.amount), 0);
          
          setStats({ paid, unpaid });
        }
      }
      setLoading(false);
    }
    getCommissions();
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
          <Link href="/affiliate/commissions" className="nav-item active">
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
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div className="title-area">
            <Link href="/affiliate/dashboard" className="back-link">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1>My Commissions</h1>
          </div>
          <div className="header-meta">
            <div className="commission-pill">30% Per Sale</div>
          </div>
        </header>

        <section className="summary-grid">
          <div className="summary-card unpaid">
            <div className="icon"><Clock size={20} /></div>
            <div className="data">
              <label>Pending Balance</label>
              <h2>₹{stats.unpaid}</h2>
            </div>
          </div>
          <div className="summary-card paid">
            <div className="icon"><CheckCircle2 size={20} /></div>
            <div className="data">
              <label>Lifetime Paid</label>
              <h2>₹{stats.paid}</h2>
            </div>
          </div>
        </section>

        <section className="comms-table-section">
          <div className="section-header">
            <h3>Recent Earnings</h3>
            <p>Every time someone clicks your link and buys a proposal, it shows up here.</p>
          </div>

          <div className="table-wrapper">
            {commissions.length === 0 ? (
              <div className="empty-state">
                <IndianRupee size={48} />
                <p>No commissions earned yet. Start sharing your link!</p>
                <Link href="/affiliate/dashboard" className="btn-primary">Get My Link</Link>
              </div>
            ) : (
              <table className="comms-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((comm) => (
                    <tr key={comm.id}>
                      <td>
                        <div className="date-cell">
                          <Calendar size={14} />
                          {new Date(comm.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td>
                        <code className="order-id">{comm.order_id}</code>
                      </td>
                      <td className="amount-cell">₹{comm.amount}</td>
                      <td>
                        <span className={`status-tag ${comm.status}`}>
                          {comm.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {comm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

        .main-content { padding: 40px; }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
        }
        h1 { font-size: 2.2rem; font-weight: 800; color: #0f172a; }
        .commission-pill {
          background: #dcfce7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }
        .summary-card {
          padding: 32px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          color: white;
        }
        .summary-card.unpaid { background: #0f172a; }
        .summary-card.paid { background: #ff4d79; }
        .summary-card .icon {
          width: 56px;
          height: 56px;
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .summary-card label { font-size: 1rem; opacity: 0.8; font-weight: 600; }
        .summary-card h2 { font-size: 2.5rem; font-weight: 800; margin-top: 4px; }

        .comms-table-section {
          background: white;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid #f1f5f9;
        }
        .section-header { margin-bottom: 32px; }
        .section-header h3 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .section-header p { color: #64748b; font-size: 0.95rem; }

        .table-wrapper { overflow-x: auto; }
        .comms-table { width: 100%; border-collapse: collapse; text-align: left; }
        .comms-table th { padding: 16px; color: #94a3b8; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f8fafc; }
        .comms-table td { padding: 20px 16px; border-bottom: 1px solid #f8fafc; }
        
        .date-cell { display: flex; align-items: center; gap: 8px; color: #1e293b; font-weight: 600; font-size: 0.95rem; }
        .order-id { font-family: monospace; color: #64748b; background: #f8fafc; padding: 4px 8px; border-radius: 6px; border: 1px solid #f1f5f9; }
        .amount-cell { font-weight: 800; color: #0f172a; font-size: 1.1rem; }
        
        .status-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }
        .status-tag.paid { background: #dcfce7; color: #166534; }
        .status-tag.unpaid { background: #fffbeb; color: #92400e; }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          color: #94a3b8;
        }
        .btn-primary {
          background: #ff4d79;
          color: white;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 77, 121, 0.3); }

        .loader-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
        .loader { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top: 4px solid #ff4d79; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .dashboard-container { grid-template-columns: 1fr; }
          .sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
