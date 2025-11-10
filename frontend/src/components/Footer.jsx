import { FaPhoneAlt, FaWhatsapp, FaInstagram } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";
const VITE_ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY;

const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (feature) => {
    navigate(feature);
  };
  const handleAdminClick = () => {
    const key = prompt("Enter admin secret key:");
    if (key === VITE_ADMIN_SECRET_KEY) {
      localStorage.setItem("isAdmin", "true");
      navigate("/");
    } else {
      alert("❌ Wrong key!");
    }
  };
  return (
    <div className="footer">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-about">
          <h3>About TandonDekor</h3>
          <p>
            At TandonDekor, we specialize in creating unforgettable event
            decorations tailored to your unique needs. Let us transform your
            special moments into cherished memories.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <button onClick={() => handleLinkClick("/#categories")}>
                Categories
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("/#reviews")}>
                Reviews
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick("/#faqs")}>FAQs</button>
            </li>
            <li>
              <button onClick={() => handleAdminClick()}>Admin</button>
            </li>
          </ul>
        </div>
        {/* Social Media Links */}
        <div className="footer-social">
          <a
            href="https://wa.me/919045328550?text=Hi%2C%20I%20want%20to%20make%20a%20query%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon whatsapp"
          >
            <FaWhatsapp />
          </a>
          <a
            href="https://www.instagram.com/tandon_shop_for_party?igsh=MXR2NDg2MmVzNDBhbQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon instagram"
          >
            <FaInstagram />
          </a>
          <a href="tel:+919045328550" className="social-icon phone">
            <FaPhoneAlt />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>
          &copy; {new Date().getFullYear()} TandonDekor. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
