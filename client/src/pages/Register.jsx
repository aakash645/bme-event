import { useState, useRef  , useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GuestFields from "../components/GuestFields";
import api from "../utils/api";
import "./Register.css";


export default function Register() {
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
    <section className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          style={{
            backgroundImage: `url(${slide})`,
          }}
        />
      ))}

      <div className="hero-overlay"></div>

      <div className="hero-content">
        {/* <div className="hero-tag">
          Bharat Metal Exchange Evolves Ceremony
        </div> */}

        <h1>Are You Future Ready?</h1>

        <p>
          Join us as Bombay Metal Exchange evolves into Bharat Metal
          Exchange. Witness a defining moment in the Indian metal industry
          alongside business leaders, innovators, members, and partners.
          Together we celebrate the past, embrace transformation, and
          shape the future.
        </p>

        <button
          className="hero-btn"
          onClick={() =>
            document
              .querySelector(".registration-page")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Register Now
        </button>
      </div>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === currentSlide ? "active-dot" : ""}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section> 
    <div className="registration-page">
      {/* LEFT SIDE */}

      <div className="event-section">
        <div className="event-overlay"></div>

        <div className="event-content">
          <div className="event-tag">Be A Part Of History</div>

          <h1>
            Bombay Metal Exchange
            <span> Evolves To </span>
            Bharat Metal Exchange
          </h1>

          <p className="event-description">
            The President, Office Bearers and Board of Directors warmly
            invite you to celebrate a landmark chapter in our
            journey. Join industry leaders, members and partners as we
            mark this milestone together.
          </p>

          <div className="event-cards">
            <div className="info-card">
              <small>DATE & TIME</small>
              <h3>20 June 2026</h3>
              <p>4:00 PM</p>
            </div>

            <div className="info-card">
              <small>VENUE</small>
              <h3>Jade Ball Room</h3>
              <p>
                Hotel Sahara Star
                <br />
                Mumbai
              </p>
            </div>
          </div>

          <div className="event-highlights">
            <h3>Event Highlights</h3>

            <ul>
              <li>Official Unveiling of Bharat Metal Exchange</li>
              <li>Industry Leadership Address</li>
              <li>Strategic Vision 2030</li>
              <li>Networking Dinner</li>
              <li>Recognition & Awards Ceremony</li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="form-section">
        <div className="rsvp-card">
          <div className="rsvp-badge">Would Love To Hear</div>

          <h2>
            Will you be attending the Bharat Metal Exchange Evolve Ceremony?
          </h2>

          <p>
            Kindly confirm your participation for the historic transformation
            of Bombay Metal Exchange into Bharat Metal Exchange on
            <strong> 20 June 2026 by 4:00 PM </strong>
            at
            <strong> Jade Ball Room, Hotel Sahara Star, Mumbai.</strong>
          </p>

          <div className="attendee-counter">
            <span>150+</span> Industry Leaders Confirmed
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
    <section className="brands-section">
      <h2 className="brands-title">Our Title Sponsor</h2>
      <div className="brands-slider">
        <div className="brands-track">
          {[...brands, ...brands].map((brand, index) => (
            <div className="brand-item" key={index}>
              <img src={brand} alt="brand" />
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
