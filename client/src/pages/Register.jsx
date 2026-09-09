import { useState, useRef  , useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GuestFields from "../components/GuestFields";
import api from "../utils/api";
import "./Register.css";


export default function Register() {

  const [showSponsorPopup, setShowSponsorPopup] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(null);

  const brands = [
    // "/apple.png",
    "/phonepe.png",
    "/phonepe.png",
    "/phonepe.png",
  ];

  const formRef = useRef(null);
   
  const slides = [
  "/slider1.jpg",
  "/slider2.jpg",
  "/slider3.jpg",
];

const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, 4000);

  

  return () => clearInterval(interval);
}, [slides.length]);


  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      primaryGuest: {
        name: "",
        phone: "",
        email: "",
        company: "",
      },
      additionalGuests: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalGuests",
  });

  const handleAttendClick = () => {
    setRsvpStatus("yes");

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await api.post("/register", data);

      navigate("/success", {
        state: {
          code: res.data.registrationCode,
          name: data.primaryGuest.name,
        },
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Registration failed. Please try again.";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

     {/* HERO SLIDER */}
    
    
    <div className="registration-page">
      {/* LEFT SIDE */}

      <div className="event-section">
        <div className="event-overlay"></div>

        <div className="event-content">
          <div className="event-tag">70th Member's Annual General Meeting</div>

          <h1>
            Bharat Metal Exchange
            <span>70th Annual General Meeting 2026 </span>
            
          </h1>

          <p className="event-description">
            Bharat Metal Exchange invites its members to the Annual General Meeting-an evening of resolutions, board recognition and reconnecting with the indudstry, followed by dinner. 
          </p>

          <div className="event-cards">
            <div className="info-card">
              <small>DATE & TIME</small>
              <h3>Saturday, 19th Sep 2026</h3>
              <p>5:00 PM</p>
            </div>

            <div className="info-card">
              <small>VENUE</small>
              <h3>NSE Atrium</h3>
              <p>
                NSE, Bandra Kurla Complex
                <br />
                Mumbai
              </p>
            </div>
          </div>

          <div className="event-highlights">
            <h3>What the evening covers</h3>
            <p>
                From resolutions to recognition-here's the shape of evening. A detailed schedule is shared with members closer to the date.
              </p>
<br />
            <ul>
              <li>Welcome Address & AGM Proceedings</li>
              <li>Board Introductions</li>
              <li>Leadership Addressess</li>
              <li>Excellence Awards</li>
              <li>Networking & Dinner</li>
              <li>Press Conference</li>
              
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="form-section">
        <div className="rsvp-card">
          <div className="rsvp-badge">Would Love To Hear</div>

          <h2>
            Will you be attending the Bharat Metal Exchange 70th AGM 2026?
          </h2>

          <p>
            Members are requested to confirm the attendance in advance to help us pla seating and dinner arrangements 
            <strong> 19th Sep 2026 by 5:00 PM </strong>
            at
            <strong> NSE Atrium, NSE, Bandra Kurla Complex, Mumbai.</strong>
          </p>

          <div className="attendee-counter">
            <span>Registration is mandatory, </span>Entry can be restricted as per the NSE guidelines.
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '0.5rem', marginBottom: '2rem' }}>
          For Any Queries, Reach us at +91 97690 28890 or mail us at info@bme.in
        </p>
          </div>

          <div className="rsvp-buttons">
            <button
              type="button"
              className={`rsvp-btn yes ${
                rsvpStatus === "yes" ? "active" : ""
              }`}
              onClick={handleAttendClick}
            >
              ✓ Yes, I Will Attend
            </button>

            <button
              type="button"
              className={`rsvp-btn no ${
                rsvpStatus === "no" ? "active" : ""
              }`}
              onClick={() => setRsvpStatus("no")}
            >
              ✕ Unable To Attend
            </button>
          </div>
        </div>

        {rsvpStatus === "no" && (
          <div className="decline-card">
            <div className="decline-icon">❤</div>

            <h3>Thank You For Your Response</h3>

            <p>
              We appreciate your response. Although you will not be attending,
              we look forward to connecting with you in future Bharat Metal
              Exchange initiatives and industry events.
            </p>
          </div>
        )}

        {rsvpStatus === "yes" && (
          <div ref={formRef}>
            <div className="page-header">
              <h2>Complete Your Registration</h2>

              <p>
                Please provide your details below to confirm attendance.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="card">
                <div className="card-header">
                  <h3>Primary Attendee</h3>
                </div>

                <GuestFields
                  register={register}
                  errors={errors}
                  prefix="primaryGuest"
                />
              </div>

              {fields.map((field, index) => (
                <div className="card" key={field.id}>
                  <div className="card-header guest-header">
                    <h3>Guest {index + 1}</h3>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  </div>

                  <GuestFields
                    register={register}
                    errors={errors}
                    prefix={`additionalGuests.${index}`}
                  />
                </div>
              ))}

              <button
                type="button"
                className="add-guest-btn"
                onClick={() =>
                  append({
                    name: "",
                    phone: "",
                    email: "",
                    company: "",
                  })
                }
              >
                + Add Additional Guest
              </button>

              {fields.length > 0 && (
                <div className="guest-count">
                  {fields.length} Additional Guest
                  {fields.length > 1 ? "s" : ""} Added
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Confirm Registration"}
              </button>
            </form>
          </div>
        )}
      </div>


    </div>
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
           National Stock Exchange of India Ltd., Bandra, Kurla Complex, Bandra (E), Mumbai – 400 051
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


    
    </>
  );
}
