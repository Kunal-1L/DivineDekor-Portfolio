import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import Contacts from "./components/Contacts";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

// Separate component to handle routes with location-based key
const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes key={location.key} location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contacts />} />
      <Route
        path="*"
        element={
          <div className="not-found">
            <h1>404 - Page Not Found</h1>
            <a href="/">Go Home</a>
          </div>
        }
      />
    </Routes>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="app-loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
