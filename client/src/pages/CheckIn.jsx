import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function GuestRow({ guest, label, onCheckIn, loading }) {
  return (
    <div className="guest-row">
      <div
        className={`avatar-circle${guest.checkedIn ? ' done' : ''}`}
        style={{ width: 32, height: 32, fontSize: '0.7rem' }}
      >
        {guest.checkedIn ? '✓' : initials(guest.name)}
      </div>
      <div className="guest-row-info">
        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{guest.name}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--gray-600)' }}>{guest.email} · {guest.company}</div>
      </div>
      {guest.checkedIn ? (
        <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
          ✓ {guest.checkInTime ? new Date(guest.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Done'}
        </span>
      ) : (
        <button className="btn btn-primary btn-sm" onClick={onCheckIn} disabled={loading}>
          {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'Check in'}
        </button>
      )}
    </div>
  );
}

export default function CheckIn() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const searchRef = useRef();

  const handleSearch = async (q) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await api.get('/checkin/search', { params: { q } });
      setResults(res.data);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const checkInPrimary = async (regId) => {
    setLoadingId(`${regId}-primary`);
    try {
      const res = await api.patch(`/checkin/${regId}/primary`);
      updateResult(regId, res.data.registration);
      toast.success('Checked in!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoadingId(null);
    }
  };

  const checkInGuest = async (regId, guestIndex) => {
    setLoadingId(`${regId}-g${guestIndex}`);
    try {
      const res = await api.patch(`/checkin/${regId}/guest/${guestIndex}`);
      updateResult(regId, res.data.registration);
      toast.success('Guest checked in!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setLoadingId(null);
    }
  };

  const updateResult = (regId, updated) => {
    setResults(prev => prev.map(r => r._id === regId ? updated : r));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Event Check-in</h1>
        <p className="page-subtitle">Search attendees by name, email, phone, or registration code.</p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search attendee name, email, phone, or code…"
          style={{ paddingLeft: '42px', fontSize: '1rem', height: '50px', borderRadius: '14px' }}
          autoFocus
        />
        {searching && (
          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
            <span className="spinner dark" />
          </div>
        )}
      </div>

      {/* Results */}
      {results.length === 0 && query.trim() && !searching && (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No attendees found for "{query}"</p>
        </div>
      )}

      {results.map((reg) => {
        const allCheckedIn = reg.primaryGuest.checkedIn && reg.additionalGuests.every(g => g.checkedIn);
        return (
          <div key={reg._id} className={`checkin-card${allCheckedIn ? ' done' : ''}`}>
            <div className="checkin-card-header">
              <div className={`avatar-circle${reg.primaryGuest.checkedIn ? ' done' : ''}`}>
                {reg.primaryGuest.checkedIn ? '✓' : initials(reg.primaryGuest.name)}
              </div>
              <div className="checkin-info">
                <div className="checkin-name">
                  {reg.primaryGuest.name}
                  {reg.additionalGuests?.length > 0 && (
                    <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--gray-400)', fontWeight: 400 }}>
                      + {reg.additionalGuests.length} {reg.additionalGuests.length === 1 ? 'guest' : 'guests'}
                    </span>
                  )}
                </div>
                <div className="checkin-meta">
                  {reg.primaryGuest.email} · {reg.primaryGuest.company} · {reg.primaryGuest.phone}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontFamily: 'monospace', background: 'var(--gray-100)', padding: '2px 7px', borderRadius: '4px' }}>
                    {reg.registrationCode}
                  </span>
                </div>
              </div>
              {reg.primaryGuest.checkedIn ? (
                <span className="badge badge-teal">
                  ✓ {reg.primaryGuest.checkInTime
                    ? new Date(reg.primaryGuest.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                    : 'Checked in'}
                </span>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => checkInPrimary(reg._id)}
                  disabled={!!loadingId}
                >
                  {loadingId === `${reg._id}-primary` ? (
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Check in
                    </>
                  )}
                </button>
              )}
            </div>

            {reg.additionalGuests?.length > 0 && (
              <div className="guests-expand">
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Additional guests
                </p>
                {reg.additionalGuests.map((g, i) => (
                  <GuestRow
                    key={i}
                    guest={g}
                    label={`Guest ${i + 1}`}
                    onCheckIn={() => checkInGuest(reg._id, i)}
                    loading={loadingId === `${reg._id}-g${i}`}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {!query && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--gray-400)' }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: '1rem', opacity: 0.4 }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p style={{ fontSize: '0.95rem' }}>Start typing to search for attendees</p>
        </div>
      )}
    </div>
  );
}
