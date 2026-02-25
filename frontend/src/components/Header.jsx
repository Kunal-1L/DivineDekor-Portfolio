import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import logoAnimation from "../../public/logo.json";
import "./Home.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <div className="logo-container" onClick={() => navigate("/")}>
          <Lottie
            animationData={logoAnimation}
            loop={true}
            className="logo-animation"
          />
          <div className="logo-name">
            <h1 className="logo-title">TandonEvents</h1>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-action" onClick={() => navigate("/gallery")}>
            Gallery
          </div>
          <div className="header-action" onClick={() => navigate("/contact")}>
            Contacts
          </div>
        </div>

        <button
          className={`header-hamburger ${menuOpen ? "open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((s) => !s)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-item" onClick={() => navigate("/gallery")}>
          Gallery
        </div>
        <div className="mobile-menu-item" onClick={() => navigate("/contact")}>
          Contacts
        </div>
      </div>
    </>
  );
};

export default Header;
