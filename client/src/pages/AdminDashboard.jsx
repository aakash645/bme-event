import { Fragment, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import api from '../utils/api';
import './AdminDashboard.css';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const statusLabel = (checkedIn) =>
  checkedIn ? (
    <span className="badge badge-teal">✓ Checked in</span>
  ) : (
    <span className="badge badge-gray">Pending</span>
  );

export default function AdminDashboard() {
  const { username } = useAuth();
  const [data, setData] = useState({ registrations: [], total: 0, pages: 1, stats: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/registrations', {
        params: { search, status, page, limit: 15 },
      });
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchData(); }, 350);
    return () => clearTimeout(t);
  }, [search, fetchData]);

  const handleExport = async (type = 'all') => {
    setExporting(true);
    try {
      const res = await api.get('/admin/export', { params: { type }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event-registrations-${type}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded!');
    } catch (err) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this registration?')) return;
    try {
      await api.delete(`/admin/registrations/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const { stats } = data;
  const checkedInPct = stats.totalGuests
    ? Math.round((stats.checkedIn / stats.totalGuests) * 100)
    : 0;

  return (
    <div className="page-container wide">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {username} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-sm" onClick={() => handleExport('all')} disabled={exporting}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export all
          </button>
          <button className="btn btn-teal btn-sm" onClick={() => handleExport('checkedIn')} disabled={exporting}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export checked-in
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Registrations</div>
          <div className="stat-value purple">{stats.totalRegistrations ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total guests</div>
          <div className="stat-value">{stats.totalGuests ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Checked in</div>
          <div className="stat-value green">{stats.checkedIn ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Attendance rate</div>
          <div className="stat-value">{checkedInPct}%</div>
        </div>
      </div>

      <div className="table-container">
        <div className="desktop-table responsive-table">
          <div className="table-toolbar">
            <div className="search-input-wrap">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by name, email, company…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} style={{ width: 'auto' }}>
              <option value="all">All registrations</option>
              <option value="checkedIn">Checked in</option>
              <option value="pending">Pending</option>
            </select>
            <button className="btn btn-ghost btn-sm" onClick={fetchData}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Refresh
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <span className="spinner dark" style={{ margin: '0 auto' }} />
            </div>
          ) : data.registrations.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <p>No registrations found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Check-in time</th>
                  <th>Registered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.registrations.map((r) => (
                  <Fragment key={r._id}>
                    <tr
                      style={{ cursor: r.additionalGuests?.length ? 'pointer' : 'default' }}
                      onClick={() => r.additionalGuests?.length && setExpandedId(expandedId === r._id ? null : r._id)}
                    >
                      <td style={{ fontWeight: 500 }}>
                        {r.primaryGuest.name}
                        {r.additionalGuests?.length > 0 && (
                          <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: 'var(--gray-400)' }}>
                            {expandedId === r._id ? '▲' : '▼'}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--gray-600)' }}>{r.primaryGuest.email}</td>
                      <td style={{ color: 'var(--gray-600)' }}>{r.primaryGuest.phone}</td>
                      <td>{r.primaryGuest.company}</td>
                      <td>
                        {r.additionalGuests?.length > 0 ? (
                          <span className="guest-pill">+{r.additionalGuests.length}</span>
                        ) : '—'}
                      </td>
                      <td>{statusLabel(r.primaryGuest.checkedIn)}</td>
                      <td style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>
                        {r.primaryGuest.checkInTime
                          ? new Date(r.primaryGuest.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                      <td style={{ color: 'var(--gray-600)', fontSize: '0.8rem' }}>
                        {new Date(r.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => { e.stopPropagation(); handleDelete(r._id); }}
                          title="Delete"
                          style={{ color: 'var(--red)', padding: '4px 8px' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </td>
                    </tr>
                    {expandedId === r._id && r.additionalGuests?.map((g, i) => (
                      <tr key={`${r._id}-g${i}`} style={{ background: 'var(--purple-light)' }}>
                        <td style={{ paddingLeft: '2rem', color: 'var(--purple-dark)', fontSize: '0.85rem' }}>↳ {g.name}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{g.email}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{g.phone}</td>
                        <td style={{ fontSize: '0.85rem' }}>{g.company}</td>
                        <td>—</td>
                        <td>{statusLabel(g.checkedIn)}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                          {g.checkInTime ? new Date(g.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td colSpan="2" />
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mobile-registration-list">
          {loading ? null : data.registrations.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <p>No registrations found</p>
            </div>
          ) : (
            data.registrations.map((r) => {
              const isOpen = expandedId === r._id;
              return (
                <div key={r._id} className="mobile-registration-card">
                  <div className="mobile-card-header">
                    <div>
                      <h3 style={{ margin: 0 }}>{r.primaryGuest.name}</h3>
                      <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.9rem' }}>{r.primaryGuest.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span>{statusLabel(r.primaryGuest.checkedIn)}</span>
                      <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(r._id); }} style={{ color: 'var(--red)', padding: '6px 8px' }}>Delete</button>
                    </div>
                  </div>

                  <div className="mobile-card-body">
                    <p style={{ margin: 0, color: 'var(--gray-600)' }}>{r.primaryGuest.phone} · {r.primaryGuest.company}</p>
                    <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.85rem' }}>Registered: {new Date(r.createdAt).toLocaleDateString('en-IN')}</p>

                    {r.additionalGuests?.length > 0 && (
                      <details className="guest-details" open={isOpen} onClick={() => setExpandedId(isOpen ? null : r._id)}>
                        <summary>{isOpen ? 'Hide guests' : `View ${r.additionalGuests.length} guest(s)`}</summary>
                        {r.additionalGuests.map((g, i) => (
                          <div key={`${r._id}-g${i}`} className="guest-item">{g.name} · {g.email}</div>
                        ))}
                      </details>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {data.pages > 1 && (
          <div className="pagination">
            <span>Showing page {page} of {data.pages} · {data.total} total</span>
            <div className="pagination-btns">
              <button className="btn btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
              <button className="btn btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === data.pages}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
