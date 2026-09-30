'use client';

import { useState, useEffect } from 'react';

interface Application {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  vehicles: string;
  licenceNumber: string;
  documentPath: string | null;
  documentOriginalName: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const savedSecret = localStorage.getItem('instrctr_admin_secret');
    if (savedSecret) {
      setSecret(savedSecret);
      fetchApplications(savedSecret);
    }
  }, []);

  async function fetchApplications(adminSecret: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/applications?secret=${encodeURIComponent(adminSecret)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setApplications(data.applications);
        setIsLoggedIn(true);
        localStorage.setItem('instrctr_admin_secret', adminSecret);
      } else {
        setError(data.error || 'Invalid Admin Password');
        setIsLoggedIn(false);
      }
    } catch (err) {
      setError('Connection failed. Please verify your server status.');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, newStatus: string) {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setApplications(prev =>
          prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!secret) return;
    fetchApplications(secret);
  }

  function handleLogout() {
    localStorage.removeItem('instrctr_admin_secret');
    setIsLoggedIn(false);
    setApplications([]);
    setSecret('');
  }

  function exportCSV() {
    if (applications.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'City', 'Area', 'Vehicles', 'Licence', 'Status', 'Date', 'Document URL'];
    const rows = applications.map(a => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.city}"`,
      `"${a.area}"`,
      `"${a.vehicles}"`,
      `"${a.licenceNumber}"`,
      `"${a.status}"`,
      `"${new Date(a.createdAt).toLocaleString()}"`,
      `"${a.documentPath ? window.location.origin + a.documentPath : 'None'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `instrctr_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filtered = applications.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.phone.includes(search) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.licenceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCity = filterCity ? app.city === filterCity : true;
    const matchesStatus = filterStatus ? app.status === filterStatus : true;
    return matchesSearch && matchesCity && matchesStatus;
  });

  const uniqueCities = Array.from(new Set(applications.map(a => a.city).filter(Boolean)));

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0d14', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '420px', width: '100%', background: '#131823', padding: '36px', borderRadius: '16px', border: '1px solid #232b3e', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#60a5fa' }}>Instrctr Portal</h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Enter your Admin Password to access applications stored in SQLite</p>
          </div>
          {error && <div style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>Admin Secret Key</label>
              <input
                type="password"
                placeholder="Enter ADMIN_SECRET"
                value={secret}
                onChange={e => setSecret(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', background: '#0b0f17', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="/" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none' }}>← Back to Website</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f17', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>Instrctr</span>
              <span style={{ background: '#1e293b', color: '#38bdf8', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>SQLite Storage</span>
            </div>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Showing {filtered.length} of {applications.length} instructor applications
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={exportCSV}
              style={{ background: '#0f766e', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              ⬇ Export to CSV
            </button>
            <button
              onClick={() => fetchApplications(secret)}
              style={{ background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', padding: '9px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              ↻ Refresh
            </button>
            <button
              onClick={handleLogout}
              style={{ background: '#374151', color: '#f87171', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', background: '#131823', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <input
            type="text"
            placeholder="🔍 Search by name, phone, email, licence..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '1 1 240px', padding: '10px 14px', background: '#0b0f17', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
          />
          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            style={{ flex: '0 1 180px', padding: '10px 14px', background: '#0b0f17', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
          >
            <option value="">All Cities</option>
            {uniqueCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ flex: '0 1 180px', padding: '10px 14px', background: '#0b0f17', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications List / Table */}
        {filtered.length === 0 ? (
          <div style={{ background: '#131823', padding: '48px 24px', textAlign: 'center', borderRadius: '12px', border: '1px solid #1e293b', color: '#64748b' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>No applications found matching the criteria.</p>
          </div>
        ) : (
          <div style={{ background: '#131823', borderRadius: '12px', border: '1px solid #1e293b', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#182030', color: '#94a3b8', borderBottom: '1px solid #232d42' }}>
                  <th style={{ padding: '14px 18px' }}>Applicant</th>
                  <th style={{ padding: '14px 18px' }}>Contact</th>
                  <th style={{ padding: '14px 18px' }}>Location</th>
                  <th style={{ padding: '14px 18px' }}>Vehicles</th>
                  <th style={{ padding: '14px 18px' }}>Licence & Document</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px' }}>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #1a2233' }}>
                    <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                      <strong style={{ display: 'block', color: '#f1f5f9', fontSize: '15px' }}>{app.name}</strong>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>ID #{app.id}</span>
                    </td>
                    <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                      <a href={`tel:${app.phone}`} style={{ display: 'block', color: '#38bdf8', textDecoration: 'none', fontWeight: 500 }}>
                        📞 {app.phone}
                      </a>
                      <a href={`mailto:${app.email}`} style={{ display: 'block', color: '#94a3b8', textDecoration: 'none', fontSize: '13px', marginTop: '4px' }}>
                        ✉️ {app.email}
                      </a>
                    </td>
                    <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 500, color: '#f8fafc' }}>{app.city}</div>
                      <div style={{ color: '#94a3b8', fontSize: '13px' }}>{app.area}</div>
                    </td>
                    <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                      <span style={{ background: '#1e293b', color: '#cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>
                        {app.vehicles}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                      <div style={{ fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '6px' }}>{app.licenceNumber}</div>
                      {app.documentPath ? (
                        <a
                          href={app.documentPath}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#2563eb22', color: '#60a5fa', border: '1px solid #2563eb55', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}
                        >
                          📄 View Licence Document ↗
                        </a>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '12px' }}>No file uploaded</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                      <select
                        value={app.status}
                        onChange={e => updateStatus(app.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background:
                            app.status === 'approved'
                              ? '#065f46'
                              : app.status === 'contacted'
                              ? '#075985'
                              : app.status === 'rejected'
                              ? '#881337'
                              : '#78350f',
                          color: '#fff',
                          border: 'none',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px 18px', verticalAlign: 'top', color: '#94a3b8', fontSize: '13px' }}>
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
