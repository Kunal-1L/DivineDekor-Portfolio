import "./Home.css";
import { use, useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import useScrollAnimation from "../hooks/useScrollAnimation";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useScrollAnimation();
  const handleUploadImageClick = () => {
    setShowUpload(!showUpload);
  };
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TandonDekor - Home";
    const flag = localStorage.getItem("isAdmin");
    setIsAdmin(flag === "true");
  }, []);

  // fetch reviews with error handling
  useEffect(() => {
    let cancelled = false;
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/testimonials`, {
          timeout: 5000,
        });
        if (!cancelled && Array.isArray(res.data)) {
          setReviews(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err?.message || err);
        if (!cancelled) setReviews([]); // fallback
      }
    };
    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // helper to render star characters
  const renderStars = (rating = 0, max = 5) =>
    Array.from({ length: max }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        {i < rating ? "★" : "☆"}
      </span>
    ));

  // feedback form state & handler
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    // client-side validation
    const text = (feedbackText || "").trim();
    if (!text) return;
    if (text.length > 1000) {
      alert("Feedback is too long (max 1000 chars).");
      return;
    }
    let rating = Number(feedbackRating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) rating = 5;
    const authorName = (feedbackName || "").trim();
    const newReview = {
      text,
      author: authorName ? `- ${authorName}` : "- Anonymous",
      rating: Math.round(rating),
    };

    try {
      const res = await axios.post(`${apiUrl}/api/testimonials`, newReview, {
        timeout: 5000,
      });
      // use server response if available (it includes createdAt)
      const saved = res?.data ? res.data : newReview;
      setReviews((prev) => [saved, ...prev].slice(0, 50));
      setFeedbackName("");
      setFeedbackText("");
      setFeedbackRating(5);
    } catch (err) {
      console.error("Failed to submit feedback:", err?.message || err);
      // optimistic update — still add locally so user sees it
      setReviews((prev) =>
        [{ ...newReview, createdAt: new Date().toISOString() }, ...prev].slice(
          0,
          50
        )
      );
    }
  };

  const faqs = [
    {
      question: "Do you offer custom decoration designs?",
      answer:
        "Yes, we specialize in creating custom decoration designs tailored to your event theme and preferences.",
    },
    {
      question: "What is the booking process?",
      answer:
        "You can contact us via phone or WhatsApp to discuss your event requirements and book our services.",
    },
    {
      question: "Do you provide decoration services for outdoor events?",
      answer:
        "Yes, we offer decoration services for both indoor and outdoor events, ensuring a beautiful setup regardless of the venue.",
    },
  ];

  return (
    <>
      {/* Header */}
      <Header />
      {/* Hero Banner */}
      <div id="banner" className="banner">
        <div className="banner-content">
          <h1 className="banner-title">
            Transform Your Space with Tandon Events
          </h1>
          <p className="banner-subtitle">
            We create the vibe, you create the memories.
          </p>

          <div className="banner-cta-row">
            <button
              className="banner-button"
              onClick={() => navigate("/gallery")}
            >
              See Portfolio
            </button>
            <a className="banner-ghost" href="#contact">
              Contact Now
            </a>
          </div>
          <ul className="banner-features">
            <li>Free consultation</li>
            <li>Fast delivery</li>
            <li>Custom designs</li>
          </ul>
        </div>
        {isAdmin && (
          <button
            className="banner-button"
            style={{ marginTop: 32 }}
            onClick={() => handleUploadImageClick()}
          >
            {showUpload ? " Cancel Upload" : "Upload Image"}
          </button>
        )}
        {showUpload && <ImageUpload />}
      </div>

      {/* Categories */}
      <div id="categories" className="categories">
        <h2 className="categories-title fade-up">Explore Our Categories</h2>
        <div className="categories-list">
          <Link to="/gallery?type=birthday decor" className="category-link">
            <div className="category-card">
              <div>
                <img
                  src="categories/Birthday Decorations.jpeg"
                  alt="Birthday Party Decorations"
                />
              </div>
              <div className="category-name">Birthday Decor</div>
            </div>
          </Link>

          <Link
            to={`/gallery?type=${encodeURIComponent("Baby Shower & Welcome")}`}
            className="category-link"
          >
            <div className="category-card">
              <div>
                <img
                  src="categories/Baby Shower.jpeg"
                  alt="Baby Shower Decorations"
                />
              </div>
              <div className="category-name">Baby Shower & Welcome</div>
            </div>
          </Link>

          <Link to="/gallery?type=anniversary decor" className="category-link">
            <div className="category-card">
              <div>
                <img
                  src="categories/Anniversary Decorations.jpeg"
                  alt="Anniversary Decorations"
                />
              </div>
              <div className="category-name">Anniversary Decor</div>
            </div>
          </Link>

          <Link
            to={`/gallery?type=${encodeURIComponent("Haldi & Mehndi")}`}
            className="category-link"
          >
            <div className="category-card">
              <div>
                <img
                  src="categories/Haldi_mehndi.jpeg"
                  alt="Haldi and Mehndi Decorations"
                />
              </div>
              <div className="category-name">Haldi & Mehndi</div>
            </div>
          </Link>

          <Link to="/gallery?type=gift packing" className="category-link">
            <div className="category-card">
              <div>
                <img
                  src="categories/Gift Packing.jpeg"
                  alt="Gift Wrapping and Packaging"
                />
              </div>
              <div className="category-name">Gift Packing</div>
            </div>
          </Link>

          <Link to="/gallery?type=car decor" className="category-link">
            <div className="category-card">
              <div>
                <img
                  src="categories/Car Decoration.jpeg"
                  alt="Car Flower Decorations"
                />
              </div>
              <div className="category-name">Car Decor</div>
            </div>
          </Link>

          <Link to="/gallery?type=wedding decor" className="category-link">
            <div className="category-card">
              <div>
                <img
                  src="categories/Wedding Pyro.jpeg"
                  alt="Wedding Stage and Entry Decorations"
                />
              </div>
              <div className="category-name">Wedding Decor</div>
            </div>
          </Link>

          <Link to="/gallery?type=cake corner" className="category-link">
            <div className="category-card">
              <div>
                <img src="categories/Cake.jpeg" alt="Cakes and Pastries" />
              </div>
              <div className="category-name">Cake Corner</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Events Section */}
      <div id="events" className="events">
        <h2 className="events-title fade-up">Explore Our Events</h2>
        <div className="events-list">
          {/* Event 1: Birthday */}
          <div className="event">
            <div className="event-heading">
              <span className="line"></span>
              <h3 className="event-title">Birthday Decorations</h3>
              <span className="line"></span>
            </div>
            <div className="event-gallery">
              <div className="event-image">
                <img src="gallery/Birthday/Birthday1.jpg" alt="Birthday 1" />
              </div>
              <div className="event-image">
                <img src="gallery/Birthday/Birthday2.jpg" alt="Birthday 2" />
              </div>
              <div className="event-image">
                <img src="gallery/Birthday/Birthday3.jpg" alt="Birthday 3" />
              </div>
              <div className="event-image">
                <img src="gallery/Birthday/Birthday4.jpg" alt="Birthday 4" />
              </div>
            </div>
            <Link to="/gallery?type=birthday decor" className="view-all-button">
              View All
            </Link>
          </div>

          {/* Event 2: Wedding */}
          <div className="event">
            <div className="event-heading">
              <span className="line"></span>
              <h3 className="event-title">Wedding Decorations</h3>
              <span className="line"></span>
            </div>
            <div className="event-gallery">
              <div className="event-image">
                <img src="gallery/Wedding/Wedding1.jpg" alt="Wedding 1" />
              </div>
              <div className="event-image">
                <img src="gallery/Wedding/Wedding2.jpg" alt="Wedding 2" />
              </div>
              <div className="event-image">
                <img src="gallery/Wedding/Wedding3.jpg" alt="Wedding 3" />
              </div>
              <div className="event-image">
                <img src="gallery/Wedding/Wedding4.jpg" alt="Wedding 4" />
              </div>
            </div>
            <Link to="/gallery?type=wedding decor" className="category-link">
              View All
            </Link>
          </div>

          {/* Event 3: Ring Ceremony */}
          <div className="event">
            <div className="event-heading">
              <span className="line"></span>
              <h3 className="event-title">Ring Ceremonies</h3>
              <span className="line"></span>
            </div>
            <div className="event-gallery">
              <div className="event-image">
                <img src="gallery/Ring/Ring1.jpg" alt="Ring 1" />
              </div>
              <div className="event-image">
                <img src="gallery/Ring/Ring2.jpg" alt="Ring 2" />
              </div>
              <div className="event-image">
                <img src="gallery/Ring/Ring3.jpeg" alt="Ring 3" />
              </div>
              <div className="event-image">
                <img src="gallery/Ring/Ring4.jpg" alt="Ring 4" />
              </div>
            </div>
            <Link
              to="/gallery?type=ring ceremony platter"
              className="view-all-button"
            >
              View All
            </Link>
          </div>

          {/* Event 4: Gift Packing */}
          <div className="event">
            <div className="event-heading">
              <span className="line"></span>
              <h3 className="event-title">Gift Packing</h3>
              <span className="line"></span>
            </div>
            <div className="event-gallery">
              <div className="event-image">
                <img src="gallery/Gift/Gift1.jpg" alt="Gift 1" />
              </div>
              <div className="event-image">
                <img src="gallery/Gift/Gift2.jpg" alt="Gift 2" />
              </div>
              <div className="event-image">
                <img src="gallery/Gift/Gift3.jpg" alt="Gift 3" />
              </div>
              <div className="event-image">
                <img src="gallery/Gift/Gift4.jpg" alt="Gift 4" />
              </div>
            </div>
            <Link to="/gallery?type=gift packing" className="view-all-button">
              View All
            </Link>
          </div>

          {/* Cakes */}
          <div className="event">
            <div className="event-heading">
              <span className="line"></span>
              <h3 className="event-title">Cake Corner</h3>
              <span className="line"></span>
            </div>
            <div className="event-gallery">
              <div className="event-image">
                <img src="gallery/Cake/Cake1.jpg" alt="Cake 1" />
              </div>
              <div className="event-image">
                <img src="gallery/Cake/Cake2.jpg" alt="Cake 2" />
              </div>
              <div className="event-image">
                <img src="gallery/Cake/Cake3.jpg" alt="Cake 3" />
              </div>
              <div className="event-image">
                <img src="gallery/Cake/Cake4.jpg" alt="Cake 4" />
              </div>
            </div>
            <Link to="/gallery?type=cake corner" className="view-all-button">
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div id="reviews" className="reviews">
        <h2 className="reviews-title fade-up">What Our Customers Say</h2>
        <div className="reviews-slider">
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
                <p className="review-text">{review.text}</p>
                <span className="review-author">{review.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback form (new) */}
      <div id="feedback" className="feedback">
        <h2 className="feedback-title fade-up">Leave Feedback</h2>
        <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={feedbackName}
            onChange={(e) => setFeedbackName(e.target.value)}
            aria-label="Your name"
          />
          <select
            value={feedbackRating}
            onChange={(e) => setFeedbackRating(Number(e.target.value))}
            aria-label="Rating"
          >
            <option value={5}>5 — Excellent</option>
            <option value={4}>4 — Very good</option>
            <option value={3}>3 — Good</option>
            <option value={2}>2 — Fair</option>
            <option value={1}>1 — Poor</option>
          </select>
          <textarea
            placeholder="Your feedback"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
            aria-label="Feedback"
          />
          <button className="feedback-button" type="submit">
            Submit Feedback
          </button>
        </form>
      </div>

      {/* FAQs */}
      <div id="faqs" className="faqs">
        <h2 className="faqs-title fade-up">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${openFaq === index ? "open" : ""}`}
            key={index}
          >
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {faq.question}
              <span className="faq-icon">{openFaq === index ? "▲" : "▼"}</span>
            </div>
            <div className="faq-answer">{faq.answer}</div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div id="contact" className="contact">
        <h2 className="contact-title fade-up">Get in Touch</h2>
        <p className="contact-subtitle">
          We'd love to hear from you! Reach out for inquiries or bookings.
        </p>
        <div className="contact-buttons">
          <a href="tel:+1234567890" className="contact-button call-button">
            <FaPhoneAlt className="contact-icon" /> Call Us
          </a>
          <a
            href="https://wa.me/919045328550?text=Hi%2C%20I%20want%20to%20make%20a%20query%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button whatsapp-button"
          >
            <FaWhatsapp className="contact-icon" /> WhatsApp
          </a>

          <a
            href="https://www.instagram.com/tandon_shop_for_party?igsh=MXR2NDg2MmVzNDBhbQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button instagram-button"
          >
            <FaInstagram className="contact-icon" /> Instagram
          </a>
        </div>
      </div>

      {/* Location */}
      <div className="location">
        <h2 className="location-title fade-up">Find Us Here</h2>
        <div className="location-name">
          <FaMapMarkerAlt /> Tandon Decorators, Sambhal, Uttar Pradesh
        </div>{" "}
        <div className="location-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3503.533260355046!2d78.56569937549901!3d28.583775075691413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDM1JzAxLjYiTiA3OMKwMzQnMDUuOCJF!5e0!3m2!1sen!2sin!4v1762344605440!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
