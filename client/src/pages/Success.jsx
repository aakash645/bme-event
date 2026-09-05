import { useLocation, useNavigate } from 'react-router-dom';
import './Register.css';

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
          Save this code or take a screenshot — you may need it at check-in ,For Any Queries , Reach us at +91 97690 28890 or mail us at info@bme.in
        </p>
        
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Register another person
        </button>
        <br/>
        <section className="venue-section">
  <div className="venue-container">
    {/* Left Side - Venue Details */}
    <div className="venue-info">
      <h2 className="venue-title">Where We Meet</h2>

      <div className="venue-content">
        <img
          src="/venue.jpg"
          alt="Venue"
          className="venue-image"
        />

        <div className="venue-details">
          <h3>NSE Atrium (NSE)</h3>
          
          <p>
           National Stock Exchange of India Ltd.,
Bandra Kurla Complex,
Bandra (E)
Mumbai – 400 051
          </p>

          <a
            href="https://share.google/Uqm3guN9Qej5zrJXI"
            target="_blank"
            rel="noopener noreferrer"
            className="venue-button"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>

    {/* Right Side - Map */}
    <div className="venue-map">
      <iframe
        title="Venue Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0870257741253!2d72.85763937520504!3d19.059910982141375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8dd865932f5%3A0xde111e7daa319c82!2sNational%20Stock%20Exchange!5e0!3m2!1sen!2sin!4v1788640656852!5m2!1sen!2sin
"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>
      </div>
</div>
    
  );
}
