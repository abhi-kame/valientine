'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  IndianRupee, 
  ArrowUpRight, 
  MoreVertical,
  Search,
  Filter,
  CreditCard,
  ShieldAlert,
  Save
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('affiliates');
  const [affiliates, setAffiliates] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const lastTabRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'affiliates') {
        const res = await fetch('/api/admin/affiliates');
        const data = await res.json();
        setAffiliates(data.affiliates || []);
      } else if (activeTab === 'payouts') {
        const res = await fetch('/api/admin/payouts');
        const data = await res.json();
        setPayouts(data.payouts || []);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch('/api/admin/affiliates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchData();
    } catch (err) {
      alert('Update failed');
    }
  };

  const markAsPaid = async (affiliateId) => {
    if (!confirm('Mark all pending commissions for this partner as PAID?')) return;
    setProcessing(true);
    try {
      await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliateId })
      });
      fetchData();
    } catch (err) {
      alert('Action failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="admin-logo">ValenTiny <span>Admin</span></div>
        <div className="nav-links">
          <button 
            className={activeTab === 'affiliates' ? 'active' : ''} 
            onClick={() => setActiveTab('affiliates')}
          >
            <Users size={18} /> Partners
          </button>
          <button 
            className={activeTab === 'payouts' ? 'active' : ''} 
            onClick={() => setActiveTab('payouts')}
          >
            <CreditCard size={18} /> Payouts
          </button>
        </div>
      </nav>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab === 'affiliates' ? 'Manage Partners' : 'Process Payouts'}</h1>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={16} />
              <input placeholder="Search records..." />
            </div>
            <button className="refresh-btn" onClick={fetchData}>Refresh</button>
          </div>
        </header>

        {loading ? (
          <div className="loader">Updating records...</div>
        ) : activeTab === 'affiliates' ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Status</th>
                  <th>Ref Code</th>
                  <th>Earnings (₹)</th>
                  <th>Unpaid (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map(aff => (
                  <tr key={aff.id}>
                    <td>
                      <div className="user-info">
                        <strong>{aff.name}</strong>
                        <span>{aff.upi_id || 'No UPI'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${aff.status}`}>
                        {aff.status}
                      </span>
                    </td>
                    <td><code>{aff.ref_code}</code></td>
                    <td>₹{aff.totalEarnings}</td>
                    <td className="unpaid-cell">₹{aff.unpaidEarnings}</td>
                    <td>
                      <div className="actions-cell">
                        {aff.status === 'pending' && (
                          <button 
                            className="approve-btn"
                            onClick={() => updateStatus(aff.id, 'active')}
                          >
                            <CheckCircle size={16} /> Approve
                          </button>
                        )}
                        <button className="reject-btn" onClick={() => updateStatus(aff.id, 'banned')}>
                          <XCircle size={16} /> Ban
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="payout-grid">
            {payouts.length === 0 ? (
              <div className="empty-state">No pending payouts found. Good job! 🥂</div>
            ) : (
              payouts.map(pay => (
                <div className="payout-card" key={pay.affiliateId}>
                  <div className="card-header">
                    <div>
                      <h3>{pay.name}</h3>
                      <p>UPI: {pay.upi}</p>
                    </div>
                    <div className="amount">₹{pay.totalAmount}</div>
                  </div>
                  <div className="card-body">
                    <p>{pay.orders.length} orders pending payment</p>
                  </div>
                  <div className="card-footer">
                    <button 
                      className="pay-btn" 
                      onClick={() => markAsPaid(pay.affiliateId)}
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : 'Mark as Paid'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-container {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: 'Inter', sans-serif;
        }
        .admin-nav {
          background: #0f172a;
          color: white;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .admin-logo { font-size: 1.4rem; font-weight: 800; color: #ff4d79; }
        .admin-logo span { color: #94a3b8; font-size: 0.9rem; margin-left: 4px; }
        .nav-links { display: flex; flex-direction: column; gap: 8px; }
        .nav-links button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 8px;
          font-weight: 600;
          text-align: left;
        }
        .nav-links button:hover, .nav-links button.active {
          background: #1e293b;
          color: white;
        }
        .admin-main { padding: 40px; }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; }
        .header-actions { display: flex; gap: 12px; }
        .search-bar {
          background: white;
          padding: 8px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #e2e8f0;
        }
        .search-bar input { border: none; outline: none; font-size: 0.9rem; }
        .refresh-btn { 
          padding: 8px 20px; 
          background: white; 
          border: 1px solid #e2e8f0; 
          border-radius: 10px; 
          font-weight: 600; 
          cursor: pointer;
        }

        .table-responsive {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8fafc; padding: 16px; color: #64748b; font-size: 0.85rem; text-transform: uppercase; font-weight: 700; }
        .admin-table td { padding: 16px; border-top: 1px solid #f1f5f9; vertical-align: middle; }
        .user-info { display: flex; flex-direction: column; }
        .user-info span { font-size: 0.8rem; color: #64748b; }
        .status-pill { padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .status-pill.active { background: #dcfce7; color: #166534; }
        .status-pill.pending { background: #fef9c3; color: #854d0e; }
        .status-pill.banned { background: #fee2e2; color: #991b1b; }
        .unpaid-cell { color: #dc2626; font-weight: 700; }
        
        .actions-cell { display: flex; gap: 8px; }
        .actions-cell button { 
          padding: 6px 12px; 
          border-radius: 8px; 
          border: 1px solid #e2e8f0; 
          background: white; 
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .approve-btn:hover { color: #166534; border-color: #166534; }
        .reject-btn:hover { color: #991b1b; border-color: #991b1b; }

        .payout-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .payout-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .card-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .card-header h3 { font-size: 1.1rem; font-weight: 800; color: #1e293b; }
        .card-header p { font-size: 0.85rem; color: #64748b; }
        .amount { font-size: 1.5rem; font-weight: 800; color: #166534; }
        .pay-btn {
          width: 100%;
          padding: 12px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }
        .empty-state { text-align: center; padding: 100px; color: #64748b; font-size: 1.1rem; }
      `}</style>
    </div>
  );
}
