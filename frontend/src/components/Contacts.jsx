import React, { useState } from "react";
import Header from "./Header";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import "./Contacts.css";
import Footer from "./Footer";
import { useEffect } from "react";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text }
  const [toastVisible, setToastVisible] = useState(false);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const showToast = (type, text) => {
    setStatus({ type, text });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with real API call if available
      await new Promise((r) => setTimeout(r, 900));
      showToast("success", "Thanks — we'll contact you soon!");
      setFormData({ name: "", email: "", phone: "", eventType: "", message: "" });
    } catch (err) {
      showToast("error", "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
      document.title = "DivineDekor - Contact";
    }, []);

  return (
    <>
      <Header />
      <section className="contacts-hero">
        <div className="hero-inner">
          <h1 className="hero-title">Let's plan something beautiful</h1>
          <p className="hero-sub">
            Tell us about your event — we’ll craft a personalized decor plan that
            fits your vision and budget.
          </p>
          <div className="hero-ctas">
            <a className="cta-primary" href="tel:+919045328550">
              <FaPhoneAlt /> Call Now
            </a>
            <a
              className="cta-ghost"
              href="https://wa.me/919045328550?text=Hi%2C%20I%20want%20a%20quote"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="var(--color-bg)" d="M0,40 C360,120 1080,-40 1440,40 L1440 80 L0 80 Z" />
        </svg>
      </section>

      <main className="contacts-container">
        <div className="contact-grid">
          <div className="left-col">
            <div className="contact-cards">
              <div className="contact-card accent">
                <FaPhoneAlt className="icon" />
                <h4>Talk to us</h4>
                <p className="muted">Immediate responses during business hours</p>
                <a href="tel:+919045328550" className="link">+91 90453 28550</a>
              </div>

              <div className="contact-card accent">
                <FaWhatsapp className="icon" />
                <h4>Quick chat</h4>
                <p className="muted">Share images or event details on WhatsApp</p>
                <a
                  className="link"
                  href="https://wa.me/919045328550?text=Hello"
                  target="_blank"
                  rel="noreferrer"
                >
                  Message
                </a>
              </div>

              <div className="contact-card accent">
                <FaInstagram className="icon" />
                <h4>Follow work</h4>
                <p className="muted">Latest setups and inspirations</p>
                <a className="link" href="https://www.instagram.com/tandon_shop_for_party?igsh=MXR2NDg2MmVzNDBhbQ==" target="_blank" rel="noreferrer">@divinedecor</a>
              </div>
            </div>

            <div className="business-block">
              <div className="info">
                <FaClock className="info-icon" />
                <div>
                  <h5>Hours</h5>
                  <p className="muted">Mon - Sat · 9:00 AM — 8:00 PM</p>
                </div>
              </div>

              <div className="info">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <h5>Location</h5>
                  <p className="muted">Tandon Decorators, Sambhal, Uttar Pradesh</p>
                </div>
              </div>

              <div className="map-preview">
                <iframe
                  title="location"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3503.533260355046!2d78.56569937549901!3d28.583775075691413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDM1JzAxLjYiTiA3OMKwMzQnMDUuOCJF!5e0!3m2!1sen!2sin!4v1762344605440!5m2!1sen!2sin"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <aside className="right-col">
            <div className="form-card">
              <h3>Get a free quote</h3>
              <p className="muted">Share event type, date and any preferences.</p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="row">
                  <label className="input-icon">
                    <input name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
                  </label>
                  <label className="input-icon">
                    <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                  </label>
                </div>

                <div className="row">
                  <label className="input-icon">
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                  </label>
                  <label className="input-icon">
                    <input name="eventType" placeholder="Event type (e.g. wedding)" value={formData.eventType} onChange={handleChange} required />
                  </label>
                </div>

                <label className="input-icon">
                  <textarea name="message" rows="4" placeholder="Brief message / requirements" value={formData.message} onChange={handleChange} required />
                </label>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Sending…" : "Request Quote"}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setFormData({ name: "", email: "", phone: "", eventType: "", message: "" })}>
                    Clear
                  </button>
                </div>
              </form>

              <div className="small-note">
                <FaEnvelope /> We'll reply within 24 hours. For urgent requests use WhatsApp.
              </div>
            </div>
          </aside>
        </div>
      </main>

      <a className="floating-wa" href="https://wa.me/919045328550?text=Hi" target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <FaWhatsapp />
      </a>

      {toastVisible && status && (
        <div className={`toast ${status.type}`}>{status.text}</div>
      )}
      <Footer />
    </>
  );
};

export default Contacts;