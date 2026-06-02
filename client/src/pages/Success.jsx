import { useLocation, useNavigate } from 'react-router-dom';

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.code) {
    navigate('/');
    return null;
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          You're registered!
        </h1>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
          Welcome, <strong>{state.name}</strong>. We look forward to seeing you at the event.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
          Your registration code
        </p>
        <div className="reg-code">{state.code}</div>
        <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '0.5rem', marginBottom: '2rem' }}>
          Save this code or take a screenshot — you may need it at check-in
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Register another person
        </button>
      </div>
    </div>
  );
}
